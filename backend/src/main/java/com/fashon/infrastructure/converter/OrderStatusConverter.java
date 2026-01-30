package com.fashon.infrastructure.converter;

import com.fashon.domain.enums.OrderStatus;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class OrderStatusConverter implements AttributeConverter<OrderStatus, String> {

    @Override
    public String convertToDatabaseColumn(OrderStatus attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.name().toLowerCase();
    }

    @Override
    public OrderStatus convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) {
            return null;
        }
        try {
            return OrderStatus.valueOf(dbData.toUpperCase());
        } catch (IllegalArgumentException e) {
            return OrderStatus.PENDING; // Fallback to PENDING to prevent crash
        }
    }
}
