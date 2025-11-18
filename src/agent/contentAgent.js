import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import axios from 'axios';
export class ContentAgent {
    llm;
    openRouterApiKey;
    imageApiKey;
    constructor() {
        // Use OpenRouter or OpenAI
        const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
        const baseURL = process.env.OPENROUTER_API_KEY
            ? 'https://openrouter.ai/api/v1'
            : undefined;
        if (!apiKey) {
            throw new Error('OPENAI_API_KEY or OPENROUTER_API_KEY is required');
        }
        const llmConfig = {
            modelName: process.env.OPENROUTER_API_KEY
                ? 'openai/gpt-4o'
                : 'gpt-4o',
            temperature: 0.7,
            openAIApiKey: apiKey,
        };
        if (baseURL) {
            llmConfig.configuration = { baseURL };
        }
        this.llm = new ChatOpenAI(llmConfig);
        this.openRouterApiKey = process.env.OPENROUTER_API_KEY ?? undefined;
        this.imageApiKey = (process.env.IMAGE_API_KEY || process.env.OPENAI_API_KEY) ?? undefined;
    }
    async generateContent(hotel) {
        // Generate text content
        const textContent = await this.generateText(hotel);
        // Generate image
        const imageUrl = await this.generateImage(hotel);
        return {
            ...textContent,
            ...(imageUrl ? { imageUrl } : {}),
        };
    }
    async generateText(hotel) {
        const prompt = ChatPromptTemplate.fromMessages([
            [
                'system',
                `You are a travel content creator specializing in hotel reviews and recommendations. 
        Create engaging, informative content about hotels that would appeal to travelers.
        Be authentic, highlight unique features, and provide helpful insights.`,
            ],
            [
                'human',
                `Create a social media post about this hotel:

Hotel Name: {name}
Location: {location}
Description: {description}
Price: {price}
Rating: {rating}
Amenities: {amenities}

Generate:
1. A catchy title (max 100 characters)
2. Engaging content (200-300 words) that highlights the hotel's best features, location benefits, and why travelers should consider staying here.

Format the response as JSON:
{
  "title": "...",
  "content": "..."
}`,
            ],
        ]);
        const chain = prompt.pipe(this.llm).pipe(new StringOutputParser());
        // Ensure all values are strings (LangChain requires this)
        const promptValues = {
            name: String(hotel.name || 'Unknown Hotel'),
            location: String(hotel.location || 'Unknown Location'),
            description: String(hotel.description || 'No description available'),
            price: hotel.price ? String(`$${hotel.price}`) : 'Price not available',
            rating: hotel.rating ? String(`${hotel.rating}/5`) : 'Rating not available',
            amenities: Array.isArray(hotel.amenities) && hotel.amenities.length > 0
                ? String(hotel.amenities.join(', '))
                : 'Standard amenities',
        };
        const response = await chain.invoke(promptValues);
        // Parse JSON response
        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return {
                    title: parsed.title || `${hotel.name} - ${hotel.location}`,
                    content: parsed.content || response,
                };
            }
        }
        catch (error) {
            console.error('Failed to parse LLM response as JSON:', error);
        }
        // Fallback if JSON parsing fails
        const lines = response.split('\n').filter(l => l.trim());
        return {
            title: lines[0]?.replace(/^#+\s*/, '').substring(0, 100) || `${hotel.name} - ${hotel.location}`,
            content: lines.slice(1).join('\n') || response,
        };
    }
    async generateImage(hotel) {
        try {
            // Option 1: Use OpenAI DALL-E
            if (this.imageApiKey && !this.openRouterApiKey) {
                return await this.generateImageDalle(hotel);
            }
            // Option 2: Use OpenRouter image generation
            if (this.openRouterApiKey) {
                return await this.generateImageOpenRouter(hotel);
            }
            // Option 3: Use first scraped image as fallback
            if (Array.isArray(hotel.images) && hotel.images.length > 0) {
                return hotel.images[0];
            }
            return undefined;
        }
        catch (error) {
            console.error('Failed to generate image:', error);
            // Fallback to scraped image
            if (Array.isArray(hotel.images) && hotel.images.length > 0) {
                return hotel.images[0];
            }
            return undefined;
        }
    }
    async generateImageDalle(hotel) {
        try {
            const prompt = `A beautiful, professional photo of ${hotel.name} hotel in ${hotel.location}. 
        High-quality travel photography, inviting atmosphere, showcasing the hotel's best features.`;
            const response = await axios.post('https://api.openai.com/v1/images/generations', {
                model: 'dall-e-3',
                prompt: prompt.substring(0, 1000), // DALL-E has prompt length limits
                n: 1,
                size: '1024x1024',
            }, {
                headers: {
                    'Authorization': `Bearer ${this.imageApiKey}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data.data[0]?.url;
        }
        catch (error) {
            console.error('DALL-E image generation failed:', error);
            return undefined;
        }
    }
    async generateImageOpenRouter(hotel) {
        try {
            // OpenRouter supports various image models
            // Using a generic approach - you may need to adjust based on available models
            const prompt = `A beautiful photo of ${hotel.name} hotel in ${hotel.location}`;
            const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
                model: 'black-forest-labs/flux-pro',
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
            }, {
                headers: {
                    'Authorization': `Bearer ${this.openRouterApiKey}`,
                    'Content-Type': 'application/json',
                },
            });
            // Adjust based on actual OpenRouter image generation API response
            return response.data?.data?.[0]?.url || (Array.isArray(hotel.images) && hotel.images.length > 0 ? hotel.images[0] : undefined);
        }
        catch (error) {
            console.error('OpenRouter image generation failed:', error);
            return Array.isArray(hotel.images) && hotel.images.length > 0 ? hotel.images[0] : undefined;
        }
    }
}
//# sourceMappingURL=contentAgent.js.map