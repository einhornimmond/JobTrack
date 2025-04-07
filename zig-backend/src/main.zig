const db = @import("db.zig");
const std = @import("std");
const sqlite = @import("sqlite");
const httpz = @import("httpz");
const Application = @import("Application.zig");
const StatusType = @import("StatusType.zig");
const ContactType = @import("ContactType.zig");
const applicationTableName = @import("Application.zig").applicationTableName;
const statusTypeTableName = @import("StatusType.zig").statusTypeTableName;
const contactTypeTableName = @import("ContactType.zig").contactTypeTableName;

const App = struct {
    db: *sqlite.Db,
    allocator: std.mem.Allocator,
    mutex: std.Thread.Mutex,
};

fn createDbRoute(
    comptime T: type,
    comptime query: []const u8,
) fn (*App, *httpz.Request, *httpz.Response) anyerror!void {
    return struct {
        fn route(app: *App, _: *httpz.Request, res: *httpz.Response) anyerror!void {
            app.mutex.lock();
            defer app.mutex.unlock();

            var stmt = try app.db.prepare(query);
            defer stmt.deinit();
            var arena = std.heap.ArenaAllocator.init(app.allocator);
            defer arena.deinit();
            const items = try stmt.all(T, arena.allocator(), .{}, .{});
            try res.json(items, .{});
        }
    }.route;
}

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
    defer server.deinit();
    var router = try server.router(.{});

    // Route for static files
    router.get("/*", serveStaticFile, .{});

    // api
    router.get("/api/applications", createDbRoute(Application, "SELECT * FROM " ++ applicationTableName ++ " ORDER BY applying_date DESC"), .{});
    router.get("/api/applications/last6months", createDbRoute(Application, "SELECT * FROM " ++ applicationTableName ++ " WHERE applying_date >= date('now', '-6 months') ORDER BY applying_date DESC"), .{});
    router.get("/api/statusTypes", createDbRoute(StatusType, "SELECT * FROM " ++ statusTypeTableName), .{});
    router.get("/api/contactTypes", createDbRoute(ContactType, "SELECT * FROM " ++ contactTypeTableName), .{});

    std.debug.print("Listening on localhost:3000\n", .{});
    try server.listen();
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
