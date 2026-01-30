package com.fashon.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductReviewStats {
    private List<ReviewDTO> reviews;
    private Double averageRating;
    private Long totalReviews;
    private boolean hasUserReviewed;
    private ReviewDTO userReview;
}
