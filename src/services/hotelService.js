import { prisma } from '../db/client.js';
import { FirecrawlScraper } from '../scrappers/firecrawl.js';
export class HotelService {
    scraper;
    constructor() {
        this.scraper = new FirecrawlScraper();
    }
    async scrapeAndSaveHotel(url) {
        try {
            // Check if hotel already exists
            const existing = await prisma.hotel.findFirst({
                where: { sourceUrl: url },
            });
            if (existing) {
                console.log(`Hotel already exists: ${existing.name}`);
                return existing;
            }
            // Scrape hotel data
            const hotelData = await this.scraper.scrapeHotel(url);
            // Save to database
            const hotel = await prisma.hotel.create({
                data: {
                    name: hotelData.name,
                    location: hotelData.location,
                    description: hotelData.description ?? null,
                    price: hotelData.price ?? null,
                    rating: hotelData.rating ?? null,
                    amenities: hotelData.amenities,
                    images: hotelData.images,
                    sourceUrl: hotelData.sourceUrl,
                },
            });
            console.log(`Scraped and saved hotel: ${hotel.name}`);
            return hotel;
        }
        catch (error) {
            console.error(`Failed to scrape hotel from ${url}:`, error);
            throw error;
        }
    }
    async getRandomUnusedHotel() {
        // Get a hotel that hasn't been used for a post yet
        const hotel = await prisma.hotel.findFirst({
            where: {
                posts: {
                    none: {},
                },
            },
            orderBy: {
                scrapedAt: 'desc',
            },
        });
        return hotel;
    }
    async getAllHotels() {
        return prisma.hotel.findMany({
            orderBy: {
                scrapedAt: 'desc',
            },
            include: {
                posts: true,
            },
        });
    }
}
//# sourceMappingURL=hotelService.js.map