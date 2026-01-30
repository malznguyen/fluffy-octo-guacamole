package com.fashon.interfaces.rest;

import com.fashon.application.dto.UpdateUserRequest;
import com.fashon.application.dto.UserDTO;
import com.fashon.application.service.AdminUserService;
import com.fashon.domain.enums.Role;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
@Tag(name = "Admin - Users", description = "User management APIs for administrators")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    @Operation(summary = "Get all users", description = "Get all users with pagination, optional role filter and search")
    public ResponseEntity<Map<String, Object>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) String search) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<UserDTO> users = adminUserService.getAllUsers(pageable, role, search);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", Map.of(
                        "content", users.getContent(),
                        "totalElements", users.getTotalElements(),
                        "totalPages", users.getTotalPages(),
                        "currentPage", users.getNumber(),
                        "size", users.getSize())));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID", description = "Get detailed information about a user by ID")
    public ResponseEntity<Map<String, Object>> getUserById(@PathVariable Long id) {
        UserDTO user = adminUserService.getUserById(id);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", user));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update user", description = "Update user information (fullName, phone, role)")
    public ResponseEntity<Map<String, Object>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request) {
        UserDTO user = adminUserService.updateUser(id, request);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", user,
                "message", "User updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete user", description = "Soft delete a user account")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable Long id) {
        adminUserService.deleteUser(id);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "User deleted successfully"));
    }
}
