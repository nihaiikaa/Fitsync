package com.fitsync.dto.workout;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class WorkoutSessionDto {
    private String id;
    private String memberId;
    private String workoutPlanId;
    private String title;
    private String date;
    private int durationMinutes;
    private int caloriesBurned;
    private String status = "in_progress";
    private String notes;
    private List<WorkoutExerciseLogDto> exercises = new ArrayList<>();

    public WorkoutSessionDto() {}

    public static class ExerciseSetLogDto {
        private int setNumber;
        private int reps;
        private BigDecimal weightKg;
        private boolean completed;

        public ExerciseSetLogDto() {}

        public ExerciseSetLogDto(int setNumber, int reps, BigDecimal weightKg, boolean completed) {
            this.setNumber = setNumber;
            this.reps = reps;
            this.weightKg = weightKg;
            this.completed = completed;
        }

        public int getSetNumber() { return setNumber; }
        public void setSetNumber(int setNumber) { this.setNumber = setNumber; }

        public int getReps() { return reps; }
        public void setReps(int reps) { this.reps = reps; }

        public BigDecimal getWeightKg() { return weightKg; }
        public void setWeightKg(BigDecimal weightKg) { this.weightKg = weightKg; }

        public boolean isCompleted() { return completed; }
        public void setCompleted(boolean completed) { this.completed = completed; }
    }

    public static class WorkoutExerciseLogDto {
        private String id;
        private String exerciseId;
        private String exerciseName;
        private String muscleGroup;
        private int targetSets;
        private int targetReps;
        private BigDecimal targetWeightKg;
        private boolean isCompleted;
        private List<ExerciseSetLogDto> completedSets = new ArrayList<>();

        public WorkoutExerciseLogDto() {}

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getExerciseId() { return exerciseId; }
        public void setExerciseId(String exerciseId) { this.exerciseId = exerciseId; }

        public String getExerciseName() { return exerciseName; }
        public void setExerciseName(String exerciseName) { this.exerciseName = exerciseName; }

        public String getMuscleGroup() { return muscleGroup; }
        public void setMuscleGroup(String muscleGroup) { this.muscleGroup = muscleGroup; }

        public int getTargetSets() { return targetSets; }
        public void setTargetSets(int targetSets) { this.targetSets = targetSets; }

        public int getTargetReps() { return targetReps; }
        public void setTargetReps(int targetReps) { this.targetReps = targetReps; }

        public BigDecimal getTargetWeightKg() { return targetWeightKg; }
        public void setTargetWeightKg(BigDecimal targetWeightKg) { this.targetWeightKg = targetWeightKg; }

        public boolean isCompleted() { return isCompleted; }
        public void setCompleted(boolean completed) { isCompleted = completed; }

        public List<ExerciseSetLogDto> getCompletedSets() { return completedSets; }
        public void setCompletedSets(List<ExerciseSetLogDto> completedSets) { this.completedSets = completedSets; }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getMemberId() { return memberId; }
    public void setMemberId(String memberId) { this.memberId = memberId; }

    public String getWorkoutPlanId() { return workoutPlanId; }
    public void setWorkoutPlanId(String workoutPlanId) { this.workoutPlanId = workoutPlanId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public int getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; }

    public int getCaloriesBurned() { return caloriesBurned; }
    public void setCaloriesBurned(int caloriesBurned) { this.caloriesBurned = caloriesBurned; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public List<WorkoutExerciseLogDto> getExercises() { return exercises; }
    public void setExercises(List<WorkoutExerciseLogDto> exercises) { this.exercises = exercises; }
}
