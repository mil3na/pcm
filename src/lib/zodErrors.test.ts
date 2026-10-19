import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { formatZodIssueSummary } from '@/lib/zodErrors';

describe('formatZodIssueSummary', () => {
    it('summarizes one issue and its field path', () => {
        const result = z.object({ name: z.string() }).safeParse({ name: 42 });
        if (result.success) throw new Error('Expected validation to fail');

        expect(formatZodIssueSummary(result.error)).toBe(
            '1 validation issue; affected fields: name',
        );
    });

    it('collapses array indices in repeated issue paths', () => {
        const result = z.object({ values: z.array(z.string()) }).safeParse({
            values: [1, 2, 3],
        });
        if (result.success) throw new Error('Expected validation to fail');

        expect(formatZodIssueSummary(result.error)).toBe(
            '3 validation issues; affected fields: values.*',
        );
    });

    it('shows no more than three distinct paths', () => {
        const result = z
            .object({
                first: z.string(),
                second: z.string(),
                third: z.string(),
                fourth: z.string(),
            })
            .safeParse({ first: 1, second: 2, third: 3, fourth: 4 });
        if (result.success) throw new Error('Expected validation to fail');

        expect(formatZodIssueSummary(result.error)).toBe(
            '4 validation issues; affected fields: first, second, third; 1 more field',
        );
    });
});
