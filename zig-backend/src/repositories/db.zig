const std = @import("std");
const sqlite = @import("sqlite");
const applicationTableName = @import("../model/Application").applicationTableName;
const contactTypeTableName = @import("../model/ContactType").contactTypeTableName;
const statusTypeTableName = @import("../model/StatusType").statusTypeTableName;

pub fn main() !void {
    var db = try sqlite.Db.init(.{
        .mode = sqlite.Db.Mode{ .File = "db.sqlite3" },
        .open_flags = .{
            .write = true,
            .create = true,
        },
        .threading_mode = .MultiThread,
    });
    defer db.deinit();

    try db.exec(&std.fmt.format(
        \\CREATE TABLE IF NOT EXISTS {s} (
        \\  id INTEGER PRIMARY KEY AUTOINCREMENT,
        \\  applying_date TEXT NOT NULL,
        \\  employer TEXT NOT NULL,
        \\  webpage TEXT NOT NULL,
        \\  position TEXT NOT NULL,
        \\  contact_person TEXT NOT NULL,
        \\  contact_person_gender TEXT NOT NULL,
        \\  acknowledgement_date TEXT,
        \\  interview_date TEXT,
        \\  declination_date TEXT,
        \\  acknowledged_occured BOOLEAN NOT NULL,
        \\  interview_occured BOOLEAN NOT NULL,
        \\  declination_occured BOOLEAN NOT NULL,
        \\  contact_type_id INTEGER NOT NULL,
        \\  status_id INTEGER NOT NULL
        \\)
    , .{applicationTableName}));

    try db.exec(&std.fmt.format(
        \\CREATE TABLE IF NOT EXISTS {s} (
        \\  id INTEGER NOT NULL,
        \\  name TEXT NOT NULL
        \\)
    , .{contactTypeTableName}));

    try db.exec(&std.fmt.format(
        \\CREATE TABLE IF NOT EXISTS {s} (
        \\  id INTEGER NOT NULL,
        \\  name TEXT NOT NULL
        \\)
    , .{statusTypeTableName}));
}
