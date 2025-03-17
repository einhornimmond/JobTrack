const StatusType = @import("StatusType.zig");
const statusTypeTableName = @import("StatusType.zig").statusTypeTableName;
const sqlite = @import("sqlite");
const std = @import("std");

pub fn getAllStatusTypes(allocator: std.mem.Allocator, db: *sqlite.Db) ![]StatusType {
    var stmt = try db.prepare("SELECT * FROM " ++ statusTypeTableName ++ " ORDER BY id");
    defer stmt.deinit();
    return try stmt.all(StatusType, allocator, .{}, .{});
}
