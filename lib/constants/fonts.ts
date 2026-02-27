/**
 * Google Fonts configuration
 * These fonts will be available in the admin styles page dropdown
 * Each font is pre-configured with common weights
 */

export const GOOGLE_FONTS = [
    {
        name: 'Inter',
        value: 'Inter',
        variable: '--font-inter',
        category: 'sans-serif',
        weights: ['400', '500', '600', '700']
    },
    {
        name: 'Poppins',
        value: 'Poppins',
        variable: '--font-poppins',
        category: 'sans-serif',
        weights: ['400', '500', '600', '700', '800']
    },
    {
        name: 'Roboto',
        value: 'Roboto',
        variable: '--font-roboto',
        category: 'sans-serif',
        weights: ['400', '500', '700']
    },
    {
        name: 'Open Sans',
        value: 'Open Sans',
        variable: '--font-open-sans',
        category: 'sans-serif',
        weights: ['400', '500', '600', '700']
    },
    {
        name: 'Lato',
        value: 'Lato',
        variable: '--font-lato',
        category: 'sans-serif',
        weights: ['400', '700']
    },
    {
        name: 'Montserrat',
        value: 'Montserrat',
        variable: '--font-montserrat',
        category: 'sans-serif',
        weights: ['400', '500', '600', '700']
    },
    {
        name: 'Raleway',
        value: 'Raleway',
        variable: '--font-raleway',
        category: 'sans-serif',
        weights: ['400', '500', '600', '700']
    },
    {
        name: 'PT Sans',
        value: 'PT Sans',
        variable: '--font-pt-sans',
        category: 'sans-serif',
        weights: ['400', '700']
    },
    {
        name: 'Merriweather',
        value: 'Merriweather',
        variable: '--font-merriweather',
        category: 'serif',
        weights: ['400', '700']
    },
    {
        name: 'Playfair Display',
        value: 'Playfair Display',
        variable: '--font-playfair-display',
        category: 'serif',
        weights: ['400', '500', '600', '700']
    },
    {
        name: 'Lora',
        value: 'Lora',
        variable: '--font-lora',
        category: 'serif',
        weights: ['400', '500', '600', '700']
    },
    {
        name: 'Nunito',
        value: 'Nunito',
        variable: '--font-nunito',
        category: 'sans-serif',
        weights: ['400', '600', '700']
    },
    {
        name: 'Rubik',
        value: 'Rubik',
        variable: '--font-rubik',
        category: 'sans-serif',
        weights: ['400', '500', '600', '700']
    },
    {
        name: 'Work Sans',
        value: 'Work Sans',
        variable: '--font-work-sans',
        category: 'sans-serif',
        weights: ['400', '500', '600', '700']
    },
    {
        name: 'Quicksand',
        value: 'Quicksand',
        variable: '--font-quicksand',
        category: 'sans-serif',
        weights: ['400', '500', '600', '700']
    },
    {
        name: 'Josefin Sans',
        value: 'Josefin Sans',
        variable: '--font-josefin-sans',
        category: 'sans-serif',
        weights: ['400', '600', '700']
    },
    {
        name: 'DM Sans',
        value: 'DM Sans',
        variable: '--font-dm-sans',
        category: 'sans-serif',
        weights: ['400', '500', '700']
    },
    {
        name: 'IBM Plex Sans',
        value: 'IBM Plex Sans',
        variable: '--font-ibm-plex-sans',
        category: 'sans-serif',
        weights: ['400', '500', '600', '700']
    },
    {
        name: 'Fira Sans',
        value: 'Fira Sans',
        variable: '--font-fira-sans',
        category: 'sans-serif',
        weights: ['400', '500', '600', '700']
    },
    {
        name: 'Crimson Text',
        value: 'Crimson Text',
        variable: '--font-crimson-text',
        category: 'serif',
        weights: ['400', '600', '700']
    },
] as const;

export type GoogleFont = typeof GOOGLE_FONTS[number];

/**
 * Get font CSS variable name from font name
 */
export function getFontVariable(fontName: string): string | null {
    const font = GOOGLE_FONTS.find(f => f.value.toLowerCase() === fontName.toLowerCase());
    return font?.variable || null;
}

/**
 * Get font display name with category
 */
export function getFontDisplayName(font: GoogleFont): string {
    return `${font.name} (${font.category})`;
}

/**
 * Check if a font name exists in Google Fonts list
 */
export function isGoogleFont(fontName: string): boolean {
    return GOOGLE_FONTS.some(font => font.value.toLowerCase() === fontName.toLowerCase());
}
