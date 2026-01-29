package com.fashon.interfaces.rest;

import com.fashon.application.dto.*;
import com.fashon.application.service.FileStorageService;
import com.fashon.application.service.ProductService;
import com.fashon.domain.entity.Product;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/products")
@RequiredArgsConstructor
@Tag(name = "Admin - Products", description = "Product management APIs for administrators")
@PreAuthorize("hasRole('ADMIN')")
public class AdminProductController {

    private final ProductService productService;
    private final FileStorageService fileStorageService;

    @PostMapping
    @Operation(summary = "Create product", description = "Create a new product with variants and images")
    public ResponseEntity<Map<String, Object>> createProduct(@Valid @RequestBody CreateProductRequest request) {
        ProductDTO product = productService.createProduct(request);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", product,
                "message", "Product created successfully"
        ));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update product", description = "Update an existing product")
    public ResponseEntity<Map<String, Object>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProductRequest request) {
        ProductDTO product = productService.updateProduct(id, request);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", product,
                "message", "Product updated successfully"
        ));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete product", description = "Soft delete a product and its variants/images")
    public ResponseEntity<Map<String, Object>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Product deleted successfully"
        ));
    }

    @GetMapping
    @Operation(summary = "Get all products", description = "Get all products (including hidden ones)")
    public ResponseEntity<Map<String, Object>> getAllProducts() {
        List<ProductDTO> products = productService.getAllProducts(org.springframework.data.domain.Pageable.unpaged()).getContent();
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", products
        ));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID", description = "Get a specific product by its ID")
    public ResponseEntity<Map<String, Object>> getProductById(@PathVariable Long id) {
        ProductDTO product = productService.getProductById(id);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", product
        ));
    }

    @PostMapping("/{productId}/variants")
    @Operation(summary = "Add variant", description = "Add a new variant to an existing product")
    public ResponseEntity<Map<String, Object>> addVariant(
            @PathVariable Long productId,
            @Valid @RequestBody CreateVariantRequest request) {
        Product product = new Product();
        product.setId(productId);
        productService.createVariant(product, request);
        ProductDTO updatedProduct = productService.getProductById(productId);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", updatedProduct,
                "message", "Variant added successfully"
        ));
    }

    @PostMapping("/{productId}/images")
    @Operation(summary = "Add image", description = "Add a new image to an existing product")
    public ResponseEntity<Map<String, Object>> addImage(
            @PathVariable Long productId,
            @Valid @RequestBody CreateImageRequest request) {
        Product product = new Product();
        product.setId(productId);
        productService.createImage(product, request);
        ProductDTO updatedProduct = productService.getProductById(productId);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", updatedProduct,
                "message", "Image added successfully"
        ));
    }

    @PostMapping("/upload-image")
    @Operation(summary = "Upload image", description = "Upload an image file and return the file path")
    public ResponseEntity<Map<String, Object>> uploadImage(@RequestParam("file") MultipartFile file) {
        String filename = fileStorageService.storeFile(file);
        String fileUrl = fileStorageService.getFileUrl(filename);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", Map.of(
                        "filename", filename,
                        "url", fileUrl
                ),
                "message", "Image uploaded successfully"
        ));
    }
}
