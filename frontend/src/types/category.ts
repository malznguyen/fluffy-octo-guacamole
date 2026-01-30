export interface CategoryDTO {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    parentId: number | null;
    parentName: string | null;
    sortOrder: number;
    isActive: boolean;
    children: CategoryDTO[];
}

export interface CreateCategoryRequest {
    name: string;
    slug: string;
    parentId?: number | null;
    description?: string;
    sortOrder?: number;
    isActive?: boolean;
}

export interface UpdateCategoryRequest {
    name?: string;
    slug?: string;
    parentId?: number | null;
    description?: string;
    sortOrder?: number;
    isActive?: boolean;
}
