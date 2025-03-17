const std = @import("std");
const sqlite = @import("sqlite");
const applicationTableName = @import("Application.zig").applicationTableName;
const contactTypeTableName = @import("ContactType.zig").contactTypeTableName;
const statusTypeTableName = @import("StatusType.zig").statusTypeTableName;

pub fn initDb() !sqlite.Db {
    var db = try sqlite.Db.init(.{
        .mode = sqlite.Db.Mode{ .File = "db.sqlite3" },
        .open_flags = .{
            .write = true,
            .create = true,
        },
        .threading_mode = .MultiThread,
    });

    try db.exec(
        \\CREATE TABLE IF NOT EXISTS 
    ++ applicationTableName ++
        \\ (
        \\  id INTEGER PRIMARY KEY,
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
    , .{}, .{});

    try db.exec(
        \\CREATE TABLE IF NOT EXISTS 
    ++ contactTypeTableName ++
        \\ (
        \\  id INTEGER PRIMARY KEY,
        \\  name TEXT NOT NULL
        \\)
    , .{}, .{});

    try db.exec(
        \\CREATE TABLE IF NOT EXISTS 
    ++ statusTypeTableName ++
        \\ (
        \\  id INTEGER PRIMARY KEY,
        \\  name TEXT NOT NULL
        \\)
    , .{}, .{});

    return db;
}
