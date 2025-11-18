export declare class PostService {
    private contentAgent;
    private hotelService;
    constructor();
    createAndPublishPost(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        hotelId: string;
        title: string;
        content: string;
        imageUrl: string | null;
        published: boolean;
        publishedAt: Date | null;
    } | null>;
    getAllPosts(): Promise<({
        hotel: {
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
        };
        socialMediaPosts: {
            error: string | null;
            id: string;
            createdAt: Date;
            publishedAt: Date | null;
            status: string;
            platform: string;
            postUrl: string | null;
            postIdExternal: string | null;
            postId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        hotelId: string;
        title: string;
        content: string;
        imageUrl: string | null;
        published: boolean;
        publishedAt: Date | null;
    })[]>;
    getPostById(id: string): Promise<({
        hotel: {
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
        };
        socialMediaPosts: {
            error: string | null;
            id: string;
            createdAt: Date;
            publishedAt: Date | null;
            status: string;
            platform: string;
            postUrl: string | null;
            postIdExternal: string | null;
            postId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        hotelId: string;
        title: string;
        content: string;
        imageUrl: string | null;
        published: boolean;
        publishedAt: Date | null;
    }) | null>;
}
//# sourceMappingURL=postService.d.ts.map