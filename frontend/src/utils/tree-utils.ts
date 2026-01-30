
import { CategoryDTO } from '@/types/category';

/**
 * Builds a hierarchical tree structure from a flat list of categories.
 * Handles orphans by promoting them to root.
 * Sorts siblings using the provided compareFn or defaults to sortOrder.
 */
export function buildCategoryTree(
    categories: CategoryDTO[],
    compareFn?: (a: CategoryDTO, b: CategoryDTO) => number
): CategoryDTO[] {
    const categoryMap = new Map<number, CategoryDTO>();
    const roots: CategoryDTO[] = [];

    // 1. Create a deep copy of all categories and map them by ID
    categories.forEach((cat) => {
        // We use { ...cat, children: [] } to ensure we work with fresh objects
        // and initialize empty children arrays.
        categoryMap.set(cat.id, { ...cat, children: [] });
    });

    // 2. Assign children to parents
    categoryMap.forEach((node) => {
        if (node.parentId && categoryMap.has(node.parentId)) {
            const parent = categoryMap.get(node.parentId);
            if (parent) {
                parent.children.push(node);
            }
        } else {
            // If no parentId or parent not found, it's a root node
            roots.push(node);
        }
    });

    // 3. Recursive sort function
    const sortNodes = (nodes: CategoryDTO[]) => {
        if (compareFn) {
            nodes.sort(compareFn);
        } else {
            nodes.sort((a, b) => a.sortOrder - b.sortOrder);
        }

        nodes.forEach((node) => {
            if (node.children && node.children.length > 0) {
                sortNodes(node.children);
            }
        });
    };

    // 4. Sort the tree
    sortNodes(roots);

    return roots;
}
