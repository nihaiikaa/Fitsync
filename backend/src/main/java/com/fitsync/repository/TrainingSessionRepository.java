package com.fitsync.repository;

import com.fitsync.entity.TrainingSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TrainingSessionRepository extends JpaRepository<TrainingSession, UUID> {
    @Query("SELECT s FROM TrainingSession s LEFT JOIN FETCH s.member m LEFT JOIN FETCH m.user LEFT JOIN FETCH s.trainer t LEFT JOIN FETCH t.user WHERE s.trainer.id = :trainerId ORDER BY s.scheduledAt ASC")
    List<TrainingSession> findByTrainerIdWithDetails(@Param("trainerId") UUID trainerId);

    @Query("SELECT s FROM TrainingSession s LEFT JOIN FETCH s.member m LEFT JOIN FETCH m.user LEFT JOIN FETCH s.trainer t LEFT JOIN FETCH t.user WHERE s.member.id = :memberId ORDER BY s.scheduledAt ASC")
    List<TrainingSession> findByMemberIdWithDetails(@Param("memberId") UUID memberId);

    @Query("SELECT s FROM TrainingSession s LEFT JOIN FETCH s.member m LEFT JOIN FETCH m.user LEFT JOIN FETCH s.trainer t LEFT JOIN FETCH t.user ORDER BY s.scheduledAt ASC")
    List<TrainingSession> findAllWithDetails();
}
