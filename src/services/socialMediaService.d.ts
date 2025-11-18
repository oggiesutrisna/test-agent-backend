export interface PostData {
    title: string;
    content: string;
    imageUrl?: string | null;
}
export declare class SocialMediaService {
    postToTwitter(postId: string, postData: PostData): Promise<string | null>;
    postToLinkedIn(postId: string, postData: PostData): Promise<string | null>;
    private formatTwitterPost;
    private formatLinkedInPost;
    private createTweet;
    private createLinkedInPost;
    private uploadLinkedInImage;
    publishToAllPlatforms(postId: string, postData: PostData): Promise<{
        twitter: string | null;
        linkedin: string | null;
    }>;
}
//# sourceMappingURL=socialMediaService.d.ts.map