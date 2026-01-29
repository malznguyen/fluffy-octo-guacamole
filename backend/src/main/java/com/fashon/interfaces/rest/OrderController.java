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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
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
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateOrderRequest request) {
        OrderDTO order = orderService.createOrderFromCart(userDetails.getUsername(), request);
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
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<OrderDTO> orders = orderService.getMyOrders(userDetails.getUsername(), pageable);
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
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String orderCode) {
        OrderDTO order = orderService.getOrderByCode(userDetails.getUsername(), orderCode);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", order
        ));
    }

    @PostMapping("/{orderCode}/cancel")
    @Operation(summary = "Cancel order", description = "Cancel an order if it hasn't been shipped yet")
    public ResponseEntity<Map<String, Object>> cancelOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String orderCode) {
        OrderDTO order = orderService.cancelOrder(userDetails.getUsername(), orderCode);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", order,
                "message", "Order cancelled successfully"
        ));
    }
}
