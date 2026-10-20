import { FIRST_PAGE } from '@/constants';

export function parsePageNumber(value: unknown): number {
    const page = Number(value);
    return Number.isSafeInteger(page) && page > 0 ? page : FIRST_PAGE;
}
