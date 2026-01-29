package com.fashon.application.service;

import com.fashon.application.dto.*;
import com.fashon.domain.entity.Cart;
import com.fashon.domain.entity.CartItem;
import com.fashon.domain.entity.ProductImage;
import com.fashon.domain.entity.ProductVariant;
import com.fashon.domain.entity.User;
import com.fashon.infrastructure.repository.CartItemRepository;
import com.fashon.infrastructure.repository.CartRepository;
import com.fashon.infrastructure.repository.ProductVariantRepository;
import com.fashon.infrastructure.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository productVariantRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public CartDTO getCart(String userEmail) {
        User user = getUserByEmail(userEmail);
        Cart cart = cartRepository.findByUserIdWithItems(user.getId())
                .orElseGet(() -> createNewCart(user));
        return mapToCartDTO(cart);
    }

    @Transactional
    public CartDTO addToCart(String userEmail, AddToCartRequest request) {
        User user = getUserByEmail(userEmail);
        ProductVariant variant = productVariantRepository.findById(request.getVariantId())
                .orElseThrow(() -> new RuntimeException("Product variant not found"));

        // Check stock availability
        if (variant.getStockQuantity() < request.getQuantity()) {
            throw new RuntimeException("Insufficient stock. Available: " + variant.getStockQuantity());
        }

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseGet(() -> createNewCart(user));

        // Check if item already exists in cart
        CartItem existingItem = cartItemRepository.findByCartIdAndVariantId(cart.getId(), variant.getId())
                .orElse(null);

        if (existingItem != null) {
            // Update quantity
            int newQuantity = existingItem.getQuantity() + request.getQuantity();
            if (variant.getStockQuantity() < newQuantity) {
                throw new RuntimeException("Insufficient stock. Available: " + variant.getStockQuantity());
            }
            existingItem.setQuantity(newQuantity);
            cartItemRepository.save(existingItem);
        } else {
            // Add new item
            CartItem newItem = new CartItem(cart, variant, request.getQuantity());
            cart.addItem(newItem);
            cartItemRepository.save(newItem);
        }

        return getCart(userEmail);
    }

    @Transactional
    public CartDTO updateCartItem(String userEmail, Long cartItemId, UpdateCartItemRequest request) {
        User user = getUserByEmail(userEmail);
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        // Verify cart item belongs to user's cart
        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Cart item does not belong to your cart");
        }

        // Check stock availability
        ProductVariant variant = cartItem.getVariant();
        if (variant.getStockQuantity() < request.getQuantity()) {
            throw new RuntimeException("Insufficient stock. Available: " + variant.getStockQuantity());
        }

        cartItem.setQuantity(request.getQuantity());
        cartItemRepository.save(cartItem);

        return getCart(userEmail);
    }

    @Transactional
    public CartDTO removeCartItem(String userEmail, Long cartItemId) {
        User user = getUserByEmail(userEmail);
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        // Verify cart item belongs to user's cart
        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Cart item does not belong to your cart");
        }

        cart.removeItem(cartItem);
        cartItemRepository.delete(cartItem);

        return getCart(userEmail);
    }

    @Transactional
    public void clearCart(String userEmail) {
        User user = getUserByEmail(userEmail);
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElse(null);

        if (cart != null) {
            List<CartItem> items = cart.getItems();
            cartItemRepository.deleteAll(items);
            cart.clearItems();
            cartRepository.save(cart);
        }
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private Cart createNewCart(User user) {
        Cart cart = new Cart(user);
        return cartRepository.save(cart);
    }

    private CartDTO mapToCartDTO(Cart cart) {
        List<CartItemDTO> itemDTOs = cart.getItems().stream()
                .map(this::mapToCartItemDTO)
                .collect(Collectors.toList());

        BigDecimal totalAmount = itemDTOs.stream()
                .map(CartItemDTO::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalItems = itemDTOs.stream()
                .mapToInt(CartItemDTO::getQuantity)
                .sum();

        return CartDTO.builder()
                .id(cart.getId())
                .userId(cart.getUser().getId())
                .items(itemDTOs)
                .totalItems(totalItems)
                .totalAmount(totalAmount)
                .createdAt(cart.getCreatedAt())
                .updatedAt(cart.getUpdatedAt())
                .build();
    }

    private CartItemDTO mapToCartItemDTO(CartItem item) {
        ProductVariant variant = item.getVariant();
        String imageUrl = null;
        
        if (variant.getProduct() != null && !variant.getProduct().getImages().isEmpty()) {
            imageUrl = variant.getProduct().getImages().stream()
                    .filter(img -> img.getDeletedAt() == null)
                    .min((a, b) -> Integer.compare(a.getSortOrder(), b.getSortOrder()))
                    .map(ProductImage::getImageUrl)
                    .orElse(null);
        }

        BigDecimal unitPrice = variant.getProduct() != null 
                ? variant.getProduct().getBasePrice().add(variant.getPriceAdjustment()) 
                : BigDecimal.ZERO;

        BigDecimal subtotal = unitPrice.multiply(BigDecimal.valueOf(item.getQuantity()));

        return CartItemDTO.builder()
                .id(item.getId())
                .variantId(variant.getId())
                .productName(variant.getProduct() != null ? variant.getProduct().getName() : "Unknown")
                .color(variant.getColor())
                .size(variant.getSize())
                .sku(variant.getSku())
                .quantity(item.getQuantity())
                .unitPrice(unitPrice)
                .subtotal(subtotal)
                .imageUrl(imageUrl)
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .build();
    }
}
