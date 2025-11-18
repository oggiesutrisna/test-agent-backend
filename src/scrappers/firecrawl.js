import axios from 'axios';
export class FirecrawlScraper {
    apiKey;
    baseUrl = 'https://api.firecrawl.dev/v1';
    constructor(apiKey) {
        this.apiKey = apiKey || process.env.FIRECRAWL_API_KEY || '';
        if (!this.apiKey) {
            throw new Error('FIRECRAWL_API_KEY is required');
        }
    }
    async scrapeUrl(url) {
        try {
            const response = await axios.post(`${this.baseUrl}/scrape`, { url }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(`Firecrawl API error: ${error.response?.data?.error || error.message}`);
            }
            throw error;
        }
    }
    async scrapeHotel(url) {
        const result = await this.scrapeUrl(url);
        if (!result.success || !result.data) {
            throw new Error(result.error || 'Failed to scrape hotel data');
        }
        const { markdown, html, metadata } = result.data;
        // Parse hotel data from the scraped content
        // This is a simplified parser - you may need to enhance based on actual Expedia structure
        const description = metadata?.description || this.extractDescription(markdown || '');
        const price = this.extractPrice(markdown || '');
        const rating = this.extractRating(markdown || '');
        const hotelData = {
            name: metadata?.title || this.extractHotelName(markdown || ''),
            location: this.extractLocation(markdown || ''),
            ...(description ? { description } : {}),
            ...(price !== undefined ? { price } : {}),
            ...(rating !== undefined ? { rating } : {}),
            amenities: this.extractAmenities(markdown || ''),
            images: this.extractImages(html || '', metadata?.image),
            sourceUrl: url,
        };
        return hotelData;
    }
    extractHotelName(content) {
        // Try to extract hotel name from markdown
        const titleMatch = content.match(/^#\s+(.+)/m);
        if (titleMatch && titleMatch[1])
            return titleMatch[1].trim();
        const h1Match = content.match(/<h1[^>]*>(.+?)<\/h1>/i);
        if (h1Match && h1Match[1])
            return h1Match[1].trim();
        return 'Unknown Hotel';
    }
    extractLocation(content) {
        // Look for location patterns
        const locationPatterns = [
            /location[:\s]+([^,\n]+)/i,
            /address[:\s]+([^,\n]+)/i,
            /located in ([^,\n]+)/i,
        ];
        for (const pattern of locationPatterns) {
            const match = content.match(pattern);
            if (match && match[1])
                return match[1].trim();
        }
        return 'Location not specified';
    }
    extractDescription(content) {
        // Extract first paragraph or description
        const paragraphMatch = content.match(/<p[^>]*>(.+?)<\/p>/i);
        if (paragraphMatch && paragraphMatch[1]) {
            return paragraphMatch[1].replace(/<[^>]+>/g, '').trim().substring(0, 500);
        }
        // Fallback to first few sentences
        const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
        return sentences.slice(0, 3).join('. ').trim().substring(0, 500);
    }
    extractPrice(content) {
        // Look for price patterns like $123, €123, £123
        const priceMatch = content.match(/[\$€£]\s*(\d+(?:\.\d{2})?)/);
        if (priceMatch && priceMatch[1]) {
            return parseFloat(priceMatch[1]);
        }
        return undefined;
    }
    extractRating(content) {
        // Look for rating patterns like 4.5/5, 4.5 stars, etc.
        const ratingMatch = content.match(/(\d+\.?\d*)\s*(?:out of|\/|stars?)/i);
        if (ratingMatch && ratingMatch[1]) {
            return parseFloat(ratingMatch[1]);
        }
        return undefined;
    }
    extractAmenities(content) {
        const amenities = [];
        const amenityKeywords = [
            'wifi', 'pool', 'gym', 'spa', 'parking', 'restaurant', 'bar',
            'breakfast', 'air conditioning', 'room service', 'concierge'
        ];
        for (const keyword of amenityKeywords) {
            if (content.toLowerCase().includes(keyword)) {
                amenities.push(keyword);
            }
        }
        return amenities;
    }
    extractImages(html, metadataImage) {
        const images = [];
        if (metadataImage) {
            images.push(metadataImage);
        }
        // Extract image URLs from HTML
        const imgMatches = html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi);
        for (const match of imgMatches) {
            const url = match[1];
            if (url && typeof url === 'string' && !url.startsWith('data:') && !images.includes(url)) {
                images.push(url);
            }
        }
        return images.slice(0, 5); // Limit to 5 images
    }
    async scrapeMultipleHotels(urls) {
        const results = [];
        for (const url of urls) {
            try {
                const hotelData = await this.scrapeHotel(url);
                results.push(hotelData);
                // Add delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            catch (error) {
                console.error(`Failed to scrape ${url}:`, error);
            }
        }
        return results;
    }
}
//# sourceMappingURL=firecrawl.js.map