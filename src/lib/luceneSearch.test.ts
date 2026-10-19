import { describe, expect, it } from 'vitest';
import { escapeLuceneSearchTerm } from '@/lib/luceneSearch';

describe('escapeLuceneSearchTerm', () => {
    it('leaves ordinary search terms unchanged', () => {
        expect(escapeLuceneSearchTerm('Pikachu')).toBe('Pikachu');
    });

    it('escapes whitespace and Lucene operators', () => {
        expect(escapeLuceneSearchTerm('Mr. Mime (Base Set)')).toBe('Mr.\\ Mime\\ \\(Base\\ Set\\)');
        expect(escapeLuceneSearchTerm('a+b:c')).toBe('a\\+b\\:c');
    });

    it('escapes quotes, wildcards, and slashes', () => {
        expect(escapeLuceneSearchTerm('"Pika*/chu"')).toBe('\\"Pika\\*\\/chu\\"');
    });
});
