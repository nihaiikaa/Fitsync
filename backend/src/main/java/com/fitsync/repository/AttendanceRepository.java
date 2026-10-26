package com.fitsync.repository;

import com.fitsync.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, UUID> {
    @Query("SELECT a FROM Attendance a LEFT JOIN FETCH a.member m LEFT JOIN FETCH m.user ORDER BY a.attendanceDate DESC, a.checkInTime DESC")
    List<Attendance> findAllWithDetails();

    @Query("SELECT a FROM Attendance a LEFT JOIN FETCH a.member m LEFT JOIN FETCH m.user WHERE a.member.id = :memberId ORDER BY a.attendanceDate DESC")
    List<Attendance> findByMemberIdWithDetails(@Param("memberId") UUID memberId);

    List<Attendance> findByAttendanceDate(LocalDate date);
    long countByMemberId(UUID memberId);
}
