package com.fashon.interfaces.rest;

import jakarta.validation.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        ErrorResponse response = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Validation failed",
                errors,
                LocalDateTime.now());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolation(ConstraintViolationException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getConstraintViolations().forEach(violation -> {
            errors.put(violation.getPropertyPath().toString(), violation.getMessage());
        });

        ErrorResponse response = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Constraint violation",
                errors,
                LocalDateTime.now());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        String message = ex.getMessage();
        String userMessage = "Dữ liệu vi phạm ràng buộc";

        // Check for duplicate SKU
        if (message != null && message.contains("product_variants") && message.contains("sku")) {
            // Extract SKU value from message if possible
            String sku = extractDuplicateValue(message);
            userMessage = sku != null
                    ? "Đã có sản phẩm với SKU '" + sku + "' này rồi"
                    : "Đã có sản phẩm với SKU này rồi";
        }
        // Check for duplicate email
        else if (message != null && message.contains("users") && message.contains("email")) {
            userMessage = "Email này đã được sử dụng";
        }
        // Check for duplicate slug
        else if (message != null && message.contains("products") && message.contains("slug")) {
            userMessage = "Slug này đã tồn tại, vui lòng chọn slug khác";
        }

        ErrorResponse response = new ErrorResponse(
                HttpStatus.CONFLICT.value(),
                userMessage,
                null,
                LocalDateTime.now());
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    private String extractDuplicateValue(String message) {
        // Try to extract the duplicate value from SQL Server error message
        // Pattern: "The duplicate key value is (VALUE)."
        int start = message.indexOf("The duplicate key value is (");
        if (start != -1) {
            start += "The duplicate key value is (".length();
            int end = message.indexOf(").", start);
            if (end != -1) {
                return message.substring(start, end);
            }
        }
        return null;
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException ex) {
        String message = ex.getMessage();

        // Check for specific business errors
        if (message != null) {
            if (message.contains("SKU")) {
                ErrorResponse response = new ErrorResponse(
                        HttpStatus.BAD_REQUEST.value(),
                        "Đã có sản phẩm với SKU này rồi",
                        null,
                        LocalDateTime.now());
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            // Handle stale token / user not found
            if (message.equals("User not found")) {
                ErrorResponse response = new ErrorResponse(
                        HttpStatus.UNAUTHORIZED.value(),
                        "Tài khoản không tồn tại hoặc đã bị xóa",
                        null,
                        LocalDateTime.now());
                return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
            }
        }

        ErrorResponse response = new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                ex.getMessage(),
                null,
                LocalDateTime.now());
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception ex) {
        ErrorResponse response = new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "An unexpected error occurred",
                null,
                LocalDateTime.now());
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public static class ErrorResponse {
        private final int status;
        private final String message;
        private final Map<String, String> errors;
        private final LocalDateTime timestamp;

        public ErrorResponse(int status, String message, Map<String, String> errors, LocalDateTime timestamp) {
            this.status = status;
            this.message = message;
            this.errors = errors;
            this.timestamp = timestamp;
        }

        public int getStatus() {
            return status;
        }

        public String getMessage() {
            return message;
        }

        public Map<String, String> getErrors() {
            return errors;
        }

        public LocalDateTime getTimestamp() {
            return timestamp;
        }
    }
}
