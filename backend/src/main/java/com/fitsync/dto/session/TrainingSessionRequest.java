package com.fitsync.dto.session;

import jakarta.validation.constraints.NotBlank;

public class TrainingSessionRequest {
    private String trainerId;
    private String memberId;
    @NotBlank(message = "Title is required")
    private String title;
    private String sessionType = "personal_training";
    private String startTime;
    private String endTime;
    private String date;
    private String notes;

    public TrainingSessionRequest() {}

    public String getTrainerId() { return trainerId; }
    public void setTrainerId(String trainerId) { this.trainerId = trainerId; }

    public String getMemberId() { return memberId; }
    public void setMemberId(String memberId) { this.memberId = memberId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSessionType() { return sessionType; }
    public void setSessionType(String sessionType) { this.sessionType = sessionType; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
