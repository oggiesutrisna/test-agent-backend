import { prisma } from '../db/client.js';
import { ContentAgent } from '../agent/contentAgent.js';
import { HotelService } from './hotelService.js';
export class PostService {
    contentAgent;
    hotelService;
    constructor() {
        this.contentAgent = new ContentAgent();
        this.hotelService = new HotelService();
    }
    async createAndPublishPost() {
        try {
            // Get a random unused hotel
            const hotel = await this.hotelService.getRandomUnusedHotel();
            if (!hotel) {
                console.log('No unused hotels available');
                return null;
            }
            // Generate content
            const hotelData = {
                name: hotel.name || 'Unknown Hotel',
                location: hotel.location || 'Unknown Location',
                price: hotel.price ?? undefined,
                rating: hotel.rating ?? undefined,
                amenities: Array.isArray(hotel.amenities) ? hotel.amenities : [],
                images: Array.isArray(hotel.images) ? hotel.images : [],
                sourceUrl: hotel.sourceUrl || '',
            };
            if (hotel.description) {
                hotelData.description = hotel.description;
            }
            const generatedContent = await this.contentAgent.generateContent(hotelData);
            // Create post
            const post = await prisma.post.create({
                data: {
                    hotelId: hotel.id,
                    title: generatedContent.title,
                    content: generatedContent.content,
                    imageUrl: generatedContent.imageUrl ?? null,
                    published: true,
                    publishedAt: new Date(),
                },
            });
            console.log(`Created post: ${post.title}`);
            return post;
        }
        catch (error) {
            console.error('Failed to create post:', error);
            throw error;
        }
    }
    async getAllPosts() {
        return prisma.post.findMany({
            orderBy: {
                publishedAt: 'desc',
            },
            include: {
                hotel: true,
                socialMediaPosts: true,
            },
        });
    }
    async getPostById(id) {
        return prisma.post.findUnique({
            where: { id },
            include: {
                hotel: true,
                socialMediaPosts: true,
            },
        });
    }
}
//# sourceMappingURL=postService.js.map