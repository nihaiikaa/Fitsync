package com.fitsync.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "progress_records")
public class ProgressRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @NotNull
    @Column(name = "weight_kg", nullable = false, precision = 5, scale = 2)
    private BigDecimal weightKg;

    @Column(name = "body_fat_percentage", precision = 4, scale = 2)
    private BigDecimal bodyFatPercentage;

    @NotNull
    @Column(name = "recorded_at", nullable = false)
    private LocalDate recordedAt;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    public ProgressRecord() {}

    public ProgressRecord(Member member, BigDecimal weightKg, BigDecimal bodyFatPercentage, LocalDate recordedAt, String notes) {
        this.member = member;
        this.weightKg = weightKg;
        this.bodyFatPercentage = bodyFatPercentage;
        this.recordedAt = recordedAt;
        this.notes = notes;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Member getMember() { return member; }
    public void setMember(Member member) { this.member = member; }

    public BigDecimal getWeightKg() { return weightKg; }
    public void setWeightKg(BigDecimal weightKg) { this.weightKg = weightKg; }

    public BigDecimal getBodyFatPercentage() { return bodyFatPercentage; }
    public void setBodyFatPercentage(BigDecimal bodyFatPercentage) { this.bodyFatPercentage = bodyFatPercentage; }

    public LocalDate getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDate recordedAt) { this.recordedAt = recordedAt; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
