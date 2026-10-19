import type { ZodError } from 'zod';

const MAX_DISPLAYED_ISSUE_PATHS = 3;

export function formatZodIssueSummary(error: ZodError): string {
    const issuePaths = [
        ...new Set(
            error.issues.map((issue) =>
                issue.path
                    .map((segment) => (typeof segment === 'number' ? '*' : segment))
                    .join('.') || 'response',
            ),
        ),
    ];
    const visiblePaths = issuePaths.slice(0, MAX_DISPLAYED_ISSUE_PATHS);
    const additionalPathCount = issuePaths.length - visiblePaths.length;

    return [
        `${error.issues.length} validation issue${error.issues.length === 1 ? '' : 's'}`,
        visiblePaths.length > 0 && `affected fields: ${visiblePaths.join(', ')}`,
        additionalPathCount > 0 &&
            `${additionalPathCount} more field${additionalPathCount === 1 ? '' : 's'}`,
    ]
        .filter(Boolean)
        .join('; ');
}
