package com.fashon.application.service;

import com.fashon.domain.entity.InventoryTransaction;
import com.fashon.domain.entity.Order;
import com.fashon.domain.entity.ProductVariant;
import com.fashon.infrastructure.repository.InventoryTransactionRepository;
import com.fashon.infrastructure.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryTransactionRepository inventoryTransactionRepository;
    private final ProductVariantRepository productVariantRepository;

    @Transactional
    public void deductStockForOrder(ProductVariant variant, Integer quantity, Order order) {
        // Validate stock
        if (variant.getStockQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock for variant: " + variant.getSku() + 
                    ". Available: " + variant.getStockQuantity() + ", Required: " + quantity);
        }

        // Deduct stock
        variant.setStockQuantity(variant.getStockQuantity() - quantity);
        productVariantRepository.save(variant);

        // Log transaction
        InventoryTransaction transaction = new InventoryTransaction(
                variant,
                -quantity,
                "Order created - Stock deducted",
                order,
                variant.getStockQuantity()
        );
        inventoryTransactionRepository.save(transaction);
    }

    @Transactional
    public void returnStockForCancelledOrder(ProductVariant variant, Integer quantity, Order order) {
        // Return stock
        variant.setStockQuantity(variant.getStockQuantity() + quantity);
        productVariantRepository.save(variant);

        // Log transaction
        InventoryTransaction transaction = new InventoryTransaction(
                variant,
                quantity,
                "Order cancelled - Stock returned",
                order,
                variant.getStockQuantity()
        );
        inventoryTransactionRepository.save(transaction);
    }

    @Transactional
    public void addStock(ProductVariant variant, Integer quantity, String reason) {
        variant.setStockQuantity(variant.getStockQuantity() + quantity);
        productVariantRepository.save(variant);

        InventoryTransaction transaction = new InventoryTransaction(
                variant,
                quantity,
                reason,
                null,
                variant.getStockQuantity()
        );
        inventoryTransactionRepository.save(transaction);
    }

    @Transactional
    public void deductStock(ProductVariant variant, Integer quantity, String reason) {
        if (variant.getStockQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock. Available: " + variant.getStockQuantity());
        }

        variant.setStockQuantity(variant.getStockQuantity() - quantity);
        productVariantRepository.save(variant);

        InventoryTransaction transaction = new InventoryTransaction(
                variant,
                -quantity,
                reason,
                null,
                variant.getStockQuantity()
        );
        inventoryTransactionRepository.save(transaction);
    }

    public boolean hasEnoughStock(Long variantId, Integer requestedQuantity) {
        return productVariantRepository.findById(variantId)
                .map(variant -> variant.getStockQuantity() >= requestedQuantity)
                .orElse(false);
    }

    public Integer getCurrentStock(Long variantId) {
        return productVariantRepository.findById(variantId)
                .map(ProductVariant::getStockQuantity)
                .orElse(0);
    }
}
