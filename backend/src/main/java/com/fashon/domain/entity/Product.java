package com.fashon.domain.entity;

import com.fashon.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Where;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@Where(clause = "deleted_at IS NULL")
public class Product extends BaseEntity {

    @Column(name = "name", nullable = false, columnDefinition = "NVARCHAR(500)")
    private String name;

    @Column(name = "slug", nullable = false, unique = true, columnDefinition = "NVARCHAR(500)")
    private String slug;

    @Column(name = "description", columnDefinition = "NVARCHAR(MAX)")
    private String description;

    @Column(name = "base_price", nullable = false, precision = 19, scale = 4)
    private BigDecimal basePrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(name = "is_visible", nullable = false)
    private Boolean isVisible = true;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("sortOrder ASC")
    private List<ProductImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ProductVariant> variants = new ArrayList<>();

    @Column(name = "sold_count")
    private Long soldCount = 0L;

    public Product(String name, String slug, String description, BigDecimal basePrice, Category category) {
        this.name = name;
        this.slug = slug;
        this.description = description;
        this.basePrice = basePrice;
        this.category = category;
    }

    public void addImage(ProductImage image) {
        images.add(image);
        image.setProduct(this);
    }

    public void removeImage(ProductImage image) {
        images.remove(image);
        image.setProduct(null);
    }

    public void addVariant(ProductVariant variant) {
        variants.add(variant);
        variant.setProduct(this);
    }

    public void removeVariant(ProductVariant variant) {
        variants.remove(variant);
        variant.setProduct(null);
    }

    public BigDecimal getFinalPrice(ProductVariant variant) {
        if (variant == null || variant.getPriceAdjustment() == null) {
            return basePrice;
        }
        return basePrice.add(variant.getPriceAdjustment());
    }
}
