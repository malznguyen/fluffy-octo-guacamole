package com.fashon.interfaces.rest;

import com.fashon.application.dto.CategoryDTO;
import com.fashon.application.dto.ProductDTO;
import com.fashon.application.service.CategoryService;
import com.fashon.application.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/public")
@RequiredArgsConstructor
@Tag(name = "Public - Products", description = "Public product browsing APIs for customers")
public class PublicProductController {

    private final ProductService productService;
    private final CategoryService categoryService;

    @GetMapping("/products")
    @Operation(summary = "List products", description = "Get paginated list of visible products with optional filters")
    public ResponseEntity<Map<String, Object>> listProducts(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort field (name, price, createdAt, soldCount)") @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Sort direction (asc, desc)") @RequestParam(defaultValue = "desc") String sortDir,
            @Parameter(description = "Filter by category ID") @RequestParam(required = false) Long categoryId,
            @Parameter(description = "Minimum price") @RequestParam(required = false) BigDecimal minPrice,
            @Parameter(description = "Maximum price") @RequestParam(required = false) BigDecimal maxPrice,
            @Parameter(description = "Search by name or description") @RequestParam(required = false) String search) {

        Sort sort = Sort.by(sortDir.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<ProductDTO> productPage;

        if (search != null && !search.isEmpty()) {
            productPage = productService.searchProducts(search, pageable);
        } else if (categoryId != null && minPrice != null && maxPrice != null) {
            productPage = productService.getProductsByCategory(categoryId, pageable);
        } else if (minPrice != null && maxPrice != null) {
            productPage = productService.getProductsByPriceRange(minPrice, maxPrice, pageable);
        } else if (categoryId != null) {
            productPage = productService.getProductsByCategory(categoryId, pageable);
        } else {
            productPage = productService.getAllProducts(pageable);
        }

        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", Map.of(
                        "content", productPage.getContent(),
                        "totalElements", productPage.getTotalElements(),
                        "totalPages", productPage.getTotalPages(),
                        "currentPage", productPage.getNumber(),
                        "size", productPage.getSize()
                )
        ));
    }

    @GetMapping("/products/{slug}")
    @Operation(summary = "Get product detail", description = "Get detailed product information by slug including variants and images")
    public ResponseEntity<Map<String, Object>> getProductDetail(@PathVariable String slug) {
        ProductDTO product = productService.getProductBySlug(slug);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", product
        ));
    }

    @GetMapping("/categories")
    @Operation(summary = "Get active categories", description = "Get all active categories for menu display")
    public ResponseEntity<Map<String, Object>> getActiveCategories() {
        List<CategoryDTO> categories = categoryService.getActiveCategories();
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", categories
        ));
    }

    @GetMapping("/categories/tree")
    @Operation(summary = "Get category tree", description = "Get categories as hierarchical tree structure for menu")
    public ResponseEntity<Map<String, Object>> getCategoryTree() {
        List<CategoryDTO> categories = categoryService.getCategoryTree();
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", categories
        ));
    }

    @GetMapping("/products/top-selling")
    @Operation(summary = "Get top selling products", description = "Get top selling products for homepage display")
    public ResponseEntity<Map<String, Object>> getTopSellingProducts(
            @RequestParam(defaultValue = "10") int limit) {
        List<ProductDTO> products = productService.getTopSellingProducts(limit);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", products
        ));
    }

    @GetMapping("/products/newest")
    @Operation(summary = "Get newest products", description = "Get newest products for homepage display")
    public ResponseEntity<Map<String, Object>> getNewestProducts(
            @RequestParam(defaultValue = "10") int limit) {
        List<ProductDTO> products = productService.getNewestProducts(limit);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", products
        ));
    }
}
