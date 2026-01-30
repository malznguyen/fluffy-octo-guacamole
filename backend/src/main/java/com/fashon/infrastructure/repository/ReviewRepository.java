package com.fashon.infrastructure.repository;

import com.fashon.domain.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Lấy danh sách review của sản phẩm, mới nhất trước
    @Query("SELECT r FROM Review r LEFT JOIN FETCH r.user WHERE r.product.id = :productId AND r.deletedAt IS NULL ORDER BY r.createdAt DESC")
    List<Review> findByProductIdOrderByCreatedAtDesc(@Param("productId") Long productId);

    // Check xem user đã review sản phẩm này chưa
    Optional<Review> findByUserIdAndProductId(Long userId, Long productId);

    // Tính trung bình rating của sản phẩm
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :productId AND r.deletedAt IS NULL")
    Double calculateAverageRating(@Param("productId") Long productId);

    // Đếm số lượng review của sản phẩm
    @Query("SELECT COUNT(r) FROM Review r WHERE r.product.id = :productId AND r.deletedAt IS NULL")
    Long countByProductId(@Param("productId") Long productId);

    // Check xem user đã review chưa
    boolean existsByUserIdAndProductId(Long userId, Long productId);

    // Lấy review của user cho sản phẩm cụ thể
    @Query("SELECT r FROM Review r LEFT JOIN FETCH r.user WHERE r.user.id = :userId AND r.product.id = :productId AND r.deletedAt IS NULL")
    Optional<Review> findByUserIdAndProductIdWithUser(@Param("userId") Long userId, @Param("productId") Long productId);
}
