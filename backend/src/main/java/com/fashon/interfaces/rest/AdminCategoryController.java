package com.fashon.interfaces.rest;

import com.fashon.application.dto.CategoryDTO;
import com.fashon.application.dto.CreateCategoryRequest;
import com.fashon.application.dto.UpdateCategoryRequest;
import com.fashon.application.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/categories")
@RequiredArgsConstructor
@Tag(name = "Admin - Categories", description = "Category management APIs for administrators")
@PreAuthorize("hasRole('ADMIN')")
public class AdminCategoryController {

    private final CategoryService categoryService;

    @PostMapping
    @Operation(summary = "Create category", description = "Create a new product category")
    public ResponseEntity<Map<String, Object>> createCategory(@Valid @RequestBody CreateCategoryRequest request) {
        CategoryDTO category = categoryService.createCategory(request);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", category,
                "message", "Category created successfully"
        ));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update category", description = "Update an existing category")
    public ResponseEntity<Map<String, Object>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCategoryRequest request) {
        CategoryDTO category = categoryService.updateCategory(id, request);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", category,
                "message", "Category updated successfully"
        ));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete category", description = "Soft delete a category and all its children")
    public ResponseEntity<Map<String, Object>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Category deleted successfully"
        ));
    }

    @GetMapping
    @Operation(summary = "Get all categories", description = "Get all categories as flat list")
    public ResponseEntity<Map<String, Object>> getAllCategories() {
        List<CategoryDTO> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", categories
        ));
    }

    @GetMapping("/tree")
    @Operation(summary = "Get category tree", description = "Get categories as hierarchical tree structure")
    public ResponseEntity<Map<String, Object>> getCategoryTree() {
        List<CategoryDTO> categories = categoryService.getCategoryTree();
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", categories
        ));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get category by ID", description = "Get a specific category by its ID")
    public ResponseEntity<Map<String, Object>> getCategoryById(@PathVariable Long id) {
        CategoryDTO category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", category
        ));
    }
}
