import * as React from 'react';
import { cn } from '@/lib/utils';

export interface UnderlineInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const UnderlineInput = React.forwardRef<HTMLInputElement, UnderlineInputProps>(
    ({ className, type, label, error, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">
                        {label}
                    </label>
                )}
                <input
                    type={type}
                    className={cn(
                        'w-full bg-transparent border-0 border-b border-neutral-300 px-0 py-4 text-base',
                        'placeholder:text-neutral-400',
                        'focus:outline-none focus:border-b-2 focus:border-black',
                        'transition-all duration-200',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        error && 'border-red-500 focus:border-red-500',
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && (
                    <p className="mt-2 text-sm text-red-500">{error}</p>
                )}
            </div>
        );
    }
);
UnderlineInput.displayName = 'UnderlineInput';

export { UnderlineInput };
