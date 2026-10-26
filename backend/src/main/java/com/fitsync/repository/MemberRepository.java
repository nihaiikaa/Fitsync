package com.fitsync.repository;

import com.fitsync.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MemberRepository extends JpaRepository<Member, UUID> {
    Optional<Member> findByUserId(UUID userId);

    @Query("SELECT m FROM Member m LEFT JOIN FETCH m.user LEFT JOIN FETCH m.assignedTrainer t LEFT JOIN FETCH t.user WHERE m.id = :id")
    Optional<Member> findByIdWithDetails(@Param("id") UUID id);

    @Query("SELECT m FROM Member m LEFT JOIN FETCH m.user LEFT JOIN FETCH m.assignedTrainer t LEFT JOIN FETCH t.user")
    List<Member> findAllWithDetails();

    @Query("SELECT m FROM Member m LEFT JOIN FETCH m.user WHERE m.assignedTrainer.id = :trainerId")
    List<Member> findByAssignedTrainerId(@Param("trainerId") UUID trainerId);

    long count();
}
