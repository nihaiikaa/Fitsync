package com.fitsync.dto.attendance;

import jakarta.validation.constraints.NotBlank;

public class CheckInRequest {
    @NotBlank(message = "Member ID is required")
    private String memberId;
    private String memberName;

    public CheckInRequest() {}

    public CheckInRequest(String memberId, String memberName) {
        this.memberId = memberId;
        this.memberName = memberName;
    }

    public String getMemberId() { return memberId; }
    public void setMemberId(String memberId) { this.memberId = memberId; }

    public String getMemberName() { return memberName; }
    public void setMemberName(String memberName) { this.memberName = memberName; }
}
