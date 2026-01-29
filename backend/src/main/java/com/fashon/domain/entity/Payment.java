package com.fashon.domain.entity;

import com.fashon.domain.BaseEntity;
import com.fashon.domain.enums.PaymentMethod;
import com.fashon.domain.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Where;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@Where(clause = "deleted_at IS NULL")
public class Payment extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Enumerated(EnumType.STRING)
    @Column(name = "method", nullable = false, columnDefinition = "NVARCHAR(30)")
    private PaymentMethod method;

    @Column(name = "amount", nullable = false, precision = 19, scale = 4)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, columnDefinition = "NVARCHAR(30)")
    private PaymentStatus status = PaymentStatus.PENDING;

    @Column(name = "transaction_code", columnDefinition = "NVARCHAR(100)")
    private String transactionCode;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "notes", columnDefinition = "NVARCHAR(1000)")
    private String notes;

    public Payment(Order order, PaymentMethod method, BigDecimal amount) {
        this.order = order;
        this.method = method;
        this.amount = amount;
        this.status = PaymentStatus.PENDING;
    }

    public void markAsPaid(String transactionCode, String notes) {
        this.status = PaymentStatus.PAID;
        this.paidAt = LocalDateTime.now();
        this.transactionCode = transactionCode;
        if (notes != null && !notes.isEmpty()) {
            this.notes = notes;
        }
    }

    public void markAsFailed(String reason) {
        this.status = PaymentStatus.FAILED;
        this.notes = reason;
    }

    public void markAsRefunded(String notes) {
        this.status = PaymentStatus.REFUNDED;
        this.notes = notes;
    }

    public boolean isPaid() {
        return this.status == PaymentStatus.PAID;
    }

    public boolean canRetry() {
        return this.status == PaymentStatus.PENDING || this.status == PaymentStatus.FAILED;
    }
}
