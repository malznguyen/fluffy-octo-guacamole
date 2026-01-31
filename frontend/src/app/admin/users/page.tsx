'use client';

import { useState, useMemo } from 'react';
import {
    Users,
    UserPlus,
    Search,
    Filter,
    Shield,
    ShieldCheck,
    ChevronLeft,
    ChevronRight,
    Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { UserTable } from '@/components/admin/users/user-table';
import { UserFormDialog } from '@/components/admin/users/user-form-dialog';
import { DeleteUserDialog } from '@/components/admin/users/delete-user-dialog';
import { UserDetailDialog } from '@/components/admin/users/user-detail-dialog';
import { UserOrdersDialog } from '@/components/admin/users/user-orders-dialog';
import { useAdminUsers, useUpdateUser, useDeleteUser } from '@/hooks/use-admin-users';
import { UserDTO, UpdateUserRequest, Role } from '@/types/user';

const ITEMS_PER_PAGE = 10;

export default function AdminUsersPage() {
    // State
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);

    // Dialog states
    const [editingUser, setEditingUser] = useState<UserDTO | null>(null);
    const [viewingUser, setViewingUser] = useState<UserDTO | null>(null);
    const [viewingUserOrders, setViewingUserOrders] = useState<UserDTO | null>(null);
    const [deletingUser, setDeletingUser] = useState<UserDTO | null>(null);

    // Queries
    // Note: We pass standard params, but if API is flat list, logic below handles client-side filtering
    const { data: usersResponse, isLoading, error } = useAdminUsers({ 
        page: currentPage - 1, 
        size: ITEMS_PER_PAGE, 
        search: searchQuery, 
        role: roleFilter 
    });

    // Mutations
    const updateMutation = useUpdateUser();
    const deleteMutation = useDeleteUser();

    // Process data (Client-side filtering fallback if API returns flat list or if we want stricter local filter)
    // Assuming the hook might return a structure that needs further filtering if API doesn't handle it perfectly
    const allUsers = usersResponse?.content || [];

    // If the API returns a flat list (totalElements matches array length but we want pagination), 
    // or if we rely on client side filtering:
    const filteredUsers = useMemo(() => {
        let result = [...allUsers];

        // Client-side Filter fallback (if API doesn't filter)
        // Note: If API already filters, this is redundant but safe
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (u) =>
                    u.fullName.toLowerCase().includes(query) ||
                    u.email.toLowerCase().includes(query)
            );
        }

        if (roleFilter !== 'all') {
            result = result.filter((u) => u.role === roleFilter);
        }

        return result;
    }, [allUsers, searchQuery, roleFilter]);

    // Handle client-side pagination if needed. 
    // If API returns paged data (totalElements > size), we use that. 
    // If API returns ALL data in one go (typical for small user bases), we paginate locally.
    const isClientSidePagination = usersResponse?.totalPages === 1 && usersResponse?.totalElements > ITEMS_PER_PAGE;

    const displayUsers = useMemo(() => {
        if (isClientSidePagination) {
            const start = (currentPage - 1) * ITEMS_PER_PAGE;
            return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
        }
        return filteredUsers;
    }, [filteredUsers, currentPage, isClientSidePagination]);

    const totalPages = isClientSidePagination
        ? Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)
        : (usersResponse?.totalPages || 1);

    // Handlers
    const handleEdit = (user: UserDTO) => {
        setEditingUser(user);
    };

    const handleUpdate = (data: UpdateUserRequest) => {
        if (editingUser) {
            updateMutation.mutate(
                { id: editingUser.id, data },
                {
                    onSuccess: () => {
                        setEditingUser(null);
                    },
                }
            );
        }
    };

    const handleDelete = (user: UserDTO) => {
        setDeletingUser(user);
    };

    const confirmDelete = () => {
        if (deletingUser) {
            deleteMutation.mutate(deletingUser.id, {
                onSuccess: () => {
                    setDeletingUser(null);
                },
            });
        }
    };

    if (error) {
        return (
            <div className="p-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <Users className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-red-800 mb-2">
                        Không thể tải danh sách người dùng
                    </h3>
                    <p className="text-red-600 mb-4">
                        {error instanceof Error ? error.message : 'Đã có lỗi xảy ra'}
                    </p>
                    <Button onClick={() => window.location.reload()}>Thử lại</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-800 flex items-center gap-3">
                        <Users className="w-8 h-8 text-neutral-800" />
                        Quản lý người dùng
                    </h1>
                    <p className="text-neutral-500 mt-1">
                        {isLoading
                            ? 'Đang tải...'
                            : `${filteredUsers.length} người dùng trong hệ thống`}
                    </p>
                </div>
                {/* Note: User creation is typically done via Registration, but an Admin might want to invite/create. 
            Requirement didn't explicitly ask for "Add User", but usually there's one. 
            However, strictly following requirements "Chuc nang: ... Table, Detail, Edit, Delete...". 
            No "Create" listed in Detailed User Stories. I will omit "Add User" button unless requested or critical. 
            The requirement says "UI giong admin/products page", which has Add button. 
            But given API doesn't show Admin Create User endpoint (only Public Register), I'll skip it to be safe.
        */}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <Input
                            placeholder="Tìm kiếm theo tên hoặc email..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="pl-10"
                        />
                    </div>

                    {/* Role Filter */}
                    <div className="w-full md:w-48">
                        <Select
                            value={roleFilter}
                            onValueChange={(value) => {
                                setRoleFilter(value);
                                setCurrentPage(1);
                            }}
                        >
                            <SelectTrigger>
                                <Shield className="w-4 h-4 mr-2 text-neutral-400" />
                                <SelectValue placeholder="Vai trò" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả vai trò</SelectItem>
                                <SelectItem value={Role.CUSTOMER}>Khách hàng</SelectItem>
                                <SelectItem value={Role.ADMIN}>Quản trị viên</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <UserTable
                users={displayUsers}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={(user) => setViewingUser(user)}
                onViewOrders={(user) => setViewingUserOrders(user)}
            />

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                    <p className="text-sm text-neutral-500">
                        Trang {currentPage} / {totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            // Only show a window of pages to avoid overflow if too many pages
                            // Simple version: show all if < 10, else simplified. 
                            // For now, assuming standard pagination.
                            (totalPages <= 7 || Math.abs(currentPage - page) <= 2 || page === 1 || page === totalPages) && (
                                <Button
                                    key={page}
                                    variant={page === currentPage ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setCurrentPage(page)}
                                    className={`min-w-[36px] ${page === currentPage ? '' : 'text-neutral-600'}`}
                                >
                                    {page}
                                </Button>
                            )
                        ))}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Dialogs */}
            <UserFormDialog
                isOpen={!!editingUser}
                onClose={() => setEditingUser(null)}
                onSubmit={handleUpdate}
                user={editingUser}
                isLoading={updateMutation.isPending}
            />

            <DeleteUserDialog
                isOpen={!!deletingUser}
                onClose={() => setDeletingUser(null)}
                onConfirm={confirmDelete}
                userName={deletingUser?.fullName || ''}
                userId={deletingUser?.id || null}
                isLoading={deleteMutation.isPending}
            />

            <UserDetailDialog
                isOpen={!!viewingUser}
                onClose={() => setViewingUser(null)}
                user={viewingUser}
            />

            {viewingUserOrders && (
                <UserOrdersDialog
                    isOpen={!!viewingUserOrders}
                    onClose={() => setViewingUserOrders(null)}
                    userId={viewingUserOrders.id}
                    userName={viewingUserOrders.fullName}
                />
            )}
        </div>
    );
}
