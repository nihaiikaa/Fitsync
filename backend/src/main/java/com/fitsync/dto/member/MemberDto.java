package com.fitsync.dto.member;

import java.math.BigDecimal;

public class MemberDto {
    private String id;
    private String name;
    private String email;
    private String phone;
    private String avatar;
    private String membershipPlanId;
    private String membershipPlanName;
    private String startDate;
    private String expiryDate;
    private String status;
    private String trainerId;
    private String trainerName;
    private BigDecimal currentWeight;
    private BigDecimal targetWeight;
    private Integer height;
    private String emergencyContact;
    private long attendanceCount;

    public MemberDto() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public String getMembershipPlanId() { return membershipPlanId; }
    public void setMembershipPlanId(String membershipPlanId) { this.membershipPlanId = membershipPlanId; }

    public String getMembershipPlanName() { return membershipPlanName; }
    public void setMembershipPlanName(String membershipPlanName) { this.membershipPlanName = membershipPlanName; }

    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }

    public String getExpiryDate() { return expiryDate; }
    public void setExpiryDate(String expiryDate) { this.expiryDate = expiryDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getTrainerId() { return trainerId; }
    public void setTrainerId(String trainerId) { this.trainerId = trainerId; }

    public String getTrainerName() { return trainerName; }
    public void setTrainerName(String trainerName) { this.trainerName = trainerName; }

    public BigDecimal getCurrentWeight() { return currentWeight; }
    public void setCurrentWeight(BigDecimal currentWeight) { this.currentWeight = currentWeight; }

    public BigDecimal getTargetWeight() { return targetWeight; }
    public void setTargetWeight(BigDecimal targetWeight) { this.targetWeight = targetWeight; }

    public Integer getHeight() { return height; }
    public void setHeight(Integer height) { this.height = height; }

    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }

    public long getAttendanceCount() { return attendanceCount; }
    public void setAttendanceCount(long attendanceCount) { this.attendanceCount = attendanceCount; }
}
