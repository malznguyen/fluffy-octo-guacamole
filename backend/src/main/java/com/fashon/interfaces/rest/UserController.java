package com.fashon.interfaces.rest;

import com.fashon.application.dto.UpdateProfileRequest;
import com.fashon.application.dto.UserResponse;
import com.fashon.application.service.UserService;
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
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "User", description = "User profile management APIs")
@SecurityRequirement(name = "Bearer Authentication")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    @Operation(summary = "Get current user profile", description = "Retrieve the profile of the currently authenticated user")
    public ResponseEntity<Map<String, Object>> getProfile(Authentication authentication) {
        String email = authentication.getName();
        UserResponse response = userService.getProfile(email);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "data", response,
            "message", "Profile retrieved successfully"
        ));
    }

    @PutMapping("/me")
    @Operation(summary = "Update current user profile", description = "Update the profile of the currently authenticated user")
    public ResponseEntity<Map<String, Object>> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request) {
        String email = authentication.getName();
        UserResponse response = userService.updateProfile(email, request);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "data", response,
            "message", "Profile updated successfully"
        ));
    }

    @DeleteMapping("/me")
    @Operation(summary = "Delete current user account", description = "Soft delete the currently authenticated user account")
    public ResponseEntity<Map<String, Object>> deleteAccount(Authentication authentication) {
        String email = authentication.getName();
        userService.softDeleteAccount(email);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "data", null,
            "message", "Account deleted successfully"
        ));
    }
}
