package com.fitsync.dto.workout;

import java.util.ArrayList;
import java.util.List;

public class WorkoutPlanDto {
    private String id;
    private String title;
    private String description;
    private String trainerId;
    private String trainerName;
    private String targetLevel;
    private int durationWeeks;
    private int daysPerWeek;
    private List<ExerciseDto> exercises = new ArrayList<>();

    public WorkoutPlanDto() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getTrainerId() { return trainerId; }
    public void setTrainerId(String trainerId) { this.trainerId = trainerId; }

    public String getTrainerName() { return trainerName; }
    public void setTrainerName(String trainerName) { this.trainerName = trainerName; }

    public String getTargetLevel() { return targetLevel; }
    public void setTargetLevel(String targetLevel) { this.targetLevel = targetLevel; }

    public int getDurationWeeks() { return durationWeeks; }
    public void setDurationWeeks(int durationWeeks) { this.durationWeeks = durationWeeks; }

    public int getDaysPerWeek() { return daysPerWeek; }
    public void setDaysPerWeek(int daysPerWeek) { this.daysPerWeek = daysPerWeek; }

    public List<ExerciseDto> getExercises() { return exercises; }
    public void setExercises(List<ExerciseDto> exercises) { this.exercises = exercises; }
}
