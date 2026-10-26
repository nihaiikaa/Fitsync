package com.fitsync.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "exercises")
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_plan_id", nullable = false)
    private WorkoutPlan workoutPlan;

    @NotBlank
    @Column(name = "name", nullable = false, length = 120)
    private String name;

    @Column(name = "muscle_group", length = 80)
    private String muscleGroup;

    @Column(name = "equipment", length = 80)
    private String equipment;

    @NotNull
    @Column(name = "sets", nullable = false)
    private Integer sets;

    @NotNull
    @Column(name = "repetitions", nullable = false)
    private Integer repetitions;

    @Column(name = "target_weight_kg", precision = 6, scale = 2)
    private BigDecimal targetWeightKg = BigDecimal.ZERO;

    @Column(name = "rest_seconds")
    private Integer restSeconds = 60;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    public Exercise() {}

    public Exercise(WorkoutPlan workoutPlan, String name, String muscleGroup, String equipment, Integer sets, Integer repetitions, BigDecimal targetWeightKg, Integer restSeconds, String notes) {
        this.workoutPlan = workoutPlan;
        this.name = name;
        this.muscleGroup = muscleGroup;
        this.equipment = equipment;
        this.sets = sets;
        this.repetitions = repetitions;
        this.targetWeightKg = targetWeightKg != null ? targetWeightKg : BigDecimal.ZERO;
        this.restSeconds = restSeconds != null ? restSeconds : 60;
        this.notes = notes;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public WorkoutPlan getWorkoutPlan() { return workoutPlan; }
    public void setWorkoutPlan(WorkoutPlan workoutPlan) { this.workoutPlan = workoutPlan; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getMuscleGroup() { return muscleGroup; }
    public void setMuscleGroup(String muscleGroup) { this.muscleGroup = muscleGroup; }

    public String getEquipment() { return equipment; }
    public void setEquipment(String equipment) { this.equipment = equipment; }

    public Integer getSets() { return sets; }
    public void setSets(Integer sets) { this.sets = sets; }

    public Integer getRepetitions() { return repetitions; }
    public void setRepetitions(Integer repetitions) { this.repetitions = repetitions; }

    public BigDecimal getTargetWeightKg() { return targetWeightKg; }
    public void setTargetWeightKg(BigDecimal targetWeightKg) { this.targetWeightKg = targetWeightKg; }

    public Integer getRestSeconds() { return restSeconds; }
    public void setRestSeconds(Integer restSeconds) { this.restSeconds = restSeconds; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
