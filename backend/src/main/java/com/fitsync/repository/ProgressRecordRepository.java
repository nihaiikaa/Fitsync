package com.fitsync.repository;

import com.fitsync.entity.ProgressRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProgressRecordRepository extends JpaRepository<ProgressRecord, UUID> {
    List<ProgressRecord> findByMemberIdOrderByRecordedAtAsc(UUID memberId);
}
