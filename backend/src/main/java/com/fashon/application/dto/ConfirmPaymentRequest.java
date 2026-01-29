package com.fashon.application.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConfirmPaymentRequest {

    @Size(max = 100, message = "Transaction code must not exceed 100 characters")
    private String transactionCode;

    @Size(max = 500, message = "Notes must not exceed 500 characters")
    private String notes;
}
