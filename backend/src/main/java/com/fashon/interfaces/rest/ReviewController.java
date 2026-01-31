package com.fashon.interfaces.rest;

import com.fashon.application.dto.ProductReviewStats;
import com.fashon.application.dto.ReviewDTO;
import com.fashon.application.dto.ReviewRequest;
import com.fashon.application.service.ReviewService;
import com.fashon.domain.entity.User;
import com.fashon.infrastructure.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Reviews", description = "Product review management APIs")
public class ReviewController {

    private final ReviewService reviewService;
    private final UserRepository userRepository;

    // Public endpoint - Lấy reviews của sản phẩm (KHÔNG yêu cầu authentication)
    @GetMapping("/public/products/{productId}/reviews")
    @Operation(summary = "Get product reviews", description = "Get all reviews for a product (public - no authentication required)")
    public ResponseEntity<Map<String, Object>> getProductReviews(
            @PathVariable Long productId) {
        
        // Lấy currentUserId nếu user đã đăng nhập, null nếu chưa đăng nhập
        Long currentUserId = getCurrentUserIdSafely();
        
        ProductReviewStats stats = reviewService.getProductReviews(productId, currentUserId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", stats);
        
        return ResponseEntity.ok(response);
    }

    // Authenticated endpoint - Tạo review
    @PostMapping("/reviews")
    @Operation(summary = "Create review", description = "Create a new product review")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> createReview(
            @org.springframework.security.core.annotation.AuthenticationPrincipal String email,
            @Valid @RequestBody ReviewRequest request) {
        
        Long userId = getUserIdFromEmail(email);
        ReviewDTO review = reviewService.createReview(userId, request);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", review);
        response.put("message", "Đánh giá đã được gửi thành công");
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Authenticated endpoint - Xóa review
    @DeleteMapping("/reviews/{reviewId}")
    @Operation(summary = "Delete review", description = "Delete own review")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> deleteReview(
            @org.springframework.security.core.annotation.AuthenticationPrincipal String email,
            @PathVariable Long reviewId) {
        
        Long userId = getUserIdFromEmail(email);
        reviewService.deleteReview(reviewId, userId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Đánh giá đã được xóa");
        
        return ResponseEntity.ok(response);
    }

    // Helper method để lấy userId an toàn (null nếu chưa đăng nhập)
    private Long getCurrentUserIdSafely() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        // Check nếu không có authentication hoặc là anonymous
        if (authentication == null || 
            !authentication.isAuthenticated() || 
            "anonymousUser".equals(authentication.getPrincipal())) {
            return null;
        }
        
        // Lấy email từ principal
        String email = null;
        if (authentication.getPrincipal() instanceof String) {
            email = (String) authentication.getPrincipal();
        } else if (authentication.getPrincipal() instanceof org.springframework.security.core.userdetails.User) {
            email = ((org.springframework.security.core.userdetails.User) authentication.getPrincipal()).getUsername();
        }
        
        if (email == null || email.isEmpty()) {
            return null;
        }
        
        // Tìm user và trả về id
        try {
            return userRepository.findByEmail(email)
                    .map(User::getId)
                    .orElse(null);
        } catch (Exception e) {
            // Nếu có lỗi khi tìm user, trả về null (coi như chưa đăng nhập)
            return null;
        }
    }

    // Helper method để lấy userId từ email (chỉ dùng cho authenticated endpoints)
    private Long getUserIdFromEmail(String email) {
        if (email == null || email.isEmpty()) {
            throw new RuntimeException("Unauthorized - Please login");
        }
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }
}
