package com.fashon.application.service;

import com.fashon.application.dto.ProductReviewStats;
import com.fashon.application.dto.ReviewDTO;
import com.fashon.application.dto.ReviewRequest;
import com.fashon.domain.entity.*;
import com.fashon.domain.enums.OrderStatus;
import com.fashon.infrastructure.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    /**
     * Lấy danh sách review và stats của sản phẩm
     * 
     * @param productId ID của sản phẩm
     * @param currentUserId ID của user hiện tại (null nếu chưa đăng nhập)
     * @return ProductReviewStats chứa danh sách review, rating trung bình, v.v.
     */
    public ProductReviewStats getProductReviews(Long productId, Long currentUserId) {
        // Check product tồn tại
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getIsVisible()) {
            throw new RuntimeException("Product is not available");
        }

        List<Review> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
        Double averageRating = reviewRepository.calculateAverageRating(productId);
        Long totalReviews = reviewRepository.countByProductId(productId);

        // Check xem user hiện tại đã review chưa (chỉ khi đã đăng nhập)
        boolean hasUserReviewed = false;
        ReviewDTO userReview = null;
        boolean canReview = false;
        
        if (currentUserId != null) {
            // User đã đăng nhập -> check xem đã review chưa
            hasUserReviewed = reviewRepository.existsByUserIdAndProductId(currentUserId, productId);
            if (hasUserReviewed) {
                Review review = reviewRepository.findByUserIdAndProductId(currentUserId, productId).orElse(null);
                if (review != null) {
                    userReview = mapToDTO(review, currentUserId);
                }
            }
            // Check xem user có thể review không (đã mua hàng chưa)
            canReview = checkUserHasPurchasedProduct(currentUserId, productId);
        }

        return ProductReviewStats.builder()
                .reviews(reviews.stream().map(r -> mapToDTO(r, currentUserId)).collect(Collectors.toList()))
                .averageRating(averageRating != null ? averageRating : 0.0)
                .totalReviews(totalReviews != null ? totalReviews : 0L)
                .hasUserReviewed(hasUserReviewed)
                .userReview(userReview)
                .canReview(canReview)
                .build();
    }

    /**
     * Lấy reviews cho public API (không cần authentication)
     * Tương đương với getProductReviews(productId, null)
     */
    public ProductReviewStats getPublicProductReviews(Long productId) {
        return getProductReviews(productId, null);
    }

    // Tạo review mới
    @Transactional
    public ReviewDTO createReview(Long userId, ReviewRequest request) {
        // Check user tồn tại
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check product tồn tại và visible
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getIsVisible()) {
            throw new RuntimeException("Product is not available");
        }

        // Check user đã mua sản phẩm này chưa (order status COMPLETED hoặc DELIVERED)
        boolean hasPurchased = checkUserHasPurchasedProduct(userId, request.getProductId());
        if (!hasPurchased) {
            throw new IllegalStateException("Bạn cần mua sản phẩm này trước khi đánh giá");
        }

        // Check đã review chưa - nếu có thì cập nhật
        Review review;
        if (reviewRepository.existsByUserIdAndProductId(userId, request.getProductId())) {
            review = reviewRepository.findByUserIdAndProductId(userId, request.getProductId())
                    .orElseThrow(() -> new RuntimeException("Review not found"));
            review.setRating(request.getRating());
            review.setContent(request.getContent());
        } else {
            review = new Review(product, user, request.getRating(), request.getContent());
        }

        Review savedReview = reviewRepository.save(review);
        return mapToDTO(savedReview, userId);
    }

    // Xóa review (soft delete)
    @Transactional
    public void deleteReview(Long reviewId, Long userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        // Chỉ cho phép owner hoặc ADMIN xóa
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!review.getUser().getId().equals(userId) && user.getRole().name().equals("CUSTOMER")) {
            throw new RuntimeException("Bạn không có quyền xóa đánh giá này");
        }

        review.softDelete();
        reviewRepository.save(review);
    }

    // Check xem user đã mua sản phẩm chưa
    private boolean checkUserHasPurchasedProduct(Long userId, Long productId) {
        if (userId == null) {
            return false;
        }
        
        // Lấy tất cả orders của user có status COMPLETED hoặc DELIVERED
        List<Order> orders = orderRepository.findAllByUserId(userId).stream()
                .filter(o -> o.getStatus() == OrderStatus.COMPLETED || o.getStatus() == OrderStatus.DELIVERED)
                .toList();

        // Check trong các order items xem có product này không
        for (Order order : orders) {
            for (OrderItem item : order.getItems()) {
                // So sánh product name snapshot với product name hiện tại
                // Hoặc có thể lưu product_id trong order_items (nhưng hiện tại schema không có)
                // Tạm thởi cho phép review nếu user đã có order COMPLETED/DELIVERED
                // TODO: Cải thiện bằng cách thêm product_id vào order_items
                return true;
            }
        }

        return false;
    }

    // Map Review to DTO
    private ReviewDTO mapToDTO(Review review, Long currentUserId) {
        boolean isOwner = currentUserId != null && review.getUser().getId().equals(currentUserId);
        
        return ReviewDTO.builder()
                .id(review.getId())
                .rating(review.getRating())
                .content(review.getContent())
                .userName(review.getUser().getFullName())
                .userAvatar(null) // Chưa có avatar field trong User entity
                .createdAt(review.getCreatedAt())
                .isOwner(isOwner)
                .build();
    }
}
