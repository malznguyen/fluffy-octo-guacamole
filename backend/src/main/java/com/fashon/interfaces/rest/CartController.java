package com.fashon.interfaces.rest;

import com.fashon.application.dto.*;
import com.fashon.application.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
@Tag(name = "Cart", description = "Shopping cart management APIs")
@SecurityRequirement(name = "bearerAuth")
public class CartController {

    private final CartService cartService;

    @GetMapping
    @Operation(summary = "Get my cart", description = "Get the current user's shopping cart with all items")
    public ResponseEntity<Map<String, Object>> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        CartDTO cart = cartService.getCart(userDetails.getUsername());
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", cart
        ));
    }

    @PostMapping("/items")
    @Operation(summary = "Add item to cart", description = "Add a product variant to the shopping cart")
    public ResponseEntity<Map<String, Object>> addToCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody AddToCartRequest request) {
        CartDTO cart = cartService.addToCart(userDetails.getUsername(), request);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", cart,
                "message", "Item added to cart successfully"
        ));
    }

    @PutMapping("/items/{id}")
    @Operation(summary = "Update cart item quantity", description = "Update the quantity of a cart item")
    public ResponseEntity<Map<String, Object>> updateCartItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody UpdateCartItemRequest request) {
        CartDTO cart = cartService.updateCartItem(userDetails.getUsername(), id, request);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", cart,
                "message", "Cart item updated successfully"
        ));
    }

    @DeleteMapping("/items/{id}")
    @Operation(summary = "Remove item from cart", description = "Remove a specific item from the shopping cart")
    public ResponseEntity<Map<String, Object>> removeCartItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        CartDTO cart = cartService.removeCartItem(userDetails.getUsername(), id);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", cart,
                "message", "Item removed from cart successfully"
        ));
    }
}
