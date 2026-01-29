package com.fashon.domain.entity;

import com.fashon.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Where;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@Where(clause = "deleted_at IS NULL")
public class OrderItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(name = "product_name_snapshot", nullable = false, columnDefinition = "NVARCHAR(200)")
    private String productNameSnapshot;

    @Column(name = "variant_info_snapshot", nullable = false, columnDefinition = "NVARCHAR(100)")
    private String variantInfoSnapshot;

    @Column(name = "qty", nullable = false)
    private Integer quantity;

    @Column(name = "unit_price", nullable = false, precision = 19, scale = 4)
    private BigDecimal unitPrice;

    public OrderItem(Order order, String productNameSnapshot, String variantInfoSnapshot, 
                     Integer quantity, BigDecimal unitPrice) {
        this.order = order;
        this.productNameSnapshot = productNameSnapshot;
        this.variantInfoSnapshot = variantInfoSnapshot;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }

    public BigDecimal getSubtotal() {
        return unitPrice.multiply(BigDecimal.valueOf(quantity));
    }
}
