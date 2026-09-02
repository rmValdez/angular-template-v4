import { z } from 'zod';

export const PostItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  author: z.string(),
  tags: z.array(z.string()),
  createdAt: z.string()
});

export type PostItem = z.infer<typeof PostItemSchema>;

export const PostListSchema = z.array(PostItemSchema);
