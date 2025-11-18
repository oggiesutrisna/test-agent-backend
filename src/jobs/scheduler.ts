import cron from 'node-cron';
import { PostService } from '../services/postService.js';
import { SocialMediaService } from '../services/socialMediaService.js';

const postService = new PostService();
const socialMediaService = new SocialMediaService();

async function publishAndShare() {
  console.log('Starting scheduled publish and share job...');
  
  try {
    // Create and publish a new post
    const post = await postService.createAndPublishPost();
    
    if (!post) {
      console.log('No post created, skipping social media sharing');
      return;
    }
    
    const postData: any = {
      title: post.title,
      content: post.content,
    };
    if (post.imageUrl) {
      postData.imageUrl = post.imageUrl;
    }
    await socialMediaService.publishToAllPlatforms(post.id, postData);

    console.log(`Successfully published and shared post: ${post.id}`);
  } catch (error) {
    console.error('Error in scheduled job:', error);
  }
}

// Run every 2 hours: '0 */2 * * *'
// For testing, you can use: '*/5 * * * *' (every 5 minutes)
const cronExpression = process.env.CRON_SCHEDULE || '0 */2 * * *';

console.log(`Scheduler initialized. Will run every 2 hours (cron: ${cronExpression})`);

// Run immediately on startup (optional, for testing)
if (process.env.RUN_ON_STARTUP === 'true') {
  console.log('Running initial job on startup...');
  publishAndShare();
}

// Schedule the job
cron.schedule(cronExpression, publishAndShare);

export { publishAndShare };

