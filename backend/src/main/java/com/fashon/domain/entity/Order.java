package com.fashon.domain.entity;

import com.fashon.domain.BaseEntity;
import com.fashon.domain.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Where;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@Where(clause = "deleted_at IS NULL")
public class Order extends BaseEntity {

    @Column(name = "order_code", nullable = false, unique = true, columnDefinition = "NVARCHAR(50)")
    private String orderCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "total", nullable = false, precision = 19, scale = 4)
    private BigDecimal total;

    @Convert(converter = com.fashon.infrastructure.converter.OrderStatusConverter.class)
    @Column(name = "status", nullable = false, columnDefinition = "NVARCHAR(30)")
    private OrderStatus status = OrderStatus.PENDING;

    @Column(name = "shipping_address", nullable = false, columnDefinition = "NVARCHAR(500)")
    private String shippingAddress;

    @Column(name = "phone", nullable = false, columnDefinition = "NVARCHAR(20)")
    private String phone;

    @Column(name = "note", columnDefinition = "NVARCHAR(500)")
    private String note;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<OrderItem> items = new ArrayList<>();

    public Order(String orderCode, User user, BigDecimal total, String shippingAddress, String phone) {
        this.orderCode = orderCode;
        this.user = user;
        this.total = total;
        this.shippingAddress = shippingAddress;
        this.phone = phone;
        this.status = OrderStatus.PENDING;
    }

    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }

    public boolean canCancel() {
        return status == OrderStatus.PENDING || status == OrderStatus.CONFIRMED;
    }

    public boolean isDeliveredOrBeyond() {
        return status == OrderStatus.SHIPPED || status == OrderStatus.DELIVERED || status == OrderStatus.COMPLETED;
    }
}
