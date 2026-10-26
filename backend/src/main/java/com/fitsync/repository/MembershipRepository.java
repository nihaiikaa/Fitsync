package com.fitsync.repository;

import com.fitsync.entity.Membership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface MembershipRepository extends JpaRepository<Membership, UUID> {
    List<Membership> findByMemberId(UUID memberId);

    @Query("SELECT m FROM Membership m LEFT JOIN FETCH m.membershipPlan WHERE m.member.id = :memberId AND m.status = 'ACTIVE' ORDER BY m.endDate DESC")
    List<Membership> findActiveByMemberId(@Param("memberId") UUID memberId);

    @Query("SELECT m FROM Membership m LEFT JOIN FETCH m.member mem LEFT JOIN FETCH mem.user LEFT JOIN FETCH m.membershipPlan WHERE m.endDate BETWEEN :start AND :end AND m.status = 'ACTIVE'")
    List<Membership> findExpiringBetween(@Param("start") LocalDate start, @Param("end") LocalDate end);

    long countByStatus(String status);
}
