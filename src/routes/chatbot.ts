import type { Express } from 'express';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { HotelService } from '../services/hotelService.js';
import { PostService } from '../services/postService.js';

const hotelService = new HotelService();
const postService = new PostService();

// Initialize LLM for chatbot
function getChatbotLLM() {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
  const baseURL = process.env.OPENROUTER_API_KEY 
    ? 'https://openrouter.ai/api/v1'
    : undefined;
  
  if (!apiKey) {
    return null;
  }

  const llmConfig: any = {
    modelName: process.env.OPENROUTER_API_KEY 
      ? 'openai/gpt-4o-mini' 
      : 'gpt-4o-mini',
    temperature: 0.7,
    openAIApiKey: apiKey,
  };

  if (baseURL) {
    llmConfig.configuration = { baseURL };
  }

  return new ChatOpenAI(llmConfig);
}

export function registerChatbotRoutes(app: Express) {
  const llm = getChatbotLLM();

  // Enhanced chatbot endpoint
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, conversationId } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      let response: string;

      if (llm) {
        // Use LLM for intelligent responses
        response = await generateLLMResponse(message, llm);
      } else {
        // Fallback to rule-based responses
        response = await generateRuleBasedResponse(message);
      }

      res.json({ 
        response,
        conversationId: conversationId || Date.now().toString(),
      });
    } catch (error) {
      console.error('Chatbot error:', error);
      res.status(500).json({ 
        error: 'Failed to process chat message',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get hotel recommendations
  app.get('/api/chat/recommendations', async (req, res) => {
    try {
      const { location, limit = 5 } = req.query;
      
      const hotels = await hotelService.getAllHotels();
      
      let filteredHotels = hotels;
      if (location) {
        filteredHotels = hotels.filter(h => 
          h.location.toLowerCase().includes(String(location).toLowerCase())
        );
      }

      const recommendations = filteredHotels
        .slice(0, Number(limit))
        .map(h => ({
          id: h.id,
          name: h.name,
          location: h.location,
          rating: h.rating,
          price: h.price,
          description: h.description,
        }));

      res.json({ recommendations });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get recommendations' });
    }
  });
}

async function generateLLMResponse(message: string, llm: ChatOpenAI): Promise<string> {
  // Get context about available hotels
  const hotels = await hotelService.getAllHotels();
  const recentPosts = await postService.getAllPosts();
  
  const hotelContext = hotels.slice(0, 5).map(h => 
    `${h.name} in ${h.location}${h.rating ? ` (${h.rating}/5)` : ''}`
  ).join(', ');

  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `You are a helpful travel assistant chatbot. You help users find hotels and travel recommendations.
      
Available hotels: ${hotelContext || 'No hotels available yet'}

Be friendly, helpful, and provide specific recommendations when asked about hotels.`,
    ],
    ['human', '{message}'],
  ]);

  const chain = prompt.pipe(llm).pipe(new StringOutputParser());
  const response = await chain.invoke({ message });
  
  return response;
}

async function generateRuleBasedResponse(message: string): Promise<string> {
  const lowerMessage = message.toLowerCase();
  
  // Hotel recommendations
  if (lowerMessage.includes('hotel') || lowerMessage.includes('recommend') || lowerMessage.includes('stay')) {
    const hotels = await hotelService.getAllHotels();
    if (hotels.length > 0) {
      const randomHotel = hotels[Math.floor(Math.random() * hotels.length)];
      if (randomHotel) {
        let response = `I recommend ${randomHotel.name} in ${randomHotel.location}.`;
        if (randomHotel.rating) {
          response += ` It has a ${randomHotel.rating}/5 rating.`;
        }
        if (randomHotel.description) {
          response += ` ${randomHotel.description.substring(0, 100)}...`;
        }
        return response;
      }
    }
    return 'I don\'t have any hotel recommendations at the moment. Check back soon!';
  }
  
  // Location-based queries
  if (lowerMessage.includes('where') || lowerMessage.includes('location')) {
    const hotels = await hotelService.getAllHotels();
    const locations = [...new Set(hotels.map(h => h.location))];
    if (locations.length > 0) {
      return `I have hotels in: ${locations.join(', ')}. Which location interests you?`;
    }
    return 'I don\'t have location information yet.';
  }
  
  // Greetings
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return 'Hello! I\'m your travel assistant. I can help you find hotel recommendations. What are you looking for?';
  }
  
  // Help
  if (lowerMessage.includes('help') || lowerMessage.includes('what can you')) {
    return 'I can help you find hotel recommendations! Try asking me about hotels, locations, or travel destinations.';
  }
  
  // Default response
  return 'I\'m here to help with hotel recommendations. Try asking about hotels, locations, or travel destinations!';
}

