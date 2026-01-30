package com.fashon.application.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class WishlistDTO {
    private Long id;
    private ProductDTO product;
    private LocalDateTime addedAt; // createdAt
}
