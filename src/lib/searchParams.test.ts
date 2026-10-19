import { describe, expect, it } from 'vitest';
import { parsePageNumber } from '@/lib/searchParams';

describe('parsePageNumber', () => {
    it.each([
        [1, 1],
        [12, 12],
        ['3', 3],
        ['2.0', 2],
    ])('accepts %j as page %i', (value, expected) => {
        expect(parsePageNumber(value)).toBe(expected);
    });

    it.each([undefined, null, '', 'not-a-number', 0, -1, 1.5, Number.MAX_SAFE_INTEGER + 1])(
        'falls back to page 1 for %j',
        (value) => {
            expect(parsePageNumber(value)).toBe(1);
        },
    );
});
