package com.fitsync.dto.trainer;

import java.math.BigDecimal;

public class TrainerDto {
    private String id;
    private String name;
    private String email;
    private String phone;
    private String avatar;
    private String specialty;
    private int experienceYears;
    private long assignedMemberCount;
    private BigDecimal rating;
    private String bio;
    private String status;

    public TrainerDto() {}

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

    public String getSpecialty() { return specialty; }
    public void setSpecialty(String specialty) { this.specialty = specialty; }

    public int getExperienceYears() { return experienceYears; }
    public void setExperienceYears(int experienceYears) { this.experienceYears = experienceYears; }

    public long getAssignedMemberCount() { return assignedMemberCount; }
    public void setAssignedMemberCount(long assignedMemberCount) { this.assignedMemberCount = assignedMemberCount; }

    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
