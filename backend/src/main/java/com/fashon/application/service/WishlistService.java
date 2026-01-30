package com.fashon.application.service;

import com.fashon.application.dto.ProductDTO;
import com.fashon.application.dto.WishlistDTO;
import com.fashon.domain.entity.Product;
import com.fashon.domain.entity.User;
import com.fashon.domain.entity.Wishlist;
import com.fashon.infrastructure.repository.ProductRepository;
import com.fashon.infrastructure.repository.UserRepository;
import com.fashon.infrastructure.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ProductService productService;

    // Lấy danh sách sản phẩm yêu thích của user
    public List<ProductDTO> getUserWishlist(Long userId) {
        List<Wishlist> wishlists = wishlistRepository.findByUserIdWithProduct(userId);
        
        return wishlists.stream()
                .map(w -> productService.mapToDTO(w.getProduct()))
                .collect(Collectors.toList());
    }

    // Thêm sản phẩm vào wishlist
    @Transactional
    public WishlistDTO addToWishlist(Long userId, Long productId) {
        // Check user tồn tại
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check product tồn tại và còn visible
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getIsVisible()) {
            throw new RuntimeException("Product is not available");
        }

        // Check đã có trong wishlist chưa
        if (wishlistRepository.existsByUserIdAndProductId(userId, productId)) {
            // Nếu đã có, trả về existing
            Wishlist existing = wishlistRepository.findByUserIdAndProductId(userId, productId)
                    .orElseThrow(() -> new RuntimeException("Wishlist not found"));
            return mapToDTO(existing);
        }

        // Tạo mới wishlist
        Wishlist wishlist = new Wishlist(user, product);
        Wishlist saved = wishlistRepository.save(wishlist);

        return mapToDTO(saved);
    }

    // Xóa sản phẩm khỏi wishlist
    @Transactional
    public void removeFromWishlist(Long userId, Long productId) {
        if (!wishlistRepository.existsByUserIdAndProductId(userId, productId)) {
            throw new RuntimeException("Product not found in wishlist");
        }
        
        wishlistRepository.deleteByUserIdAndProductId(userId, productId);
    }

    // Check xem sản phẩm đã có trong wishlist chưa
    public boolean isInWishlist(Long userId, Long productId) {
        return wishlistRepository.existsByUserIdAndProductId(userId, productId);
    }

    // Lấy số lượng wishlist của user
    public long getWishlistCount(Long userId) {
        return wishlistRepository.countByUserId(userId);
    }

    // Map Wishlist to DTO
    private WishlistDTO mapToDTO(Wishlist wishlist) {
        return WishlistDTO.builder()
                .id(wishlist.getId())
                .product(productService.mapToDTO(wishlist.getProduct()))
                .addedAt(wishlist.getCreatedAt())
                .build();
    }
}
