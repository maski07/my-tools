/**
 * Normalizes a company name for consistent comparison
 * - Trims whitespace
 * - Converts to lowercase for case-insensitive comparison
 * - Removes extra spaces
 */
export function normalizeCompanyName(companyName: string): string {
    if (!companyName || typeof companyName !== 'string') {
        return '';
    }

    return companyName
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' '); // Replace multiple spaces with single space
}

/**
 * Creates a regex pattern for flexible company name matching
 * - Escapes special regex characters
 * - Creates a pattern that matches the company name as a word boundary
 */
export function createCompanyNameRegex(companyName: string): RegExp {
    if (!companyName || typeof companyName !== 'string') {
        return new RegExp('', 'g');
    }

    // Escape special regex characters
    const escapedName = companyName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Create a pattern that matches the company name as a word boundary
    return new RegExp(`\\b${escapedName}\\b`, 'gi');
}

/**
 * Finds all matching companies using regex pattern matching
 */
export function findMatchingCompanies(inputName: string, cachedCompanies: Set<string>): string[] {
    if (!inputName || !cachedCompanies) {
        return [];
    }

    const normalizedInput = normalizeCompanyName(inputName);
    const matchingCompanies: string[] = [];

    for (const cachedCompany of cachedCompanies) {
        const regex = createCompanyNameRegex(normalizedInput);
        if (regex.test(cachedCompany)) {
            matchingCompanies.push(cachedCompany);
        }
    }

    return matchingCompanies;
}

/**
 * Normalizes an array of company names
 */
export function normalizeCompanyNames(companyNames: string[]): string[] {
    return companyNames
        .map(normalizeCompanyName)
        .filter(name => name.length > 0);
} 