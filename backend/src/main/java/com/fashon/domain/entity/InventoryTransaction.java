package com.fashon.domain.entity;

import com.fashon.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Where;

@Entity
@Table(name = "inventory_transactions")
@Getter
@Setter
@NoArgsConstructor
@Where(clause = "deleted_at IS NULL")
public class InventoryTransaction extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id", nullable = false)
    private ProductVariant variant;

    @Column(name = "qty_change", nullable = false)
    private Integer quantityChange;

    @Column(name = "reason", nullable = false, columnDefinition = "NVARCHAR(200)")
    private String reason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @Column(name = "current_stock_after", nullable = false)
    private Integer currentStockAfter;

    public InventoryTransaction(ProductVariant variant, Integer quantityChange, String reason, 
                               Order order, Integer currentStockAfter) {
        this.variant = variant;
        this.quantityChange = quantityChange;
        this.reason = reason;
        this.order = order;
        this.currentStockAfter = currentStockAfter;
    }

    public InventoryTransaction(ProductVariant variant, Integer quantityChange, String reason, 
                               Integer currentStockAfter) {
        this(variant, quantityChange, reason, null, currentStockAfter);
    }
}
