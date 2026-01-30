package com.fashon.interfaces.rest;

import com.fashon.application.dto.*;
import com.fashon.application.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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
    public ResponseEntity<Map<String, Object>> getCart(Authentication authentication) {
        String email = authentication.getName();
        CartDTO cart = cartService.getCart(email);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", cart
        ));
    }

    @PostMapping("/items")
    @Operation(summary = "Add item to cart", description = "Add a product variant to the shopping cart")
    public ResponseEntity<Map<String, Object>> addToCart(
            Authentication authentication,
            @Valid @RequestBody AddToCartRequest request) {
        String email = authentication.getName();
        CartDTO cart = cartService.addToCart(email, request);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", cart,
                "message", "Item added to cart successfully"
        ));
    }

    @PutMapping("/items/{id}")
    @Operation(summary = "Update cart item quantity", description = "Update the quantity of a cart item")
    public ResponseEntity<Map<String, Object>> updateCartItem(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody UpdateCartItemRequest request) {
        String email = authentication.getName();
        CartDTO cart = cartService.updateCartItem(email, id, request);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", cart,
                "message", "Cart item updated successfully"
        ));
    }

    @DeleteMapping("/items/{id}")
    @Operation(summary = "Remove item from cart", description = "Remove a specific item from the shopping cart")
    public ResponseEntity<Map<String, Object>> removeCartItem(
            Authentication authentication,
            @PathVariable Long id) {
        String email = authentication.getName();
        CartDTO cart = cartService.removeCartItem(email, id);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", cart,
                "message", "Item removed from cart successfully"
        ));
    }
}
