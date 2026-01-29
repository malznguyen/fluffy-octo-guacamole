package com.fashon.application.dto;

import com.fashon.domain.enums.OrderStatus;
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
public class OrderDTO {
    private Long id;
    private String orderCode;
    private Long userId;
    private String customerName;
    private String customerEmail;
    private BigDecimal total;
    private OrderStatus status;
    private String shippingAddress;
    private String phone;
    private String note;
    private List<OrderItemDTO> items = new ArrayList<>();
    private Integer totalItems;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
