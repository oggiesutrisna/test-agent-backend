import type { Express } from 'express';
import { z } from 'zod';
import { PostService } from '../services/postService.js';
import { HotelService } from '../services/hotelService.js';
import { SocialMediaService } from '../services/socialMediaService.js';

const postService = new PostService();
const hotelService = new HotelService();
const socialMediaService = new SocialMediaService();

export function registerPostRoutes(app: Express) {
  // Get all posts
  app.get('/api/posts', async (req, res) => {
    try {
      const posts = await postService.getAllPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  });

  // Get single post
  app.get('/api/posts/:id', async (req, res) => {
    try {
      const post = await postService.getPostById(req.params.id);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch post' });
    }
  });

  // Create and publish a post manually
  app.post('/api/posts/create', async (req, res) => {
    try {
      const post = await postService.createAndPublishPost();
      if (!post) {
        return res.status(404).json({ error: 'No available hotels to create post from' });
      }

      // Share to social media
      const postData: any = {
        title: post.title,
        content: post.content,
      };
      if (post.imageUrl) {
        postData.imageUrl = post.imageUrl;
      }
      const socialMediaResults = await socialMediaService.publishToAllPlatforms(post.id, postData);

      // Get updated post with social media links
      const updatedPost = await postService.getPostById(post.id);

      // Format response with social media links
      const response: any = {
        ...updatedPost,
        socialMediaLinks: {
          twitter: socialMediaResults.twitter,
          linkedin: socialMediaResults.linkedin,
        },
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create post' });
    }
  });

  // Scrape a hotel
  app.post('/api/hotels/scrape', async (req, res) => {
    try {
      const bodySchema = z.object({ url: z.string().url() });
      const parseResult = bodySchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: 'Invalid request body', details: parseResult.error.flatten() });
      }
      const { url } = parseResult.data;

      const hotel = await hotelService.scrapeAndSaveHotel(url);
      res.json(hotel);
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to scrape hotel',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get all hotels
  app.get('/api/hotels', async (req, res) => {
    try {
      const hotels = await hotelService.getAllHotels();
      res.json(hotels);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch hotels' });
    }
  });

  // Get social media links for a post
  app.get('/api/posts/:id/social-media', async (req, res) => {
    try {
      const post = await postService.getPostById(req.params.id);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      // Format social media links
      const socialMediaLinks: any = {
        twitter: null,
        linkedin: null,
      };

      if (post.socialMediaPosts && post.socialMediaPosts.length > 0) {
        post.socialMediaPosts.forEach((smPost: any) => {
          if (smPost.platform === 'twitter' && smPost.postUrl) {
            socialMediaLinks.twitter = smPost.postUrl;
          } else if (smPost.platform === 'linkedin' && smPost.postUrl) {
            socialMediaLinks.linkedin = smPost.postUrl;
          }
        });
      }

      res.json({
        postId: post.id,
        postTitle: post.title,
        socialMediaLinks,
        socialMediaPosts: post.socialMediaPosts,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch social media links' });
    }
  });
}

