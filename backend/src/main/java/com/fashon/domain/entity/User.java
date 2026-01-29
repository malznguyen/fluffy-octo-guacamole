package com.fashon.domain.entity;

import com.fashon.domain.BaseEntity;
import com.fashon.domain.enums.Role;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User extends BaseEntity {

    @Column(name = "email", nullable = false, unique = true, columnDefinition = "NVARCHAR(255)")
    private String email;

    @Column(name = "password_hash", nullable = false, columnDefinition = "NVARCHAR(255)")
    private String passwordHash;

    @Column(name = "full_name", nullable = false, columnDefinition = "NVARCHAR(255)")
    private String fullName;

    @Column(name = "phone", columnDefinition = "NVARCHAR(20)")
    private String phone;

    @Column(name = "avatar_url", columnDefinition = "NVARCHAR(500)")
    private String avatarUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, columnDefinition = "NVARCHAR(50)")
    private Role role = Role.CUSTOMER;

    public User(String email, String passwordHash, String fullName, String phone) {
        this.email = email;
        this.passwordHash = passwordHash;
        this.fullName = fullName;
        this.phone = phone;
        this.role = Role.CUSTOMER;
    }
}
