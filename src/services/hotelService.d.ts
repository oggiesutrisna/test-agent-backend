export declare class HotelService {
    private scraper;
    constructor();
    scrapeAndSaveHotel(url: string): Promise<{
        name: string;
        id: string;
        location: string;
        description: string | null;
        price: number | null;
        rating: number | null;
        amenities: string[];
        images: string[];
        sourceUrl: string;
        scrapedAt: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getRandomUnusedHotel(): Promise<{
        name: string;
        id: string;
        location: string;
        description: string | null;
        price: number | null;
        rating: number | null;
        amenities: string[];
        images: string[];
        sourceUrl: string;
        scrapedAt: Date;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    getAllHotels(): Promise<({
        posts: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            hotelId: string;
            title: string;
            content: string;
            imageUrl: string | null;
            published: boolean;
            publishedAt: Date | null;
        }[];
    } & {
        name: string;
        id: string;
        location: string;
        description: string | null;
        price: number | null;
        rating: number | null;
        amenities: string[];
        images: string[];
        sourceUrl: string;
        scrapedAt: Date;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
}
//# sourceMappingURL=hotelService.d.ts.map