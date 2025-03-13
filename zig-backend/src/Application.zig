const std = @import("std");

pub const applicationTableName = "applications";

id: i32,
applying_date: []const u8,
employer: []const u8,
webpage: []const u8,
position: []const u8,
contact_person: []const u8,
contact_person_gender: []const u8,
acknowledgement_date: []const u8,
interview_date: []const u8,
declination_date: []const u8,
acknowledged_occured: bool,
interview_occured: bool,
declination_occured: bool,
contact_type_id: i32,
status_id: i32,
