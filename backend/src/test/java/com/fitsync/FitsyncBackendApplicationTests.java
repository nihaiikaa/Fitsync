package com.fitsync;

import com.fitsync.entity.*;
import com.fitsync.repository.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class FitsyncBackendApplicationTests {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TrainerRepository trainerRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private MembershipPlanRepository membershipPlanRepository;

    @Autowired
    private MembershipRepository membershipRepository;

    @Autowired
    private WorkoutPlanRepository workoutPlanRepository;

    @Autowired
    private ExerciseRepository exerciseRepository;

    @Autowired
    private WorkoutLogRepository workoutLogRepository;

    @Autowired
    private TrainingSessionRepository trainingSessionRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ProgressRecordRepository progressRecordRepository;

    @Test
    @DisplayName("Application Context Loads Successfully")
    void contextLoads() {
        assertNotNull(userRepository);
        assertNotNull(trainerRepository);
        assertNotNull(memberRepository);
        assertNotNull(membershipPlanRepository);
        assertNotNull(membershipRepository);
        assertNotNull(workoutPlanRepository);
        assertNotNull(exerciseRepository);
        assertNotNull(workoutLogRepository);
        assertNotNull(trainingSessionRepository);
        assertNotNull(attendanceRepository);
        assertNotNull(paymentRepository);
        assertNotNull(progressRecordRepository);
    }

    @Test
    @DisplayName("Verify User, Trainer, and Member entity persistence with UUID")
    void testUserAndProfilePersistence() {
        // Create Admin User
        User admin = new User("Admin User", "admin.test@fitsync.com", "hashed_pw", Role.ADMIN, "+1 555-0001", null);
        User savedAdmin = userRepository.save(admin);
        assertNotNull(savedAdmin.getId());
        assertEquals("Admin User", savedAdmin.getFullName());
        assertEquals(Role.ADMIN, savedAdmin.getRole());

        // Create Trainer User and Profile
        User trainerUser = new User("Marcus Coach", "marcus.test@fitsync.com", "hashed_pw", Role.TRAINER, "+1 555-0002", null);
        User savedTrainerUser = userRepository.save(trainerUser);

        Trainer trainer = new Trainer(savedTrainerUser, "Strength & Hypertrophy", 6, "Expert coach", "Mon-Fri");
        Trainer savedTrainer = trainerRepository.save(trainer);
        assertNotNull(savedTrainer.getId());
        assertEquals("Strength & Hypertrophy", savedTrainer.getSpecialization());

        // Create Member User and Profile
        User memberUser = new User("Sarah Athlete", "sarah.test@fitsync.com", "hashed_pw", Role.MEMBER, "+1 555-0003", null);
        User savedMemberUser = userRepository.save(memberUser);

        Member member = new Member(savedMemberUser, savedTrainer, 168, new BigDecimal("63.50"), new BigDecimal("60.00"), "Emergency Contact");
        Member savedMember = memberRepository.save(member);
        assertNotNull(savedMember.getId());
        assertEquals(savedTrainer.getId(), savedMember.getAssignedTrainer().getId());
    }

    @Test
    @DisplayName("Verify Membership and Payment entities")
    void testMembershipAndPaymentPersistence() {
        User memberUser = userRepository.save(new User("Payment Tester", "pay.test@fitsync.com", "pw", Role.MEMBER, "+1 555-0004", null));
        Member member = memberRepository.save(new Member(memberUser, null, 175, new BigDecimal("70.00"), new BigDecimal("68.00"), "Contact"));

        MembershipPlan plan = membershipPlanRepository.save(
            new MembershipPlan("Pro Monthly", "Access to all amenities", 30, new BigDecimal("89.00"), "USD", true, "All access")
        );
        assertNotNull(plan.getId());

        Membership membership = membershipRepository.save(
            new Membership(member, plan, LocalDate.now(), LocalDate.now().plusDays(30), "ACTIVE")
        );
        assertNotNull(membership.getId());
        assertEquals("ACTIVE", membership.getStatus());

        Payment payment = paymentRepository.save(
            new Payment(member, membership, new BigDecimal("89.00"), "USD", "CARD", "COMPLETED", "TXN-" + UUID.randomUUID())
        );
        assertNotNull(payment.getId());
        assertEquals(new BigDecimal("89.00"), payment.getAmount());

        BigDecimal totalRevenue = paymentRepository.calculateTotalVerifiedRevenue();
        assertTrue(totalRevenue.compareTo(BigDecimal.ZERO) > 0);
    }
}
