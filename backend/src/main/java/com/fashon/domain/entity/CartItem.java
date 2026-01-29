package com.fashon.domain.entity;

import com.fashon.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Where;

@Entity
@Table(name = "cart_items")
@Getter
@Setter
@NoArgsConstructor
@Where(clause = "deleted_at IS NULL")
public class CartItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id", nullable = false)
    private ProductVariant variant;

    @Column(name = "qty", nullable = false)
    private Integer quantity;

    public CartItem(Cart cart, ProductVariant variant, Integer quantity) {
        this.cart = cart;
        this.variant = variant;
        this.quantity = quantity;
    }
}
