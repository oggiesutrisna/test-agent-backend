import type { HotelData } from '../scrappers/firecrawl.js';
interface GeneratedContent {
    title: string;
    content: string;
    imageUrl?: string;
}
export declare class ContentAgent {
    private llm;
    private openRouterApiKey;
    private imageApiKey;
    constructor();
    generateContent(hotel: HotelData): Promise<GeneratedContent>;
    private generateText;
    private generateImage;
    private generateImageDalle;
    private generateImageOpenRouter;
}
export {};
//# sourceMappingURL=contentAgent.d.ts.map