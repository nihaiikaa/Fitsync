package com.fitsync.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "workout_logs")
public class WorkoutLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id")
    private Exercise exercise;

    @NotNull
    @Column(name = "completed_sets", nullable = false)
    private Integer completedSets;

    @NotNull
    @Column(name = "repetitions", nullable = false)
    private Integer repetitions;

    @NotNull
    @Column(name = "weight_used_kg", nullable = false, precision = 6, scale = 2)
    private BigDecimal weightUsedKg;

    @Column(name = "completed_at", nullable = false)
    private OffsetDateTime completedAt = OffsetDateTime.now();

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    public WorkoutLog() {}

    public WorkoutLog(Member member, Exercise exercise, Integer completedSets, Integer repetitions, BigDecimal weightUsedKg, String notes) {
        this.member = member;
        this.exercise = exercise;
        this.completedSets = completedSets;
        this.repetitions = repetitions;
        this.weightUsedKg = weightUsedKg;
        this.completedAt = OffsetDateTime.now();
        this.notes = notes;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Member getMember() { return member; }
    public void setMember(Member member) { this.member = member; }

    public Exercise getExercise() { return exercise; }
    public void setExercise(Exercise exercise) { this.exercise = exercise; }

    public Integer getCompletedSets() { return completedSets; }
    public void setCompletedSets(Integer completedSets) { this.completedSets = completedSets; }

    public Integer getRepetitions() { return repetitions; }
    public void setRepetitions(Integer repetitions) { this.repetitions = repetitions; }

    public BigDecimal getWeightUsedKg() { return weightUsedKg; }
    public void setWeightUsedKg(BigDecimal weightUsedKg) { this.weightUsedKg = weightUsedKg; }

    public OffsetDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(OffsetDateTime completedAt) { this.completedAt = completedAt; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
