package com.fitsync.repository;

import com.fitsync.entity.WorkoutPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WorkoutPlanRepository extends JpaRepository<WorkoutPlan, UUID> {
    List<WorkoutPlan> findByMemberId(UUID memberId);
    List<WorkoutPlan> findByTrainerId(UUID trainerId);

    @Query("SELECT wp FROM WorkoutPlan wp LEFT JOIN FETCH wp.exercises LEFT JOIN FETCH wp.trainer t LEFT JOIN FETCH t.user WHERE wp.id = :id")
    Optional<WorkoutPlan> findByIdWithExercises(@Param("id") UUID id);

    @Query("SELECT DISTINCT wp FROM WorkoutPlan wp LEFT JOIN FETCH wp.exercises LEFT JOIN FETCH wp.trainer t LEFT JOIN FETCH t.user")
    List<WorkoutPlan> findAllWithExercises();
}
