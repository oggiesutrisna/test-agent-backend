import { prisma } from '../db/client.js';
import axios from 'axios';
export class SocialMediaService {
    async postToTwitter(postId, postData) {
        try {
            // Twitter API v2 implementation
            const twitterBearerToken = process.env.TWITTER_BEARER_TOKEN;
            const twitterApiKey = process.env.TWITTER_API_KEY;
            const twitterApiSecret = process.env.TWITTER_API_SECRET;
            const twitterAccessToken = process.env.TWITTER_ACCESS_TOKEN;
            const twitterAccessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;
            if (!twitterBearerToken && !twitterApiKey) {
                console.error('Twitter credentials not configured. Please set TWITTER_BEARER_TOKEN or TWITTER_API_KEY in .env');
                return null;
            }
            const text = this.formatTwitterPost(postData);
            const tweetUrl = await this.createTweet(text, postData.imageUrl ?? undefined);
            await prisma.socialMediaPost.create({
                data: {
                    postId,
                    platform: 'twitter',
                    postUrl: tweetUrl,
                    status: 'published',
                    publishedAt: new Date(),
                },
            });
            return tweetUrl;
        }
        catch (error) {
            console.error('Failed to post to Twitter:', error);
            // Save error to database
            await prisma.socialMediaPost.create({
                data: {
                    postId,
                    platform: 'twitter',
                    status: 'failed',
                    error: error instanceof Error ? error.message : 'Unknown error',
                },
            });
            return null;
        }
    }
    async postToLinkedIn(postId, postData) {
        try {
            const linkedInAccessToken = process.env.LINKEDIN_ACCESS_TOKEN;
            const linkedInPersonUrn = process.env.LINKEDIN_PERSON_URN;
            if (!linkedInAccessToken || !linkedInPersonUrn) {
                console.error('LinkedIn credentials not configured');
                return null;
            }
            // Format LinkedIn post
            const text = this.formatLinkedInPost(postData);
            // Create LinkedIn post using API
            const imageUrl = postData.imageUrl && typeof postData.imageUrl === 'string' ? postData.imageUrl : undefined;
            const postUrl = await this.createLinkedInPost(text, imageUrl, linkedInAccessToken, linkedInPersonUrn);
            // Save to database
            await prisma.socialMediaPost.create({
                data: {
                    postId,
                    platform: 'linkedin',
                    postUrl: postUrl,
                    status: 'published',
                    publishedAt: new Date(),
                },
            });
            return postUrl;
        }
        catch (error) {
            console.error('Failed to post to LinkedIn:', error);
            // Save error to database
            await prisma.socialMediaPost.create({
                data: {
                    postId,
                    platform: 'linkedin',
                    status: 'failed',
                    error: error instanceof Error ? error.message : 'Unknown error',
                },
            });
            return null;
        }
    }
    formatTwitterPost(postData) {
        // Twitter has 280 character limit
        const maxLength = 280;
        let text = `${postData.title}\n\n${postData.content}`;
        // Add hashtags
        text += '\n\n#Travel #Hotels #Vacation';
        if (text.length > maxLength) {
            text = text.substring(0, maxLength - 3) + '...';
        }
        return text;
    }
    formatLinkedInPost(postData) {
        // LinkedIn allows longer posts
        return `${postData.title}\n\n${postData.content}\n\n#Travel #Hotels #Hospitality`;
    }
    async createTweet(text, imageUrl) {
        // Simplified - in production, use Twitter API v2
        // This is a placeholder - you'll need to implement actual Twitter API calls
        console.log('Posting to Twitter:', text);
        // Example using Twitter API v2 (you'll need to set up OAuth properly)
        // For now, return a placeholder URL
        return `https://twitter.com/user/status/placeholder`;
    }
    async createLinkedInPost(text, imageUrl, accessToken, personUrn) {
        try {
            // LinkedIn API v2 implementation
            const apiUrl = 'https://api.linkedin.com/v2/ugcPosts';
            const postData = {
                author: personUrn,
                lifecycleState: 'PUBLISHED',
                specificContent: {
                    'com.linkedin.ugc.ShareContent': {
                        shareCommentary: {
                            text: text,
                        },
                        shareMediaCategory: imageUrl ? 'IMAGE' : 'NONE',
                    },
                },
                visibility: {
                    'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
                },
            };
            if (imageUrl && typeof imageUrl === 'string') {
                // First, upload image and get URN
                const imageUrn = await this.uploadLinkedInImage(imageUrl, accessToken);
                postData.specificContent['com.linkedin.ugc.ShareContent'].media = [
                    {
                        status: 'READY',
                        media: imageUrn,
                    },
                ];
            }
            const response = await axios.post(apiUrl, postData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'X-Restli-Protocol-Version': '2.0.0',
                },
            });
            // Extract post URL from response
            const postId = response.data.id;
            return `https://www.linkedin.com/feed/update/${postId}`;
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(`LinkedIn API error: ${error.response?.data?.message || error.message}`);
            }
            throw error;
        }
    }
    async uploadLinkedInImage(imageUrl, accessToken) {
        // Download image
        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(imageResponse.data);
        // Step 1: Register upload
        const registerResponse = await axios.post('https://api.linkedin.com/v2/assets?action=registerUpload', {
            registerUploadRequest: {
                recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
                owner: process.env.LINKEDIN_PERSON_URN,
                serviceRelationships: [
                    {
                        relationshipType: 'OWNER',
                        identifier: 'urn:li:userGeneratedContent',
                    },
                ],
            },
        }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        const uploadUrl = registerResponse.data.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
        const assetUrn = registerResponse.data.value.asset;
        // Step 2: Upload image
        await axios.put(uploadUrl, imageBuffer, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'image/jpeg',
            },
        });
        return assetUrn;
    }
    async publishToAllPlatforms(postId, postData) {
        const results = await Promise.allSettled([
            this.postToTwitter(postId, postData),
            this.postToLinkedIn(postId, postData),
        ]);
        return {
            twitter: results[0].status === 'fulfilled' ? results[0].value : null,
            linkedin: results[1].status === 'fulfilled' ? results[1].value : null,
        };
    }
}
//# sourceMappingURL=socialMediaService.js.map