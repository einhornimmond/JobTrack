const db = @import("db.zig");
const std = @import("std");
const sqlite = @import("sqlite");
const httpz = @import("httpz");
const Application = @import("Application.zig");
const appRepro = @import("ApplicationRepository.zig");

pub fn main() !void {
    // memory management
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();

    // init db, create table if not exists
    var database = try db.initDb();
    defer database.deinit();

    // start http server
    var app = App{
        .db = &database,
    };
    var server = try httpz.Server(*App).init(allocator, .{ .port = 3000 }, &app);
    var router = try server.router(.{});
    router.get("/api/applications", getAllApplicationsRoute, .{});
    try server.listen();

    std.debug.print("Listening on 0.0.0.0:3000\n", .{});
}

const App = struct {
    db: *sqlite.Db,
};

fn getAllApplicationsRoute(app: *App, _: *httpz.Request, res: *httpz.Response) !void {
    try res.json(try appRepro.getAllApplications(app.db), .{});
}
