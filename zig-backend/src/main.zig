const db = @import("db.zig");
const std = @import("std");
const sqlite = @import("sqlite");
const httpz = @import("httpz");
const Application = @import("Application.zig");
const appRepro = @import("ApplicationRepository.zig");
const statusTypeRepo = @import("StatusTypeRepository.zig");
const contactTypeRepo = @import("ContactTypeRepository.zig");

const App = struct {
    db: *sqlite.Db,
    allocator: std.mem.Allocator,
    mutex: std.Thread.Mutex,
};

pub fn main() !void {
    // memory management
    const allocator = std.heap.smp_allocator;
    // var buffer: [1024 * 1024 * 10]u8 = undefined;
    // var fba = std.heap.FixedBufferAllocator.init(&buffer);
    // const allocator = fba.allocator();

    // init db, create table if not exists
    var database = try db.initDb();
    defer database.deinit();

    // start http server
    var app = App{
        .db = &database,
        .allocator = allocator,
        .mutex = std.Thread.Mutex{},
    };
    var server = try httpz.Server(*App).init(allocator, .{ .port = 3000 }, &app);
    var router = try server.router(.{});

    // Route for static files
    router.get("/*", serveStaticFile, .{});

    // api
    router.get("/api/applications", getAllApplicationsRoute, .{});
    router.get("/api/applications/last6months", getApplicationsLast6MonthsRoute, .{});
    router.get("/api/statusTypes", getAllStatusTypesRoute, .{});
    router.get("/api/contactTypes", getAllContactTypesRoute, .{});

    std.debug.print("Listening on localhost:3000\n", .{});
    try server.listen();
}

fn getAllApplicationsRoute(app: *App, _: *httpz.Request, res: *httpz.Response) !void {
    app.mutex.lock();
    defer app.mutex.unlock();

    const applications = try appRepro.getAllApplications(app.allocator, app.db);
    defer app.allocator.free(applications);
    try res.json(applications, .{});
}

fn getApplicationsLast6MonthsRoute(app: *App, _: *httpz.Request, res: *httpz.Response) !void {
    app.mutex.lock();
    defer app.mutex.unlock();

    const applications = try appRepro.getApplicationsLast6Months(app.allocator, app.db);
    defer app.allocator.free(applications);
    try res.json(applications, .{});
}

fn getAllStatusTypesRoute(app: *App, _: *httpz.Request, res: *httpz.Response) !void {
    app.mutex.lock();
    defer app.mutex.unlock();

    const statusTypes = try statusTypeRepo.getAllStatusTypes(app.allocator, app.db);
    defer app.allocator.free(statusTypes);
    try res.json(statusTypes, .{});
}

fn getAllContactTypesRoute(app: *App, _: *httpz.Request, res: *httpz.Response) !void {
    app.mutex.lock();
    defer app.mutex.unlock();

    const contactTypes = try contactTypeRepo.getAllContactTypes(app.allocator, app.db);
    defer app.allocator.free(contactTypes);
    try res.json(contactTypes, .{});
}

fn serveStaticFile(app: *App, req: *httpz.Request, res: *httpz.Response) !void {
    const allocator = app.allocator;
    var path = req.url.path;
    if (std.mem.eql(u8, path, "/") or std.fs.path.extension(path).len == 0) {
        path = "/index.html";
    }
    const full_path = try std.fs.path.join(allocator, &.{ ".", path });
    defer allocator.free(full_path); // not needed for arena allocator

    var file = std.fs.cwd().openFile(full_path, .{}) catch {
        std.debug.print("File not found: {s}\n", .{full_path});
        res.status = 404;
        res.body = "Not found";
        return;
    };
    defer file.close();

    const buf = file.readToEndAlloc(allocator, 10 * 1024 * 1024) catch |err| { // max. 10MB
        std.debug.print("Error reading file: {s}, buffer to small\n", .{full_path});
        if (err == error.StreamTooLong) {
            res.status = 413;
            res.body = "File too large, exceeds 10MB limit";
            return;
        }
        return err;
    };
    defer allocator.free(buf); // not needed for arena allocator

    const file_extension = std.fs.path.extension(path);

    // Set the correct content type based on file extension
    if (std.mem.eql(u8, file_extension, ".html")) {
        res.header("Content-Type", "text/html; charset=utf-8");
    } else if (std.mem.eql(u8, file_extension, ".css")) {
        res.header("Content-Type", "text/css; charset=utf-8");
    } else if (std.mem.eql(u8, file_extension, ".ico")) {
        res.header("Content-Type", "image/x-icon");
    } else if (std.mem.eql(u8, file_extension, ".js")) {
        res.header("Content-Type", "application/javascript");
    } else {
        // For unknown file types, you can use a fallback or skip setting the header
        res.header("Content-Type", "application/octet-stream");
    }

    try res.writer().writeAll(buf);
}
