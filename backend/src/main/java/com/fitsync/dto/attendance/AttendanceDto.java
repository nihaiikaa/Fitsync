package com.fitsync.dto.attendance;

public class AttendanceDto {
    private String id;
    private String memberId;
    private String memberName;
    private String checkInTime;
    private String checkOutTime;
    private String date;
    private String status;

    public AttendanceDto() {}

    public AttendanceDto(String id, String memberId, String memberName, String checkInTime, String checkOutTime, String date, String status) {
        this.id = id;
        this.memberId = memberId;
        this.memberName = memberName;
        this.checkInTime = checkInTime;
        this.checkOutTime = checkOutTime;
        this.date = date;
        this.status = status;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getMemberId() { return memberId; }
    public void setMemberId(String memberId) { this.memberId = memberId; }

    public String getMemberName() { return memberName; }
    public void setMemberName(String memberName) { this.memberName = memberName; }

    public String getCheckInTime() { return checkInTime; }
    public void setCheckInTime(String checkInTime) { this.checkInTime = checkInTime; }

    public String getCheckOutTime() { return checkOutTime; }
    public void setCheckOutTime(String checkOutTime) { this.checkOutTime = checkOutTime; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
