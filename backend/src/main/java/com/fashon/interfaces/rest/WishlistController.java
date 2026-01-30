package com.fashon.interfaces.rest;

import com.fashon.application.dto.ProductDTO;
import com.fashon.application.dto.WishlistDTO;
import com.fashon.application.service.WishlistService;
import com.fashon.domain.entity.User;
import com.fashon.infrastructure.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/wishlist")
@RequiredArgsConstructor
@Tag(name = "Wishlist", description = "Wishlist management APIs")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("isAuthenticated()")
public class WishlistController {

    private final WishlistService wishlistService;
    private final UserRepository userRepository;

    // Lấy danh sách wishlist của user
    @GetMapping
    @Operation(summary = "Get user wishlist", description = "Get all products in user's wishlist")
    public ResponseEntity<Map<String, Object>> getWishlist(@AuthenticationPrincipal String email) {
        Long userId = getUserIdFromEmail(email);
        List<ProductDTO> products = wishlistService.getUserWishlist(userId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", products);
        response.put("count", products.size());
        
        return ResponseEntity.ok(response);
    }

    // Thêm sản phẩm vào wishlist
    @PostMapping
    @Operation(summary = "Add to wishlist", description = "Add a product to user's wishlist")
    public ResponseEntity<Map<String, Object>> addToWishlist(
            @AuthenticationPrincipal String email,
            @RequestBody Map<String, Long> request) {
        
        Long userId = getUserIdFromEmail(email);
        Long productId = request.get("productId");
        
        if (productId == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "productId is required");
            return ResponseEntity.badRequest().body(error);
        }
        
        WishlistDTO wishlist = wishlistService.addToWishlist(userId, productId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", wishlist);
        response.put("message", "Added to wishlist successfully");
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Xóa sản phẩm khỏi wishlist
    @DeleteMapping("/{productId}")
    @Operation(summary = "Remove from wishlist", description = "Remove a product from user's wishlist")
    public ResponseEntity<Map<String, Object>> removeFromWishlist(
            @AuthenticationPrincipal String email,
            @PathVariable Long productId) {
        
        Long userId = getUserIdFromEmail(email);
        wishlistService.removeFromWishlist(userId, productId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Removed from wishlist successfully");
        
        return ResponseEntity.ok(response);
    }

    // Check xem sản phẩm đã có trong wishlist chưa
    @GetMapping("/check/{productId}")
    @Operation(summary = "Check wishlist status", description = "Check if a product is in user's wishlist")
    public ResponseEntity<Map<String, Object>> checkWishlistStatus(
            @AuthenticationPrincipal String email,
            @PathVariable Long productId) {
        
        Long userId = getUserIdFromEmail(email);
        boolean isInWishlist = wishlistService.isInWishlist(userId, productId);
        long count = wishlistService.getWishlistCount(userId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("isInWishlist", isInWishlist);
        response.put("wishlistCount", count);
        
        return ResponseEntity.ok(response);
    }

    // Lấy số lượng wishlist
    @GetMapping("/count")
    @Operation(summary = "Get wishlist count", description = "Get total number of items in wishlist")
    public ResponseEntity<Map<String, Object>> getWishlistCount(
            @AuthenticationPrincipal String email) {
        
        Long userId = getUserIdFromEmail(email);
        long count = wishlistService.getWishlistCount(userId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", count);
        
        return ResponseEntity.ok(response);
    }

    // Helper method để lấy userId từ email (principal là email string)
    private Long getUserIdFromEmail(String email) {
        if (email == null || email.isEmpty()) {
            throw new RuntimeException("Unauthorized - Please login");
        }
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }
}
