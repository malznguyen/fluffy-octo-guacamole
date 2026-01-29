package com.fashon.infrastructure.repository;

import com.fashon.domain.entity.InventoryTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, Long> {

    List<InventoryTransaction> findByVariantIdOrderByCreatedAtDesc(Long variantId);

    Page<InventoryTransaction> findByVariantIdOrderByCreatedAtDesc(Long variantId, Pageable pageable);

    List<InventoryTransaction> findByOrderIdOrderByCreatedAtDesc(Long orderId);

    @Query("SELECT it FROM InventoryTransaction it JOIN FETCH it.variant v JOIN FETCH v.product WHERE it.order.id = :orderId ORDER BY it.createdAt DESC")
    List<InventoryTransaction> findByOrderIdWithDetails(@Param("orderId") Long orderId);
}
