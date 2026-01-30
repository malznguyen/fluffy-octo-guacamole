'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { CategoryDTO, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/category';

interface CategoryFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateCategoryRequest | UpdateCategoryRequest) => void;
    category?: CategoryDTO | null;
    categories: CategoryDTO[];
    isLoading: boolean;
}

// Schema validation
const formSchema = z.object({
    name: z.string().min(1, 'Tên danh mục là bắt buộc').max(255, 'Tên quá dài'),
    slug: z.string().min(1, 'Slug là bắt buộc').regex(/^[a-z0-9-]+$/, 'Slug chỉ chứa chữ thường, số và dấu gạch ngang'),
    parentId: z.string().optional().nullable(), // Select value is string (usually ID as string)
    description: z.string().max(1000, 'Mô tả quá dài').optional(),
    sortOrder: z.coerce.number().min(0, 'Thứ tự phải lớn hơn hoặc bằng 0'),
    isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

// Tạo slug từ tên
function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu tiếng Việt
        .replace(/[^a-z0-9\s-]/g, '') // Loại bỏ ký tự đặc biệt
        .trim()
        .replace(/\s+/g, '-'); // Thay space bằng dấu -
}

export function CategoryForm({
    isOpen,
    onClose,
    onSubmit,
    category,
    categories,
    isLoading,
}: CategoryFormProps) {
    const isEditing = !!category;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            name: '',
            slug: '',
            parentId: null,
            description: '',
            sortOrder: 0,
            isActive: true,
        },
    });
    // Reset form khi mở/đóng dialog
    useEffect(() => {
        if (isOpen) {
            if (category) {
                form.reset({
                    name: category.name,
                    slug: category.slug,
                    parentId: category.parentId ? category.parentId.toString() : null, // Convert to string for Select
                    description: category.description || '',
                    sortOrder: category.sortOrder,
                    isActive: category.isActive,
                });
            } else {
                form.reset({
                    name: '',
                    slug: '',
                    parentId: null,
                    description: '',
                    sortOrder: 0,
                    isActive: true,
                });
            }
        }
    }, [isOpen, category, form]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        form.setValue('name', name);

        // Auto-generate slug nếu không phải đang edit hoặc slug chưa được sửa thủ công (đơn giản hóa: luôn auto-gen khi type name ở mode tạo mới)
        if (!isEditing) {
            form.setValue('slug', generateSlug(name));
        }
    };

    const onFormSubmit = (values: FormValues) => {
        const submitData = {
            ...values,
            parentId: values.parentId && values.parentId !== 'null' ? parseInt(values.parentId) : null,
            description: values.description || '', // Ensure empty string if undefined for API consistency
        };
        onSubmit(submitData);
    };

    // Filter available parents: Cannot be itself or its children (simple check: cannot be itself)
    // Deeper circular check requires tree traversal, simplifying here to avoid selecting self.
    const availableParents = categories.filter(c => !isEditing || c.id !== category?.id);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto z-50">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Cập nhật thông tin danh mục hiện tại'
                            : 'Điền thông tin để tạo danh mục mới'}
                    </DialogDescription>
                </DialogHeader>

                <Form {...(form as any)}>
                    <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">

                        <FormField
                            control={form.control as any}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên danh mục <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ví dụ: Áo sơ mi"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                handleNameChange(e);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control as any}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slug <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="ao-so-mi" {...field} />
                                    </FormControl>
                                    <FormDescription>Đường dẫn URL thân thiện (tự động tạo từ tên)</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control as any}
                                name="parentId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Danh mục cha</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value || undefined}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="-- Không có --" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className='z-[60]'>
                                                <SelectItem value="null">-- Không có --</SelectItem>
                                                {availableParents.map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.id.toString()}>
                                                        {cat.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control as any}
                                name="sortOrder"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Thứ tự sắp xếp</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="0" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control as any}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>Trạng thái hoạt động</FormLabel>
                                        <FormDescription>
                                            Bật để hiển thị danh mục này trên cửa hàng
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control as any}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mô tả</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Mô tả danh mục..."
                                            className="resize-none"
                                            rows={3}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                                Hủy
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        {isEditing ? 'Đang cập nhật...' : 'Đang tạo...'}
                                    </>
                                ) : isEditing ? (
                                    'Cập nhật'
                                ) : (
                                    'Tạo mới'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
