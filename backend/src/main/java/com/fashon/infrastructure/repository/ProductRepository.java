package com.fashon.infrastructure.repository;

import com.fashon.domain.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findBySlug(String slug);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);

    Page<Product> findByIsVisibleTrue(Pageable pageable);

    Page<Product> findByCategoryIdAndIsVisibleTrue(Long categoryId, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.isVisible = true AND p.category.id IN :categoryIds")
    Page<Product> findByCategoryIdsAndIsVisibleTrue(@Param("categoryIds") List<Long> categoryIds, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.isVisible = true AND p.basePrice BETWEEN :minPrice AND :maxPrice")
    Page<Product> findByPriceRangeAndIsVisibleTrue(
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.isVisible = true AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Product> searchByNameOrDescription(@Param("searchTerm") String searchTerm, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.isVisible = true AND p.category.id = :categoryId AND " +
           "p.basePrice BETWEEN :minPrice AND :maxPrice")
    Page<Product> findByCategoryAndPriceRange(
            @Param("categoryId") Long categoryId,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable);

    @Query("SELECT p FROM Product p " +
           "LEFT JOIN FETCH p.images " +
           "LEFT JOIN FETCH p.variants " +
           "LEFT JOIN FETCH p.category " +
           "WHERE p.slug = :slug AND p.isVisible = true")
    Optional<Product> findBySlugWithDetails(@Param("slug") String slug);

    @Query("SELECT p FROM Product p " +
           "LEFT JOIN FETCH p.images " +
           "LEFT JOIN FETCH p.variants " +
           "LEFT JOIN FETCH p.category " +
           "WHERE p.id = :id")
    Optional<Product> findByIdWithDetails(@Param("id") Long id);

    Page<Product> findByCategoryParentIdAndIsVisibleTrue(Long parentCategoryId, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.isVisible = true ORDER BY p.soldCount DESC")
    List<Product> findTopSellingProducts(Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.isVisible = true ORDER BY p.createdAt DESC")
    List<Product> findNewestProducts(Pageable pageable);
}
