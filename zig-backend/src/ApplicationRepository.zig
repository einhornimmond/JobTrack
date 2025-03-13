const Application = @import("Application.zig");
const sqlite = @import("sqlite");
const std = @import("std");

pub fn getAllApplications(allocator: std.mem.Allocator, db: *sqlite.Db) ![]Application {
    var stmt = try db.prepare("SELECT * FROM applications ORDER BY applying_date DESC");
    defer stmt.deinit();
    return try stmt.all(Application, allocator, .{}, .{});
}

pub fn getApplicationsLast6Months(allocator: std.mem.Allocator, db: *sqlite.Db) ![]Application {
    var stmt = try db.prepare("SELECT * FROM applications WHERE applying_date >= date('now', '-6 months') ORDER BY applying_date DESC");
    defer stmt.deinit();
    return try stmt.all(Application, allocator, .{}, .{});
}
