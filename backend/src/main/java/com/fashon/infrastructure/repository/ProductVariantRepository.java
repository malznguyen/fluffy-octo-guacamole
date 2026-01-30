package com.fashon.infrastructure.repository;

import com.fashon.domain.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {

    Optional<ProductVariant> findBySku(String sku);

    boolean existsBySku(String sku);

    boolean existsBySkuAndIdNot(String sku, Long id);

    List<ProductVariant> findByProductId(Long productId);

    List<ProductVariant> findByProductIdAndIsAvailableTrue(Long productId);

    List<ProductVariant> findByProductIdAndStockQuantityGreaterThan(Long productId, Integer minStock);

    @Query("SELECT pv FROM ProductVariant pv WHERE pv.product.id = :productId AND pv.isAvailable = true AND pv.stockQuantity > 0")
    List<ProductVariant> findAvailableVariantsByProductId(@Param("productId") Long productId);

    @Query("SELECT pv FROM ProductVariant pv WHERE pv.product.id = :productId AND pv.color = :color")
    List<ProductVariant> findByProductIdAndColor(@Param("productId") Long productId, @Param("color") String color);

    @Query("SELECT DISTINCT pv.color FROM ProductVariant pv WHERE pv.product.id = :productId AND pv.color IS NOT NULL")
    List<String> findDistinctColorsByProductId(@Param("productId") Long productId);

    @Query("SELECT DISTINCT pv.size FROM ProductVariant pv WHERE pv.product.id = :productId AND pv.size IS NOT NULL")
    List<String> findDistinctSizesByProductId(@Param("productId") Long productId);

    @Query("SELECT SUM(pv.stockQuantity) FROM ProductVariant pv WHERE pv.product.id = :productId AND pv.isAvailable = true")
    Long sumStockQuantityByProductId(@Param("productId") Long productId);

    Optional<ProductVariant> findBySkuAndProductId(String sku, Long productId);
}
