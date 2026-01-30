'use client';

import { cn } from '@/lib/utils';

interface VariantOption {
    value: string;
    isAvailable: boolean;
}

interface VariantSelectorProps {
    label: string;
    options: VariantOption[];
    selected: string | null;
    onSelect: (value: string) => void;
    type?: 'color' | 'size';
}

/**
 * Maps color names to CSS classes/colors for visual representation
 */
function getColorStyle(colorName: string): string {
    const colorMap: Record<string, string> = {
        'Đỏ': 'bg-red-600',
        'Xanh Cobalt': 'bg-blue-600',
        'Xanh': 'bg-blue-500',
        'Xanh Lá': 'bg-green-600',
        'Đen': 'bg-neutral-900',
        'Trắng': 'bg-white border-2 border-neutral-300',
        'Vàng': 'bg-yellow-400',
        'Hồng': 'bg-pink-400',
        'Tím': 'bg-purple-600',
        'Cam': 'bg-orange-500',
        'Nâu': 'bg-amber-800',
        'Xám': 'bg-neutral-500',
        'Be': 'bg-amber-100',
        'Kem': 'bg-amber-50 border-2 border-amber-200',
    };
    return colorMap[colorName] || 'bg-neutral-400';
}

export function VariantSelector({
    label,
    options,
    selected,
    onSelect,
    type = 'size',
}: VariantSelectorProps) {
    if (options.length === 0) return null;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-neutral-500 font-medium">
                    {label}
                </span>
                {selected && (
                    <span className="text-sm font-medium">{selected}</span>
                )}
            </div>

            <div className="flex flex-wrap gap-2">
                {options.map((option) => {
                    const isSelected = selected === option.value;
                    const isDisabled = !option.isAvailable;

                    if (type === 'color') {
                        return (
                            <button
                                key={option.value}
                                type="button"
                                disabled={isDisabled}
                                onClick={() => onSelect(option.value)}
                                className={cn(
                                    'w-10 h-10 rounded-full transition-all duration-200',
                                    getColorStyle(option.value),
                                    isSelected && 'ring-2 ring-offset-2 ring-neutral-900',
                                    isDisabled && 'opacity-30 cursor-not-allowed',
                                    !isDisabled && !isSelected && 'hover:ring-1 hover:ring-offset-1 hover:ring-neutral-400'
                                )}
                                title={option.value}
                                aria-label={`Màu ${option.value}`}
                            />
                        );
                    }

                    // Size variant
                    return (
                        <button
                            key={option.value}
                            type="button"
                            disabled={isDisabled}
                            onClick={() => onSelect(option.value)}
                            className={cn(
                                'min-w-[48px] h-12 px-4 border-2 transition-all duration-200 text-sm font-medium uppercase tracking-wide',
                                isSelected
                                    ? 'border-neutral-900 bg-neutral-900 text-white'
                                    : 'border-neutral-200 bg-white text-neutral-900 hover:border-neutral-400',
                                isDisabled && 'opacity-30 cursor-not-allowed line-through'
                            )}
                            aria-label={`Kích thước ${option.value}`}
                        >
                            {option.value}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
