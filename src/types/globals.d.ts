declare global {
  /** A live post in lists (`GET /public/blogs`): everything but the body. */
  interface BlogSummary {
    id: string;
    title: string | null;
    slug: string | null;
    category: string | null;
    featuredImage: { url?: string | null; altText?: string | null } | null;
    author: {
      id?: string | null;
      name?: string | null;
      avatar?: string | null;
      url?: string | null;
      bio?: string | null;
    } | null;
    publishDate: string | null;
    /** Pinned in admin: the lead post on /blog. */
    featured: boolean;
    metaDescription: string | null;
    tags: string[];
    readTime: number | null;
    wordCount: number | null;
    createdAt: string | null;
    updatedAt: string | null;
    // Optional SEO fields: absent on an API that predates them.
    noindex?: boolean;
    searchDescription?: string | null;
    socialImage?: { url: string; altText: string } | null;
    callToAction?: Array<{ heading: string; text?: string | null; label: string; href: string }>;
  }

  /** One live post (`GET /public/blogs/:slug`), with its body. */
  interface BlogPost extends BlogSummary {
    body: string | null;
    metaTitle: string | null;
    canonicalUrl: string | null;
    metaKeywords: string[];
    views: number;
    likes: number;
  }
}

export {};
