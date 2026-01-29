package com.fashon.interfaces.rest;

import com.fashon.application.dto.*;
import com.fashon.application.service.PaymentService;
import com.fashon.domain.enums.PaymentMethod;
import com.fashon.domain.enums.PaymentStatus;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/payments")
@RequiredArgsConstructor
@Tag(name = "Admin - Payments", description = "Payment management APIs for administrators")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminPaymentController {

    private final PaymentService paymentService;

    @GetMapping
    @Operation(summary = "Get all payments", description = "Get all payment transactions with pagination and optional filters")
    public ResponseEntity<Map<String, Object>> getAllPayments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String method) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        
        PaymentStatus paymentStatus = null;
        PaymentMethod paymentMethod = null;
        
        if (status != null && !status.isEmpty()) {
            try {
                paymentStatus = PaymentStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Invalid status: " + status
                ));
            }
        }
        
        if (method != null && !method.isEmpty()) {
            try {
                paymentMethod = PaymentMethod.valueOf(method.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Invalid method: " + method
                ));
            }
        }
        
        Page<PaymentDTO> payments = paymentService.getAllPayments(paymentStatus, paymentMethod, pageable);
        
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", Map.of(
                        "content", payments.getContent(),
                        "totalElements", payments.getTotalElements(),
                        "totalPages", payments.getTotalPages(),
                        "currentPage", payments.getNumber(),
                        "size", payments.getSize()
                )
        ));
    }

    @GetMapping("/order/{orderCode}")
    @Operation(summary = "Get payments by order", description = "View all payment attempts for a specific order")
    public ResponseEntity<Map<String, Object>> getPaymentsByOrderCode(@PathVariable String orderCode) {
        List<PaymentDTO> payments = paymentService.getPaymentsByOrderCodeForAdmin(orderCode);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", payments,
                "count", payments.size()
        ));
    }

    @PostMapping("/{orderCode}/confirm")
    @Operation(summary = "Confirm payment", description = "Confirm that payment has been received (for COD or bank transfer)")
    public ResponseEntity<Map<String, Object>> confirmPayment(
            @PathVariable String orderCode,
            @Valid @RequestBody ConfirmPaymentRequest request) {
        PaymentDTO payment = paymentService.confirmPayment(orderCode, request);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", payment,
                "message", "Payment confirmed successfully"
        ));
    }

    @PostMapping("/{orderCode}/mark-failed")
    @Operation(summary = "Mark payment failed", description = "Mark a payment as failed (for retry purposes)")
    public ResponseEntity<Map<String, Object>> markPaymentFailed(
            @PathVariable String orderCode,
            @Valid @RequestBody MarkPaymentFailedRequest request) {
        PaymentDTO payment = paymentService.markPaymentFailed(orderCode, request);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", payment,
                "message", "Payment marked as failed"
        ));
    }
}
