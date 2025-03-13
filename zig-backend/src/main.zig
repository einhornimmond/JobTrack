const db = @import("db.zig");
const std = @import("std");
const sqlite = @import("sqlite");
const httpz = @import("httpz");
const Application = @import("Application.zig");
const appRepro = @import("ApplicationRepository.zig");

const App = struct { db: *sqlite.Db };

pub fn main() !void {
    // memory management
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();

    // init db, create table if not exists
    var database = try db.initDb();
    defer database.deinit();

    // start http server
    var app = App{ .db = &database };
    var server = try httpz.Server(*App).init(allocator, .{ .port = 3000 }, &app);
    var router = try server.router(.{});

    // Route for static files
    router.get("/*", serveStaticFile, .{});

    // api
    router.get("/api/applications", getAllApplicationsRoute, .{});
    router.get("/api/applications/last6months", getApplicationsLast6MonthsRoute, .{});

    std.debug.print("Listening on localhost:3000\n", .{});
    try server.listen();
}

fn getAllApplicationsRoute(app: *App, _: *httpz.Request, res: *httpz.Response) !void {
    try res.json(try appRepro.getAllApplications(app.db), .{});
}

fn getApplicationsLast6MonthsRoute(app: *App, _: *httpz.Request, res: *httpz.Response) !void {
    try res.json(try appRepro.getApplicationsLast6Months(app.db), .{});
}

fn serveStaticFile(_: *App, req: *httpz.Request, res: *httpz.Response) !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();

    var path = req.url.path;
    if (std.mem.eql(u8, path, "/") or std.fs.path.extension(path).len == 0) {
        path = "/index.html";
    }
    const full_path = try std.fs.path.join(allocator, &.{ ".", path });
    defer allocator.free(full_path);

    var file = std.fs.cwd().openFile(full_path, .{}) catch {
        std.debug.print("File not found: {s}\n", .{full_path});
        res.status = 404;
        res.body = "Not found";
        return;
    };
    defer file.close();

    const buf = try file.readToEndAlloc(allocator, 10 * 1024 * 1024); // max. 10MB
    defer allocator.free(buf);

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
