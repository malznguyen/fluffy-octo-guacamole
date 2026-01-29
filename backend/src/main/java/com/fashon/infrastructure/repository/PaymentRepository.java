package com.fashon.infrastructure.repository;

import com.fashon.domain.entity.Payment;
import com.fashon.domain.enums.PaymentMethod;
import com.fashon.domain.enums.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByOrderIdOrderByCreatedAtDesc(Long orderId);

    Optional<Payment> findFirstByOrderOrderCodeOrderByCreatedAtDesc(String orderCode);

    @Query("SELECT p FROM Payment p JOIN FETCH p.order WHERE p.order.orderCode = :orderCode ORDER BY p.createdAt DESC")
    List<Payment> findByOrderCodeWithOrder(@Param("orderCode") String orderCode);

    @Query("SELECT p FROM Payment p JOIN FETCH p.order ORDER BY p.createdAt DESC")
    Page<Payment> findAllWithOrder(Pageable pageable);

    @Query("SELECT p FROM Payment p JOIN FETCH p.order WHERE p.status = :status ORDER BY p.createdAt DESC")
    Page<Payment> findByStatusWithOrder(@Param("status") PaymentStatus status, Pageable pageable);

    @Query("SELECT p FROM Payment p JOIN FETCH p.order WHERE p.method = :method ORDER BY p.createdAt DESC")
    Page<Payment> findByMethodWithOrder(@Param("method") PaymentMethod method, Pageable pageable);

    @Query("SELECT p FROM Payment p JOIN FETCH p.order WHERE p.status = :status AND p.method = :method ORDER BY p.createdAt DESC")
    Page<Payment> findByStatusAndMethodWithOrder(@Param("status") PaymentStatus status, @Param("method") PaymentMethod method, Pageable pageable);

    boolean existsByOrderIdAndStatus(Long orderId, PaymentStatus status);
}
