package com.fashon.domain.entity;

import com.fashon.domain.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Where;

@Entity
@Table(name = "product_reviews", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "product_id"}, name = "uk_user_product_review")
})
@Getter
@Setter
@NoArgsConstructor
@Where(clause = "deleted_at IS NULL")
public class Review extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    @Min(1)
    @Max(5)
    private Integer rating;

    @Column(nullable = false, columnDefinition = "NVARCHAR(2000)")
    private String content;

    public Review(Product product, User user, Integer rating, String content) {
        this.product = product;
        this.user = user;
        this.rating = rating;
        this.content = content;
    }
}
