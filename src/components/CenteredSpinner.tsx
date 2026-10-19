import { Spinner } from '@radix-ui/themes';

interface CenteredSpinnerProps {
    label: string;
    className?: string;
}

export function CenteredSpinner({ label, className }: CenteredSpinnerProps) {
    return (
        <div className={`centered-spinner${className ? ` ${className}` : ''}`}>
            <Spinner size="3" aria-label={label} />
        </div>
    );
}
