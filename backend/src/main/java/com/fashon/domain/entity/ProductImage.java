package com.fashon.domain.entity;

import com.fashon.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Where;

@Entity
@Table(name = "product_images")
@Getter
@Setter
@NoArgsConstructor
@Where(clause = "deleted_at IS NULL")
public class ProductImage extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "image_url", nullable = false, columnDefinition = "NVARCHAR(1000)")
    private String imageUrl;

    @Column(name = "alt_text", columnDefinition = "NVARCHAR(255)")
    private String altText;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder = 0;

    @Column(name = "is_primary", nullable = false)
    private Boolean isPrimary = false;

    public ProductImage(Product product, String imageUrl, String altText, Integer sortOrder) {
        this.product = product;
        this.imageUrl = imageUrl;
        this.altText = altText;
        this.sortOrder = sortOrder;
    }

    public ProductImage(Product product, String imageUrl, String altText, Integer sortOrder, Boolean isPrimary) {
        this(product, imageUrl, altText, sortOrder);
        this.isPrimary = isPrimary != null ? isPrimary : false;
    }
}
