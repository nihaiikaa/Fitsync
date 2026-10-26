package com.fitsync.dto.workout;


public class WorkoutLogDto {
    private String id;
    private String title;
    private String date;
    private String duration;
    private int calories;
    private boolean completed = true;
    private int rating = 5;

    public WorkoutLogDto() {}

    public WorkoutLogDto(String id, String title, String date, String duration, int calories, boolean completed, int rating) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.duration = duration;
        this.calories = calories;
        this.completed = completed;
        this.rating = rating;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public int getCalories() { return calories; }
    public void setCalories(int calories) { this.calories = calories; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }
}
