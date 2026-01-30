package com.fashon.interfaces.rest;

import com.fashon.application.dto.*;
import com.fashon.application.service.OrderService;
import com.fashon.domain.enums.OrderStatus;
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

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/orders")
@RequiredArgsConstructor
@Tag(name = "Admin - Orders", description = "Order management APIs for administrators")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminOrderController {

    private final OrderService orderService;

    @GetMapping
    @Operation(summary = "Get all orders", description = "Get all orders with pagination and optional status filter")
    public ResponseEntity<Map<String, Object>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long userId) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<OrderDTO> orders;
        OrderStatus orderStatus = null;

        if (status != null && !status.isEmpty()) {
            try {
                orderStatus = OrderStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Invalid status: " + status));
            }
        }

        orders = orderService.getAllOrdersForAdmin(pageable, orderStatus, userId);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", Map.of(
                        "content", orders.getContent(),
                        "totalElements", orders.getTotalElements(),
                        "totalPages", orders.getTotalPages(),
                        "currentPage", orders.getNumber(),
                        "size", orders.getSize())));
    }

    @GetMapping("/{orderCode}")
    @Operation(summary = "Get order by code", description = "Get detailed information about any order by its code")
    public ResponseEntity<Map<String, Object>> getOrderByCode(@PathVariable String orderCode) {
        OrderDTO order = orderService.getOrderByCodeForAdmin(orderCode);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", order));
    }

    @PutMapping("/{orderCode}/status")
    @Operation(summary = "Update order status", description = "Update the status of an order (e.g., PENDING -> CONFIRMED -> SHIPPED -> DELIVERED -> COMPLETED)")
    public ResponseEntity<Map<String, Object>> updateOrderStatus(
            @PathVariable String orderCode,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        OrderDTO order = orderService.updateOrderStatus(orderCode, request);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", order,
                "message", "Order status updated to " + order.getStatus()));
    }

    @PostMapping("/{orderCode}/cancel")
    @Operation(summary = "Cancel order", description = "Cancel an order on behalf of a customer")
    public ResponseEntity<Map<String, Object>> cancelOrder(@PathVariable String orderCode) {
        OrderDTO order = orderService.cancelOrderByAdmin(orderCode);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", order,
                "message", "Order cancelled successfully"));
    }
}
