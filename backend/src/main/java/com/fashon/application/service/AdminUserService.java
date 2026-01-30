package com.fashon.application.service;

import com.fashon.application.dto.UpdateUserRequest;
import com.fashon.application.dto.UserDTO;
import com.fashon.domain.entity.User;
import com.fashon.domain.enums.Role;
import com.fashon.infrastructure.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;

    // Lay danh sach user
    @Transactional(readOnly = true)
    public Page<UserDTO> getAllUsers(Pageable pageable, Role role, String search) {
        Page<User> userPage;
        boolean hasSearch = search != null && !search.trim().isEmpty();

        if (role != null) {
            if (hasSearch) {
                userPage = userRepository.searchUsersByRole(search, role, pageable);
            } else {
                userPage = userRepository.findByRoleAndDeletedAtIsNull(role, pageable);
            }
        } else {
            if (hasSearch) {
                userPage = userRepository.searchUsers(search, pageable);
            } else {
                userPage = userRepository.findAllByDeletedAtIsNull(pageable);
            }
        }

        return userPage.map(UserDTO::fromEntity);
    }

    // Lay user theo ID
    @Transactional(readOnly = true)
    public UserDTO getUserById(Long id) {
        User user = userRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new RuntimeException("Khong tim thay user"));
        return UserDTO.fromEntity(user);
    }

    // Cap nhat thong tin
    @Transactional
    public UserDTO updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new RuntimeException("Khong tim thay user"));

        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setRole(request.getRole());

        User updatedUser = userRepository.save(user);
        return UserDTO.fromEntity(updatedUser);
    }

    // Xoa user (soft delete)
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new RuntimeException("Khong tim thay user"));

        user.setDeletedAt(LocalDateTime.now());
        userRepository.save(user);
    }
}
