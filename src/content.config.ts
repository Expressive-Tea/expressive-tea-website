import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Release press, written as the organization. The personal essays — first person, a byline,
// the story of building the thing — live on the project sites, and green-tea-site already
// holds Green Tea's. That split is the reason this schema has no `author` field: a post that
// wants a name on it is a post that belongs on the other blog.
const blog = defineCollection({
  // The leading-underscore exclusion is what makes drafts-in-progress cheap: a file named
  // _next-release.md is simply not a post yet.
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    // Which product the post is about, so a reader can tell before clicking. `organization`
    // is for posts that are about neither framework in particular.
    subject: z.enum(['green-tea', 'expressive-tea', 'organization']),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
