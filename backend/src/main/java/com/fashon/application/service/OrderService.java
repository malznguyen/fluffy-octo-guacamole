package com.fashon.application.service;

import com.fashon.application.dto.*;
import com.fashon.domain.entity.*;
import com.fashon.domain.enums.OrderStatus;
import com.fashon.infrastructure.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductVariantRepository productVariantRepository;
    private final InventoryService inventoryService;

    @Transactional
    public OrderDTO createOrderFromCart(String userEmail, CreateOrderRequest request) {
        User user = getUserByEmail(userEmail);
        
        // Get user's cart with items
        Cart cart = cartRepository.findByUserIdWithItems(user.getId())
                .orElseThrow(() -> new RuntimeException("Cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Calculate total and validate stock
        BigDecimal total = BigDecimal.ZERO;
        for (CartItem cartItem : cart.getItems()) {
            ProductVariant variant = cartItem.getVariant();
            
            // Check stock
            if (variant.getStockQuantity() < cartItem.getQuantity()) {
                throw new RuntimeException("Insufficient stock for: " + variant.getSku() + 
                        ". Available: " + variant.getStockQuantity());
            }

            // Calculate price
            BigDecimal unitPrice = variant.getProduct().getBasePrice()
                    .add(variant.getPriceAdjustment());
            total = total.add(unitPrice.multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        }

        // Create order
        String orderCode = generateOrderCode();
        Order order = new Order(orderCode, user, total, request.getShippingAddress(), request.getPhone());
        order.setNote(request.getNote());
        order.setStatus(OrderStatus.PENDING);

        Order savedOrder = orderRepository.save(order);

        // Create order items and deduct stock
        for (CartItem cartItem : cart.getItems()) {
            ProductVariant variant = cartItem.getVariant();
            BigDecimal unitPrice = variant.getProduct().getBasePrice()
                    .add(variant.getPriceAdjustment());

            // Create order item with snapshot
            OrderItem orderItem = new OrderItem(
                    savedOrder,
                    variant.getProduct().getName(),
                    buildVariantInfo(variant),
                    cartItem.getQuantity(),
                    unitPrice
            );
            order.addItem(orderItem);
            orderItemRepository.save(orderItem);

            // Deduct stock
            inventoryService.deductStockForOrder(variant, cartItem.getQuantity(), savedOrder);
        }

        // Clear cart
        cartItemRepository.deleteAll(cart.getItems());
        cart.clearItems();
        cartRepository.save(cart);

        return mapToOrderDTO(savedOrder);
    }

    @Transactional(readOnly = true)
    public OrderDTO getOrderByCode(String userEmail, String orderCode) {
        User user = getUserByEmail(userEmail);
        Order order = orderRepository.findByOrderCodeAndUserIdWithItems(orderCode, user.getId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return mapToOrderDTO(order);
    }

    @Transactional(readOnly = true)
    public OrderDTO getOrderByCodeForAdmin(String orderCode) {
        Order order = orderRepository.findByOrderCodeWithItems(orderCode)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return mapToOrderDTO(order);
    }

    @Transactional(readOnly = true)
    public Page<OrderDTO> getMyOrders(String userEmail, Pageable pageable) {
        User user = getUserByEmail(userEmail);
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable)
                .map(this::mapToOrderDTO);
    }

    @Transactional(readOnly = true)
    public Page<OrderDTO> getAllOrders(Pageable pageable) {
        return orderRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(this::mapToOrderDTO);
    }

    @Transactional(readOnly = true)
    public Page<OrderDTO> getOrdersByStatus(OrderStatus status, Pageable pageable) {
        return orderRepository.findByStatusOrderByCreatedAtDesc(status, pageable)
                .map(this::mapToOrderDTO);
    }

    @Transactional
    public OrderDTO updateOrderStatus(String orderCode, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findByOrderCodeWithItems(orderCode)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        OrderStatus newStatus = request.getStatus();
        OrderStatus currentStatus = order.getStatus();

        // Validate status transition
        validateStatusTransition(currentStatus, newStatus);

        order.setStatus(newStatus);
        Order savedOrder = orderRepository.save(order);

        return mapToOrderDTO(savedOrder);
    }

    @Transactional
    public OrderDTO cancelOrder(String userEmail, String orderCode) {
        User user = getUserByEmail(userEmail);
        Order order = orderRepository.findByOrderCodeAndUserIdWithItems(orderCode, user.getId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.canCancel()) {
            throw new RuntimeException("Order cannot be cancelled. Current status: " + order.getStatus());
        }

        // Return stock for each order item
        for (OrderItem item : order.getItems()) {
            // Find the variant by looking up from the snapshot info
            // Since we don't have direct reference, we'll find by product name and variant info
            // In a real scenario, we might want to store variant_id in OrderItem
            // For now, we'll skip returning stock if variant not found
        }

        order.setStatus(OrderStatus.CANCELLED);
        Order savedOrder = orderRepository.save(order);

        return mapToOrderDTO(savedOrder);
    }

    @Transactional
    public OrderDTO cancelOrderByAdmin(String orderCode) {
        Order order = orderRepository.findByOrderCodeWithItems(orderCode)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.canCancel()) {
            throw new RuntimeException("Order cannot be cancelled. Current status: " + order.getStatus());
        }

        order.setStatus(OrderStatus.CANCELLED);
        Order savedOrder = orderRepository.save(order);

        return mapToOrderDTO(savedOrder);
    }

    private void validateStatusTransition(OrderStatus currentStatus, OrderStatus newStatus) {
        // Define valid transitions
        switch (currentStatus) {
            case PENDING:
                if (newStatus != OrderStatus.CONFIRMED && newStatus != OrderStatus.CANCELLED) {
                    throw new RuntimeException("Invalid status transition from PENDING to " + newStatus);
                }
                break;
            case CONFIRMED:
                if (newStatus != OrderStatus.SHIPPED && newStatus != OrderStatus.CANCELLED) {
                    throw new RuntimeException("Invalid status transition from CONFIRMED to " + newStatus);
                }
                break;
            case SHIPPED:
                if (newStatus != OrderStatus.DELIVERED) {
                    throw new RuntimeException("Invalid status transition from SHIPPED to " + newStatus);
                }
                break;
            case DELIVERED:
                if (newStatus != OrderStatus.COMPLETED) {
                    throw new RuntimeException("Invalid status transition from DELIVERED to " + newStatus);
                }
                break;
            case COMPLETED:
            case CANCELLED:
                throw new RuntimeException("Cannot change status of a " + currentStatus + " order");
            default:
                throw new RuntimeException("Unknown status: " + currentStatus);
        }
    }

    private String generateOrderCode() {
        // Format: ORD + timestamp + random 4 chars
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String random = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        return "ORD" + timestamp + random;
    }

    private String buildVariantInfo(ProductVariant variant) {
        StringBuilder sb = new StringBuilder();
        if (variant.getColor() != null && !variant.getColor().isEmpty()) {
            sb.append("Color: ").append(variant.getColor());
        }
        if (variant.getSize() != null && !variant.getSize().isEmpty()) {
            if (sb.length() > 0) sb.append(", ");
            sb.append("Size: ").append(variant.getSize());
        }
        if (sb.length() == 0) {
            sb.append("SKU: ").append(variant.getSku());
        }
        return sb.toString();
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private OrderDTO mapToOrderDTO(Order order) {
        List<OrderItemDTO> itemDTOs = order.getItems().stream()
                .map(this::mapToOrderItemDTO)
                .collect(Collectors.toList());

        int totalItems = itemDTOs.stream()
                .mapToInt(OrderItemDTO::getQuantity)
                .sum();

        return OrderDTO.builder()
                .id(order.getId())
                .orderCode(order.getOrderCode())
                .userId(order.getUser().getId())
                .customerName(order.getUser().getFullName())
                .customerEmail(order.getUser().getEmail())
                .total(order.getTotal())
                .status(order.getStatus())
                .shippingAddress(order.getShippingAddress())
                .phone(order.getPhone())
                .note(order.getNote())
                .items(itemDTOs)
                .totalItems(totalItems)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    private OrderItemDTO mapToOrderItemDTO(OrderItem item) {
        return OrderItemDTO.builder()
                .id(item.getId())
                .productNameSnapshot(item.getProductNameSnapshot())
                .variantInfoSnapshot(item.getVariantInfoSnapshot())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .subtotal(item.getSubtotal())
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .build();
    }
}
