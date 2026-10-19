import type { ReactNode } from 'react';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { Callout as RadixCallout } from '@radix-ui/themes';

interface ErrorCalloutProps {
    children: ReactNode;
    action?: ReactNode;
    className?: string;
    size?: '1' | '2' | '3';
}

export function ErrorCallout({ children, action, className, size = '2' }: ErrorCalloutProps) {
    return (
        <RadixCallout.Root
            color="red"
            role="alert"
            size={size}
            className={className}
        >
            <RadixCallout.Icon>
                <ExclamationTriangleIcon />
            </RadixCallout.Icon>
            <RadixCallout.Text>
                {children}
                {action && <> {action}</>}
            </RadixCallout.Text>
        </RadixCallout.Root>
    );
}
