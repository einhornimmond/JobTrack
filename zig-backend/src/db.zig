const std = @import("std");
const sqlite = @import("sqlite");
const contactTypeTableName = "entity_contact_type";
const statusTypeTableName = "status_types";

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
        \\CREATE TABLE IF NOT EXISTS applications (
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
    , .{}, .{});

    try db.exec(
        \\CREATE TABLE IF NOT EXISTS entity_contact_type (
        \\  id INTEGER NOT NULL,
        \\  name TEXT NOT NULL
        \\)
    , .{}, .{});

    try db.exec(
        \\CREATE TABLE IF NOT EXISTS status_types (
        \\  id INTEGER NOT NULL,
        \\  name TEXT NOT NULL
        \\)
    , .{}, .{});

    return db;
}
