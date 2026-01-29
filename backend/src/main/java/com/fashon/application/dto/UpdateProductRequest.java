package com.fashon.application.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProductRequest {

    @Size(max = 500, message = "Name must not exceed 500 characters")
    private String name;

    @Size(max = 500, message = "Slug must not exceed 500 characters")
    private String slug;

    private String description;

    @Positive(message = "Base price must be positive")
    private BigDecimal basePrice;

    private Long categoryId;

    private Boolean isVisible;

    @Valid
    private List<CreateVariantRequest> variants;

    @Valid
    private List<CreateImageRequest> images;
}
