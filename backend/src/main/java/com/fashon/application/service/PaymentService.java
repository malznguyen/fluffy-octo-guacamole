package com.fashon.application.service;

import com.fashon.application.dto.*;
import com.fashon.domain.entity.Order;
import com.fashon.domain.entity.Payment;
import com.fashon.domain.entity.User;
import com.fashon.domain.enums.OrderStatus;
import com.fashon.domain.enums.PaymentMethod;
import com.fashon.domain.enums.PaymentStatus;
import com.fashon.infrastructure.repository.OrderRepository;
import com.fashon.infrastructure.repository.PaymentRepository;
import com.fashon.infrastructure.repository.UserRepository;
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
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Transactional
    public Payment createPaymentForOrder(Order order, PaymentMethod method, BigDecimal amount) {
        Payment payment = new Payment(order, method, amount);
        return paymentRepository.save(payment);
    }

    @Transactional(readOnly = true)
    public List<PaymentDTO> getPaymentsByOrderCode(String userEmail, String orderCode) {
        User user = getUserByEmail(userEmail);
        
        // Verify order belongs to user
        Order order = orderRepository.findByOrderCodeAndUserId(orderCode, user.getId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        List<Payment> payments = paymentRepository.findByOrderIdOrderByCreatedAtDesc(order.getId());
        return payments.stream()
                .map(this::mapToPaymentDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PaymentDTO> getPaymentsByOrderCodeForAdmin(String orderCode) {
        Order order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        List<Payment> payments = paymentRepository.findByOrderIdOrderByCreatedAtDesc(order.getId());
        return payments.stream()
                .map(this::mapToPaymentDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public PaymentDTO confirmPayment(String orderCode, ConfirmPaymentRequest request) {
        Order order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Get the latest pending payment for this order
        Payment payment = paymentRepository.findFirstByOrderOrderCodeOrderByCreatedAtDesc(orderCode)
                .orElseThrow(() -> new RuntimeException("No payment found for this order"));

        if (payment.getStatus() == PaymentStatus.PAID) {
            throw new RuntimeException("Payment has already been confirmed");
        }

        if (payment.getStatus() == PaymentStatus.REFUNDED) {
            throw new RuntimeException("Payment has been refunded");
        }

        // Generate transaction code if not provided (for COD or simulated bank transfer)
        String transactionCode = request.getTransactionCode();
        if (transactionCode == null || transactionCode.isEmpty()) {
            transactionCode = generateTransactionCode(payment.getMethod());
        }

        // Mark payment as paid
        payment.markAsPaid(transactionCode, request.getNotes());
        Payment savedPayment = paymentRepository.save(payment);

        // For non-COD payments, auto-confirm order if it's PENDING
        if (payment.getMethod() != PaymentMethod.COD && order.getStatus() == OrderStatus.PENDING) {
            order.setStatus(OrderStatus.CONFIRMED);
            orderRepository.save(order);
        }

        return mapToPaymentDTO(savedPayment);
    }

    @Transactional
    public PaymentDTO markPaymentFailed(String orderCode, MarkPaymentFailedRequest request) {
        Order order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Get the latest pending payment for this order
        Payment payment = paymentRepository.findFirstByOrderOrderCodeOrderByCreatedAtDesc(orderCode)
                .orElseThrow(() -> new RuntimeException("No payment found for this order"));

        if (payment.getStatus() == PaymentStatus.PAID) {
            throw new RuntimeException("Cannot mark a paid payment as failed");
        }

        if (payment.getStatus() == PaymentStatus.REFUNDED) {
            throw new RuntimeException("Cannot mark a refunded payment as failed");
        }

        payment.markAsFailed(request.getReason());
        Payment savedPayment = paymentRepository.save(payment);

        return mapToPaymentDTO(savedPayment);
    }

    @Transactional(readOnly = true)
    public Page<PaymentDTO> getAllPayments(PaymentStatus status, PaymentMethod method, Pageable pageable) {
        Page<Payment> payments;
        
        if (status != null && method != null) {
            payments = paymentRepository.findByStatusAndMethodWithOrder(status, method, pageable);
        } else if (status != null) {
            payments = paymentRepository.findByStatusWithOrder(status, pageable);
        } else if (method != null) {
            payments = paymentRepository.findByMethodWithOrder(method, pageable);
        } else {
            payments = paymentRepository.findAllWithOrder(pageable);
        }
        
        return payments.map(this::mapToPaymentDTO);
    }

    @Transactional(readOnly = true)
    public PaymentDTO getLatestPaymentByOrderCode(String orderCode) {
        Payment payment = paymentRepository.findFirstByOrderOrderCodeOrderByCreatedAtDesc(orderCode)
                .orElseThrow(() -> new RuntimeException("No payment found for this order"));
        return mapToPaymentDTO(payment);
    }

    @Transactional(readOnly = true)
    public boolean isOrderPaid(Long orderId) {
        return paymentRepository.existsByOrderIdAndStatus(orderId, PaymentStatus.PAID);
    }

    private String generateTransactionCode(PaymentMethod method) {
        String prefix = method == PaymentMethod.COD ? "COD" : "TRF";
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String random = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        return prefix + timestamp + random;
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private PaymentDTO mapToPaymentDTO(Payment payment) {
        return PaymentDTO.builder()
                .id(payment.getId())
                .orderId(payment.getOrder().getId())
                .orderCode(payment.getOrder().getOrderCode())
                .method(payment.getMethod())
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .transactionCode(payment.getTransactionCode())
                .paidAt(payment.getPaidAt())
                .notes(payment.getNotes())
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .build();
    }
}
