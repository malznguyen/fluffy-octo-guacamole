package com.fashon.infrastructure.repository;

import com.fashon.domain.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findBySlug(String slug);

    List<Category> findByParentIsNullOrderBySortOrderAsc();

    List<Category> findByParentIdOrderBySortOrderAsc(Long parentId);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);

    @Query("SELECT c FROM Category c LEFT JOIN FETCH c.children WHERE c.parent IS NULL ORDER BY c.sortOrder")
    List<Category> findAllRootCategoriesWithChildren();

    @Query("SELECT c FROM Category c WHERE c.id IN (SELECT DISTINCT cat.parent.id FROM Category cat WHERE cat.parent IS NOT NULL)")
    List<Category> findAllParentCategories();

    @Query("SELECT c FROM Category c WHERE c.parent.id = :parentId")
    List<Category> findAllChildrenByParentId(@Param("parentId") Long parentId);

    List<Category> findByIsActiveTrueOrderBySortOrderAsc();
}
