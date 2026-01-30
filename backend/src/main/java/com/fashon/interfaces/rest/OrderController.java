package com.fashon.interfaces.rest;

import com.fashon.application.dto.*;
import com.fashon.application.service.OrderService;
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
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Order management APIs for customers")
@SecurityRequirement(name = "bearerAuth")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @Operation(summary = "Create order from cart", description = "Create a new order from the current shopping cart")
    public ResponseEntity<Map<String, Object>> createOrder(
            Authentication authentication,
            @Valid @RequestBody CreateOrderRequest request) {
        String email = authentication.getName();
        OrderDTO order = orderService.createOrderFromCart(email, request);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", order,
                "message", "Order created successfully",
                "orderCode", order.getOrderCode()
        ));
    }

    @GetMapping
    @Operation(summary = "Get my orders", description = "Get order history for the current user with pagination")
    public ResponseEntity<Map<String, Object>> getMyOrders(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        String email = authentication.getName();
        Pageable pageable = PageRequest.of(page, size);
        Page<OrderDTO> orders = orderService.getMyOrders(email, pageable);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", Map.of(
                        "content", orders.getContent(),
                        "totalElements", orders.getTotalElements(),
                        "totalPages", orders.getTotalPages(),
                        "currentPage", orders.getNumber(),
                        "size", orders.getSize()
                )
        ));
    }

    @GetMapping("/{orderCode}")
    @Operation(summary = "Get order details", description = "Get detailed information about a specific order")
    public ResponseEntity<Map<String, Object>> getOrderByCode(
            Authentication authentication,
            @PathVariable String orderCode) {
        String email = authentication.getName();
        OrderDTO order = orderService.getOrderByCode(email, orderCode);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", order
        ));
    }

    @PostMapping("/{orderCode}/cancel")
    @Operation(summary = "Cancel order", description = "Cancel an order if it hasn't been shipped yet")
    public ResponseEntity<Map<String, Object>> cancelOrder(
            Authentication authentication,
            @PathVariable String orderCode) {
        String email = authentication.getName();
        OrderDTO order = orderService.cancelOrder(email, orderCode);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", order,
                "message", "Order cancelled successfully"
        ));
    }
}
