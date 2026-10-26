package com.fitsync.repository;

import com.fitsync.entity.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TrainerRepository extends JpaRepository<Trainer, UUID> {
    Optional<Trainer> findByUserId(UUID userId);
    List<Trainer> findByStatus(String status);

    @Query("SELECT t FROM Trainer t LEFT JOIN FETCH t.user")
    List<Trainer> findAllWithUser();
}
