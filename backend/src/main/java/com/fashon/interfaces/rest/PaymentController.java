package com.fashon.interfaces.rest;

import com.fashon.application.dto.PaymentDTO;
import com.fashon.application.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@Tag(name = "Payments", description = "Payment viewing APIs for customers")
@SecurityRequirement(name = "bearerAuth")
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping("/{orderCode}/payments")
    @Operation(summary = "Get payment history", description = "View payment history for a specific order")
    public ResponseEntity<Map<String, Object>> getPaymentsByOrderCode(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String orderCode) {
        List<PaymentDTO> payments = paymentService.getPaymentsByOrderCode(userDetails.getUsername(), orderCode);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", payments,
                "count", payments.size()
        ));
    }
}
