package com.fashon.infrastructure.repository;

import com.fashon.domain.entity.Order;
import com.fashon.domain.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderCode(String orderCode);

    Optional<Order> findByOrderCodeAndUserId(String orderCode, Long userId);

    Page<Order> findByUserId(Long userId, Pageable pageable);

    Page<Order> findAll(Pageable pageable);

    Page<Order> findByStatus(OrderStatus status, Pageable pageable);

    boolean existsByOrderCode(String orderCode);

    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items WHERE o.orderCode = :orderCode")
    Optional<Order> findByOrderCodeWithItems(@Param("orderCode") String orderCode);

    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items WHERE o.orderCode = :orderCode AND o.user.id = :userId")
    Optional<Order> findByOrderCodeAndUserIdWithItems(@Param("orderCode") String orderCode,
            @Param("userId") Long userId);

    @Query("SELECT o FROM Order o WHERE (:status IS NULL OR o.status = :status) AND (:userId IS NULL OR o.user.id = :userId)")
    Page<Order> findOrdersForAdmin(@Param("status") OrderStatus status, @Param("userId") Long userId,
            Pageable pageable);
}
