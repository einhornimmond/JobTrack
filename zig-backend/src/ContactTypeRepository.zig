const ContactType = @import("ContactType.zig");
const contactTypeTableName = @import("ContactType.zig").contactTypeTableName;
const sqlite = @import("sqlite");
const std = @import("std");

pub fn getAllContactTypes(allocator: std.mem.Allocator, db: *sqlite.Db) ![]ContactType {
    var stmt = try db.prepare("SELECT * FROM " ++ contactTypeTableName ++ " ORDER BY id");
    defer stmt.deinit();
    return try stmt.all(ContactType, allocator, .{}, .{});
}
