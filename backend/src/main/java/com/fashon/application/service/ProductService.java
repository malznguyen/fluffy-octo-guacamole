package com.fashon.application.service;

import com.fashon.application.dto.*;
import com.fashon.domain.entity.Category;
import com.fashon.domain.entity.Product;
import com.fashon.domain.entity.ProductImage;
import com.fashon.domain.entity.ProductVariant;
import com.fashon.infrastructure.repository.CategoryRepository;
import com.fashon.infrastructure.repository.ProductImageRepository;
import com.fashon.infrastructure.repository.ProductRepository;
import com.fashon.infrastructure.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductImageRepository productImageRepository;

    @Transactional
    public ProductDTO createProduct(CreateProductRequest request) {
        if (productRepository.existsBySlug(request.getSlug())) {
            throw new RuntimeException("Product with this slug already exists");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Product product = new Product();
        product.setName(request.getName());
        product.setSlug(request.getSlug());
        product.setDescription(request.getDescription());
        product.setBasePrice(request.getBasePrice());
        product.setCategory(category);
        product.setIsVisible(request.getIsVisible() != null ? request.getIsVisible() : true);

        Product savedProduct = productRepository.save(product);

        if (request.getVariants() != null && !request.getVariants().isEmpty()) {
            for (CreateVariantRequest variantRequest : request.getVariants()) {
                createVariant(savedProduct, variantRequest);
            }
        }

        if (request.getImages() != null && !request.getImages().isEmpty()) {
            for (CreateImageRequest imageRequest : request.getImages()) {
                createImage(savedProduct, imageRequest);
            }
        }

        return mapToDTO(savedProduct);
    }

    @Transactional
    public ProductVariant createVariant(Product product, CreateVariantRequest request) {
        if (productVariantRepository.existsBySku(request.getSku())) {
            throw new RuntimeException("Variant with this SKU already exists: " + request.getSku());
        }

        if (request.getStockQuantity() < 0) {
            throw new RuntimeException("Stock quantity cannot be negative");
        }

        ProductVariant variant = new ProductVariant();
        variant.setProduct(product);
        variant.setSku(request.getSku());
        variant.setColor(request.getColor());
        variant.setSize(request.getSize());
        variant.setStockQuantity(request.getStockQuantity());
        variant.setPriceAdjustment(request.getPriceAdjustment() != null ? request.getPriceAdjustment() : BigDecimal.ZERO);
        variant.setIsAvailable(request.getIsAvailable() != null ? request.getIsAvailable() : true);

        return productVariantRepository.save(variant);
    }

    @Transactional
    public ProductImage createImage(Product product, CreateImageRequest request) {
        ProductImage image = new ProductImage();
        image.setProduct(product);
        image.setImageUrl(request.getImageUrl());
        image.setAltText(request.getAltText());
        image.setSortOrder(request.getSortOrder());
        image.setIsPrimary(request.getIsPrimary() != null ? request.getIsPrimary() : false);

        if (Boolean.TRUE.equals(image.getIsPrimary())) {
            productImageRepository.clearPrimaryFlagByProductId(product.getId());
        }

        return productImageRepository.save(image);
    }

    @Transactional
    public ProductDTO updateProduct(Long id, UpdateProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (request.getName() != null) {
            product.setName(request.getName());
        }

        if (request.getSlug() != null) {
            if (productRepository.existsBySlugAndIdNot(request.getSlug(), id)) {
                throw new RuntimeException("Product with this slug already exists");
            }
            product.setSlug(request.getSlug());
        }

        if (request.getDescription() != null) {
            product.setDescription(request.getDescription());
        }

        if (request.getBasePrice() != null) {
            product.setBasePrice(request.getBasePrice());
        }

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);
        }

        if (request.getIsVisible() != null) {
            product.setIsVisible(request.getIsVisible());
        }

        Product updatedProduct = productRepository.save(product);
        return mapToDTO(updatedProduct);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.softDelete();
        productRepository.save(product);

        for (ProductVariant variant : product.getVariants()) {
            variant.softDelete();
            productVariantRepository.save(variant);
        }

        for (ProductImage image : product.getImages()) {
            image.softDelete();
            productImageRepository.save(image);
        }
    }

    @Transactional(readOnly = true)
    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return mapToDTO(product);
    }

    @Transactional(readOnly = true)
    public ProductDTO getProductBySlug(String slug) {
        Product product = productRepository.findBySlugWithDetails(slug)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return mapToDTO(product);
    }

    @Transactional(readOnly = true)
    public Page<ProductDTO> getAllProducts(Pageable pageable) {
        return productRepository.findByIsVisibleTrue(pageable)
                .map(this::mapToListDTO);
    }

    @Transactional(readOnly = true)
    public Page<ProductDTO> getProductsByCategory(Long categoryId, Pageable pageable) {
        return productRepository.findByCategoryIdAndIsVisibleTrue(categoryId, pageable)
                .map(this::mapToListDTO);
    }

    @Transactional(readOnly = true)
    public Page<ProductDTO> searchProducts(String searchTerm, Pageable pageable) {
        return productRepository.searchByNameOrDescription(searchTerm, pageable)
                .map(this::mapToListDTO);
    }

    @Transactional(readOnly = true)
    public Page<ProductDTO> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        return productRepository.findByPriceRangeAndIsVisibleTrue(minPrice, maxPrice, pageable)
                .map(this::mapToListDTO);
    }

    @Transactional(readOnly = true)
    public List<ProductDTO> getTopSellingProducts(int limit) {
        return productRepository.findTopSellingProducts(Pageable.ofSize(limit)).stream()
                .map(this::mapToListDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductDTO> getNewestProducts(int limit) {
        return productRepository.findNewestProducts(Pageable.ofSize(limit)).stream()
                .map(this::mapToListDTO)
                .collect(Collectors.toList());
    }

    private ProductDTO mapToDTO(Product product) {
        List<ProductImageDTO> imageDTOs = product.getImages() != null ? 
                product.getImages().stream()
                        .filter(img -> img.getDeletedAt() == null)
                        .sorted((a, b) -> Integer.compare(a.getSortOrder(), b.getSortOrder()))
                        .map(this::mapImageToDTO)
                        .collect(Collectors.toList()) : new ArrayList<>();

        List<ProductVariantDTO> variantDTOs = product.getVariants() != null ?
                product.getVariants().stream()
                        .filter(var -> var.getDeletedAt() == null)
                        .map(this::mapVariantToDTO)
                        .collect(Collectors.toList()) : new ArrayList<>();

        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .description(product.getDescription())
                .basePrice(product.getBasePrice())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .isVisible(product.getIsVisible())
                .soldCount(product.getSoldCount())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .images(imageDTOs)
                .variants(variantDTOs)
                .build();
    }

    private ProductDTO mapToListDTO(Product product) {
        String primaryImageUrl = null;
        if (product.getImages() != null) {
            primaryImageUrl = product.getImages().stream()
                    .filter(img -> img.getDeletedAt() == null && Boolean.TRUE.equals(img.getIsPrimary()))
                    .findFirst()
                    .map(ProductImage::getImageUrl)
                    .orElse(product.getImages().stream()
                            .filter(img -> img.getDeletedAt() == null)
                            .findFirst()
                            .map(ProductImage::getImageUrl)
                            .orElse(null));
        }

        Long totalStock = product.getVariants() != null ?
                product.getVariants().stream()
                        .filter(var -> var.getDeletedAt() == null)
                        .mapToLong(var -> var.getStockQuantity() != null ? var.getStockQuantity() : 0)
                        .sum() : 0L;

        ProductDTO dto = ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .basePrice(product.getBasePrice())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .isVisible(product.getIsVisible())
                .soldCount(product.getSoldCount())
                .createdAt(product.getCreatedAt())
                .build();

        if (primaryImageUrl != null) {
            dto.setImages(List.of(ProductImageDTO.builder().imageUrl(primaryImageUrl).build()));
        }

        return dto;
    }

    private ProductImageDTO mapImageToDTO(ProductImage image) {
        return ProductImageDTO.builder()
                .id(image.getId())
                .imageUrl(image.getImageUrl())
                .altText(image.getAltText())
                .sortOrder(image.getSortOrder())
                .isPrimary(image.getIsPrimary())
                .build();
    }

    private ProductVariantDTO mapVariantToDTO(ProductVariant variant) {
        return ProductVariantDTO.builder()
                .id(variant.getId())
                .sku(variant.getSku())
                .color(variant.getColor())
                .size(variant.getSize())
                .stockQuantity(variant.getStockQuantity())
                .priceAdjustment(variant.getPriceAdjustment())
                .finalPrice(variant.getFinalPrice())
                .isAvailable(variant.getIsAvailable())
                .inStock(variant.isInStock())
                .build();
    }
}
