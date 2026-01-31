package com.fashon.infrastructure.repository;

import com.fashon.domain.entity.Order;
import com.fashon.domain.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderCode(String orderCode);

    Optional<Order> findByOrderCodeAndUserId(String orderCode, Long userId);

    @Query(value = "SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.items LEFT JOIN FETCH o.user WHERE o.user.id = :userId AND o.deletedAt IS NULL",
           countQuery = "SELECT COUNT(o) FROM Order o WHERE o.user.id = :userId AND o.deletedAt IS NULL")
    Page<Order> findByUserIdWithItems(@Param("userId") Long userId, Pageable pageable);

    // Deprecated: use findAllWithItems to avoid N+1 query
    Page<Order> findByUserId(Long userId, Pageable pageable);

    @Query(value = "SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.items LEFT JOIN FETCH o.user WHERE o.deletedAt IS NULL",
           countQuery = "SELECT COUNT(o) FROM Order o WHERE o.deletedAt IS NULL")
    Page<Order> findAllWithItems(Pageable pageable);

    // Deprecated: use findAllWithItems to avoid N+1 query
    Page<Order> findAll(Pageable pageable);

    @Query(value = "SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.items LEFT JOIN FETCH o.user WHERE o.status = :status AND o.deletedAt IS NULL",
           countQuery = "SELECT COUNT(o) FROM Order o WHERE o.status = :status AND o.deletedAt IS NULL")
    Page<Order> findByStatusWithItems(@Param("status") OrderStatus status, Pageable pageable);

    // Deprecated: use findByStatusWithItems to avoid N+1 query
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);

    boolean existsByOrderCode(String orderCode);

    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items LEFT JOIN FETCH o.user WHERE o.orderCode = :orderCode")
    Optional<Order> findByOrderCodeWithItems(@Param("orderCode") String orderCode);

    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items WHERE o.orderCode = :orderCode AND o.user.id = :userId")
    Optional<Order> findByOrderCodeAndUserIdWithItems(@Param("orderCode") String orderCode,
            @Param("userId") Long userId);

    // Query lấy IDs trước (để tránh lỗi Hibernate với DISTINCT + FETCH JOIN + Pagination)
    @Query("SELECT o.id FROM Order o WHERE (:status IS NULL OR o.status = :status) AND (:userId IS NULL OR o.user.id = :userId) AND o.deletedAt IS NULL")
    Page<Long> findOrderIdsForAdmin(@Param("status") OrderStatus status, @Param("userId") Long userId,
            Pageable pageable);

    // Query fetch full data sau
    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.items LEFT JOIN FETCH o.user WHERE o.id IN :orderIds AND o.deletedAt IS NULL")
    List<Order> findOrdersWithItemsByIds(@Param("orderIds") List<Long> orderIds);

    // Deprecated: use findOrdersForAdminWithItems to avoid N+1 query
    @Query("SELECT o FROM Order o WHERE (:status IS NULL OR o.status = :status) AND (:userId IS NULL OR o.user.id = :userId)")
    Page<Order> findOrdersForAdmin(@Param("status") OrderStatus status, @Param("userId") Long userId,
            Pageable pageable);

    // Lấy tất cả orders của user (không pagination) để check purchase history
    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.items WHERE o.user.id = :userId AND o.deletedAt IS NULL")
    List<Order> findAllByUserId(@Param("userId") Long userId);
}
