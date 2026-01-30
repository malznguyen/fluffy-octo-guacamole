export enum Role {
    CUSTOMER = 'CUSTOMER',
    ADMIN = 'ADMIN',
}

export interface UserDTO {
    id: number;
    email: string;
    fullName: string;
    phone: string | null;
    avatarUrl: string | null;
    role: Role;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null; // For soft delete check
}

export interface UserResponse {
    success: boolean;
    data: UserDTO;
    message: string;
}

export interface UsersResponse {
    success: boolean;
    data: {
        content: UserDTO[];
        totalElements: number;
        totalPages: number;
        currentPage: number;
        size: number;
    };
    message: string;
}

export interface UpdateUserRequest {
    fullName?: string;
    phone?: string;
    role?: Role;
    avatarUrl?: string; // Optional if we want to allow avatar update, though not prioritized in requirements
}
