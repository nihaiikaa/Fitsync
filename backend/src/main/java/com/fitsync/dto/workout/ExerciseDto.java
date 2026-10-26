package com.fitsync.dto.workout;

import java.math.BigDecimal;

public class ExerciseDto {
    private String id;
    private String name;
    private String muscleGroup;
    private String equipment;
    private int sets;
    private int reps;
    private BigDecimal targetWeightKg;
    private int restSeconds;
    private String notes;

    public ExerciseDto() {}

    public ExerciseDto(String id, String name, String muscleGroup, String equipment, int sets, int reps, BigDecimal targetWeightKg, int restSeconds, String notes) {
        this.id = id;
        this.name = name;
        this.muscleGroup = muscleGroup;
        this.equipment = equipment;
        this.sets = sets;
        this.reps = reps;
        this.targetWeightKg = targetWeightKg;
        this.restSeconds = restSeconds;
        this.notes = notes;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getMuscleGroup() { return muscleGroup; }
    public void setMuscleGroup(String muscleGroup) { this.muscleGroup = muscleGroup; }

    public String getEquipment() { return equipment; }
    public void setEquipment(String equipment) { this.equipment = equipment; }

    public int getSets() { return sets; }
    public void setSets(int sets) { this.sets = sets; }

    public int getReps() { return reps; }
    public void setReps(int reps) { this.reps = reps; }

    public BigDecimal getTargetWeightKg() { return targetWeightKg; }
    public void setTargetWeightKg(BigDecimal targetWeightKg) { this.targetWeightKg = targetWeightKg; }

    public int getRestSeconds() { return restSeconds; }
    public void setRestSeconds(int restSeconds) { this.restSeconds = restSeconds; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
