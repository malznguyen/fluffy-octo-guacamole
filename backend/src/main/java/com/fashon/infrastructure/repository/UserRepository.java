package com.fashon.infrastructure.repository;

import com.fashon.domain.entity.User;
import com.fashon.domain.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    // Find all active users
    Page<User> findAllByDeletedAtIsNull(Pageable pageable);

    // Find active user by ID
    Optional<User> findByIdAndDeletedAtIsNull(Long id);

    // Find active users by role
    Page<User> findByRoleAndDeletedAtIsNull(Role role, Pageable pageable);

    // Search active users
    @Query("SELECT u FROM User u WHERE u.deletedAt IS NULL AND (u.fullName LIKE %:search% OR u.email LIKE %:search%)")
    Page<User> searchUsers(@Param("search") String search, Pageable pageable);

    // Search active users by role
    @Query("SELECT u FROM User u WHERE u.deletedAt IS NULL AND u.role = :role AND (u.fullName LIKE %:search% OR u.email LIKE %:search%)")
    Page<User> searchUsersByRole(@Param("search") String search, @Param("role") Role role, Pageable pageable);
}
