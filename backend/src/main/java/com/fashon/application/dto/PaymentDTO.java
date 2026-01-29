package com.fashon.application.dto;

import com.fashon.domain.enums.PaymentMethod;
import com.fashon.domain.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {
    private Long id;
    private Long orderId;
    private String orderCode;
    private PaymentMethod method;
    private BigDecimal amount;
    private PaymentStatus status;
    private String transactionCode;
    private LocalDateTime paidAt;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
