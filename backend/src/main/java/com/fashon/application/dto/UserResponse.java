package com.fashon.application.dto;

import com.fashon.domain.enums.Role;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class UserResponse {
    private Long id;
    private String email;
    private String fullName;
    private String phone;
    private String avatarUrl;
    private Role role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
