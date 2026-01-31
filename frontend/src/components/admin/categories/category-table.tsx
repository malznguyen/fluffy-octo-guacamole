'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
    Edit,
    Trash2,
    Eye,
    MoreHorizontal,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Folder,
    ChevronRight,
    ChevronDown,
    CornerDownRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CategoryDTO } from '@/types/category';
import { cn } from '@/lib/utils';

export type SortField = 'name' | 'sortOrder' | 'isActive';
export type SortOrder = 'asc' | 'desc';

interface CategoryTableProps {
    categories: CategoryDTO[];
    isLoading: boolean;
    onEdit: (category: CategoryDTO) => void;
    onDelete: (category: CategoryDTO) => void;
    sortField: SortField;
    sortOrder: SortOrder;
    onSort: (field: SortField) => void;
    isTree?: boolean;
}

interface TreeRowProps {
    category: CategoryDTO;
    level: number;
    onEdit: (category: CategoryDTO) => void;
    onDelete: (category: CategoryDTO) => void;
    isTree: boolean;
}

function CategoryRow({ category, level, onEdit, onDelete, isTree }: TreeRowProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const hasChildren = category.children && category.children.length > 0;

    const toggleExpand = () => setIsExpanded(!isExpanded);

    return (
        <>
            <TableRow className="group hover:bg-neutral-50">
                {/* Name + Slug */}
                <TableCell>
                    <div
                        className="flex items-center gap-2"
                        style={{ paddingLeft: `${level * 24}px` }}
                    >
                        {isTree && hasChildren ? (
                            <button
                                onClick={toggleExpand}
                                className="p-0.5 hover:bg-neutral-200 rounded text-neutral-500 transition-colors"
                            >
                                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </button>
                        ) : isTree ? (
                            // Placeholder for alignment
                            <div className="w-5" />
                        ) : null}

                        {isTree && level > 0 && !hasChildren && (
                            <CornerDownRight className="w-4 h-4 text-neutral-300 -ml-1" />
                        )}

                        <Folder className={cn("w-4 h-4 text-neutral-400", isTree && level > 0 && "text-neutral-300")} />

                        <div>
                            <div className="font-medium text-neutral-900">
                                {category.name}
                            </div>
                            <div className="text-xs text-neutral-500 font-mono">
                                {category.slug}
                            </div>
                        </div>
                    </div>
                </TableCell>

                {/* Parent - Hide in tree view to reduce clutter, or keep it? 
                    In tree view, parent is implied by structure. 
                    But let's keep it for clarity if user wants explicitly.
                    Actually, in tree view, this column is redundant. 
                    Let's render it but maybe dimmed.
                */}
                <TableCell>
                    {category.parentName ? (
                        <span className="inline-flex items-center px-2 py-1 rounded bg-neutral-100 text-neutral-600 text-xs font-medium">
                            {category.parentName}
                        </span>
                    ) : (
                        <span className="text-neutral-400 text-sm italic">--</span>
                    )}
                </TableCell>

                {/* Sort Order */}
                <TableCell className="text-center">
                    <span className="font-mono text-neutral-600">
                        {category.sortOrder}
                    </span>
                </TableCell>

                {/* Status */}
                <TableCell>
                    <Badge
                        variant={category.isActive ? 'default' : 'secondary'}
                        className={
                            category.isActive
                                ? 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200'
                                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 border-neutral-200'
                        }
                    >
                        {category.isActive ? 'Đang hoạt động' : 'Tạm ẩn'}
                    </Badge>
                </TableCell>

                {/* Description */}
                <TableCell>
                    <div className="max-w-[200px] truncate text-neutral-600 text-sm" title={category.description || ''}>
                        {category.description || '--'}
                    </div>
                </TableCell>

                {/* Actions */}
                <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                            >
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            side="bottom"
                            className="z-50 w-40"
                        >
                            <DropdownMenuItem onClick={() => onEdit(category)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link href={`/categories/${category.slug}`} target="_blank" className="flex items-center w-full">
                                    <Eye className="w-4 h-4 mr-2" />
                                    Xem trên shop
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-red-600 focus:text-red-700 focus:bg-red-50"
                                onClick={() => onDelete(category)}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Xóa
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            </TableRow>
            {isTree && isExpanded && hasChildren && category.children.map((child) => (
                <CategoryRow
                    key={child.id}
                    category={child}
                    level={level + 1}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isTree={isTree}
                />
            ))}
        </>
    );
}

export function CategoryTable({
    categories,
    isLoading,
    onEdit,
    onDelete,
    sortField,
    sortOrder,
    onSort,
    isTree = false,
}: CategoryTableProps) {

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) {
            return <ArrowUpDown className="w-4 h-4 text-neutral-400" />;
        }
        return sortOrder === 'asc' ? (
            <ArrowUp className="w-4 h-4 text-blue-500" />
        ) : (
            <ArrowDown className="w-4 h-4 text-blue-500" />
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-neutral-50">
                            <TableHead
                                className="cursor-pointer hover:bg-neutral-100 w-[30%]"
                                onClick={() => onSort('name')}
                            >
                                <div className="flex items-center gap-1">
                                    Tên danh mục
                                    {!isTree && <SortIcon field="name" />}
                                    {isTree && <span className="text-xs font-normal text-neutral-400 ml-1">(Phân cấp)</span>}
                                </div>
                            </TableHead>
                            <TableHead className="w-[20%]">Danh mục cha</TableHead>
                            <TableHead
                                className="cursor-pointer hover:bg-neutral-100 text-center w-[15%]"
                                onClick={() => onSort('sortOrder')}
                            >
                                <div className="flex items-center justify-center gap-1">
                                    Thứ tự
                                    <SortIcon field="sortOrder" />
                                </div>
                            </TableHead>
                            <TableHead
                                className="cursor-pointer hover:bg-neutral-100 w-[15%]"
                                onClick={() => onSort('isActive')}
                            >
                                <div className="flex items-center gap-1">
                                    Trạng thái
                                    <SortIcon field="isActive" />
                                </div>
                            </TableHead>
                            <TableHead className="w-[20%]">Mô tả</TableHead>
                            <TableHead className="w-12"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            // Loading skeleton
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    {Array.from({ length: 6 }).map((_, j) => (
                                        <TableCell key={j}>
                                            <div className="h-4 bg-neutral-200 rounded animate-pulse" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : categories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="py-16 text-center">
                                    <Folder className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-neutral-700 mb-2">
                                        Chưa có danh mục nào
                                    </h3>
                                    <p className="text-neutral-500">
                                        {isTree ? "Chưa có danh mục gốc" : "Không tìm thấy danh mục phù hợp"}
                                    </p>
                                </TableCell>
                            </TableRow>
                        ) : (
                            categories.map((category) => (
                                <CategoryRow
                                    key={category.id}
                                    category={category}
                                    level={0}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    isTree={isTree}
                                />
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

