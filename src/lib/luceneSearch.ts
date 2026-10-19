const luceneSpecialCharacters = new Set('+-&|!(){}[]^"~*?:\\/');

export function escapeLuceneSearchTerm(term: string): string {
    return Array.from(term, (character) =>
        /\s/u.test(character) || luceneSpecialCharacters.has(character)
            ? `\\${character}`
            : character,
    ).join('');
}
