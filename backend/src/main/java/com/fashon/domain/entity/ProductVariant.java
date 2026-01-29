package com.fashon.domain.entity;

import com.fashon.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Where;

import java.math.BigDecimal;

@Entity
@Table(name = "product_variants")
@Getter
@Setter
@NoArgsConstructor
@Where(clause = "deleted_at IS NULL")
public class ProductVariant extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "sku", nullable = false, unique = true, columnDefinition = "NVARCHAR(50)")
    private String sku;

    @Column(name = "color", columnDefinition = "NVARCHAR(50)")
    private String color;

    @Column(name = "size", columnDefinition = "NVARCHAR(20)")
    private String size;

    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity = 0;

    @Column(name = "price_adjustment", precision = 19, scale = 4)
    private BigDecimal priceAdjustment = BigDecimal.ZERO;

    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable = true;

    public ProductVariant(Product product, String sku, String color, String size, Integer stockQuantity) {
        this.product = product;
        this.sku = sku;
        this.color = color;
        this.size = size;
        this.stockQuantity = stockQuantity;
    }

    public BigDecimal getFinalPrice() {
        if (product == null || product.getBasePrice() == null) {
            return priceAdjustment != null ? priceAdjustment : BigDecimal.ZERO;
        }
        BigDecimal adjustment = priceAdjustment != null ? priceAdjustment : BigDecimal.ZERO;
        return product.getBasePrice().add(adjustment);
    }

    public boolean isInStock() {
        return stockQuantity != null && stockQuantity > 0 && Boolean.TRUE.equals(isAvailable);
    }
}
