package com.fashon.application.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class CreateProductRequest {

    @NotBlank(message = "Product name is required")
    @Size(max = 500, message = "Name must not exceed 500 characters")
    private String name;

    @NotBlank(message = "Slug is required")
    @Size(max = 500, message = "Slug must not exceed 500 characters")
    private String slug;

    private String description;

    @NotNull(message = "Base price is required")
    @Positive(message = "Base price must be positive")
    private BigDecimal basePrice;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    private Boolean isVisible;

    @Valid
    private List<CreateVariantRequest> variants;

    @Valid
    private List<CreateImageRequest> images;
}
