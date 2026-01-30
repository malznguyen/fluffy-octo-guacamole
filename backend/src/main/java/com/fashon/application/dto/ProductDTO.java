package com.fashon.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private BigDecimal basePrice;
    private Long categoryId;
    private String categoryName;
    private Boolean isVisible;
    private Long soldCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ProductImageDTO> images = new ArrayList<>();
    private List<ProductVariantDTO> variants = new ArrayList<>();
    
    // Rating fields
    private Double averageRating;
    private Long reviewCount;
}
