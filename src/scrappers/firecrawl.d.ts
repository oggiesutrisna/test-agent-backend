interface FirecrawlResponse {
    success: boolean;
    data?: {
        markdown?: string;
        html?: string;
        metadata?: {
            title?: string;
            description?: string;
            image?: string;
        };
    };
    error?: string;
}
export interface HotelData {
    name: string;
    location: string;
    description?: string;
    price?: number;
    rating?: number;
    amenities: string[];
    images: string[];
    sourceUrl: string;
}
export declare class FirecrawlScraper {
    private apiKey;
    private baseUrl;
    constructor(apiKey?: string);
    scrapeUrl(url: string): Promise<FirecrawlResponse>;
    scrapeHotel(url: string): Promise<HotelData>;
    private extractHotelName;
    private extractLocation;
    private extractDescription;
    private extractPrice;
    private extractRating;
    private extractAmenities;
    private extractImages;
    scrapeMultipleHotels(urls: string[]): Promise<HotelData[]>;
}
export {};
//# sourceMappingURL=firecrawl.d.ts.map