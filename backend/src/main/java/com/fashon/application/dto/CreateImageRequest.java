package com.fashon.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateImageRequest {

    @NotBlank(message = "Image URL is required")
    @Size(max = 1000, message = "Image URL must not exceed 1000 characters")
    private String imageUrl;

    @Size(max = 255, message = "Alt text must not exceed 255 characters")
    private String altText;

    @NotNull(message = "Sort order is required")
    private Integer sortOrder;

    private Boolean isPrimary;
}
