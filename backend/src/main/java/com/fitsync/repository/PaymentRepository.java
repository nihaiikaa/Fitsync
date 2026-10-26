package com.fitsync.repository;

import com.fitsync.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    @Query("SELECT p FROM Payment p LEFT JOIN FETCH p.member m LEFT JOIN FETCH m.user LEFT JOIN FETCH p.membership ms LEFT JOIN FETCH ms.membershipPlan ORDER BY p.createdAt DESC")
    List<Payment> findAllWithDetails();

    @Query("SELECT p FROM Payment p LEFT JOIN FETCH p.member m LEFT JOIN FETCH m.user LEFT JOIN FETCH p.membership ms LEFT JOIN FETCH ms.membershipPlan WHERE p.member.id = :memberId ORDER BY p.createdAt DESC")
    List<Payment> findByMemberIdWithDetails(@Param("memberId") UUID memberId);

    List<Payment> findByStatus(String status);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.status = 'COMPLETED'")
    BigDecimal calculateTotalVerifiedRevenue();
}
