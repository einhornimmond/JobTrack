const std = @import("std");

pub const applicationTableName = "applications";

const Date = std.time.Timestamp;

id: i32,
applying_date: Date,
employer: []const u8,
webpage: []const u8,
position: []const u8,
contact_person: []const u8,
contact_person_gender: []const u8,
acknowledgement_date: Date,
interview_date: Date,
declination_date: Date,
acknowledged_occured: bool,
interview_occured: bool,
declination_occured: bool,
contact_type_id: i32,
status_id: i32,

pub fn init(data: anytype) @This() {
    return .{
        .id = data.id,
        .applying_date = try getDate(data.applying_date),
        .employer = data.employer,
        .webpage = data.webpage,
        .position = data.position,
        .contact_person = data.contact_person,
        .contact_person_gender = data.contact_person_gender,
        .acknowledgement_date = try getDate(data.acknowledgement_date),
        .interview_date = try getDate(data.interview_date),
        .declination_date = try getDate(data.declination_date),
        .acknowledged_occured = data.acknowledged_occured,
        .interview_occured = data.interview_occured,
        .declination_occured = data.declination_occured,
        .contact_type_id = data.contact_type_id,
        .status_id = data.status_id,
    };
}

fn getDate(input: anytype) !Date {
    if (input) |date| {
        return date;
    } else |str| {
        return try std.time.parseISODateTime(str);
    }
}
