package com.fashon.infrastructure.repository;

import com.fashon.domain.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    // Lấy tất cả wishlist của user kèm product (để tránh N+1)
    @Query("SELECT w FROM Wishlist w LEFT JOIN FETCH w.product p LEFT JOIN FETCH p.images LEFT JOIN FETCH p.category WHERE w.user.id = :userId AND w.deletedAt IS NULL ORDER BY w.createdAt DESC")
    List<Wishlist> findByUserIdWithProduct(@Param("userId") Long userId);

    // Lấy wishlist theo user và product (để check tồn tại)
    Optional<Wishlist> findByUserIdAndProductId(Long userId, Long productId);

    // Xóa wishlist theo user và product
    void deleteByUserIdAndProductId(Long userId, Long productId);

    // Check xem sản phẩm đã có trong wishlist chưa
    boolean existsByUserIdAndProductId(Long userId, Long productId);

    // Đếm số lượng wishlist của user
    long countByUserId(Long userId);
}
