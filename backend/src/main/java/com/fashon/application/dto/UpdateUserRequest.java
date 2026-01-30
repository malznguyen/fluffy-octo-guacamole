package com.fashon.application.dto;

import com.fashon.domain.enums.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {

    @NotBlank(message = "Họ tên không được để trống")
    @Size(max = 255, message = "Họ tên không được quá 255 ký tự")
    private String fullName;

    @Pattern(regexp = "^[0-9]{10,15}$", message = "Số điện thoại phải từ 10-15 số")
    private String phone;

    @NotNull(message = "Vai trò không được để trống")
    private Role role;
}
