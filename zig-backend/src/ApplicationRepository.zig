const Application = @import("Application.zig");
const sqlite = @import("sqlite");
const std = @import("std");

fn getApplicationArray(db: *sqlite.Db, sql: []const u8) ![]Application {
    var stmt = try db.prepareDynamic(sql);
    defer stmt.deinit();
    return try stmt.all(Application, std.heap.page_allocator, .{}, .{});
}

pub fn getAllApplications(db: *sqlite.Db) ![]Application {
    return getApplicationArray(db, "SELECT * FROM applications ORDER BY applying_date DESC");
}

pub fn getApplicationsLast6Months(db: *sqlite.Db) ![]Application {
    return getApplicationArray(db, "SELECT * FROM applications WHERE applying_date >= date('now', '-6 months') ORDER BY applying_date DESC");
}
