const db = @import("db.zig");
const std = @import("std");

pub fn main() !void {
    // Prints to stderr (it's a shortcut based on `std.io.getStdErr()`)
    std.debug.print("Inhalt von db.zig: {?}\n", .{db});
    // var database = try db.initDb();
    // defer database.deinit();
}
