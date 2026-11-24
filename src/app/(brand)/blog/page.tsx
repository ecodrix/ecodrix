// blog/page.tsx

import { BlogPage } from "@/components/resources/blog/blogPage";
import { blogs } from "@/lib/api";
import { pageMetadata } from "@/lib/seo/seo";

// Cached and refreshed every 60 s, like each post (a newly published post shows within a minute).
// The API call times out after 5 s, so a build never hangs on it.
export const revalidate = 60;

export const metadata = pageMetadata({
  title: "ERIX blog: WhatsApp, CRM and automation tips",
  description:
    "Practical notes on selling over WhatsApp, running a pipeline, GST invoicing and automation for Indian SMBs, from the team building ERIX at ECODrIx.",
  path: "/blog",
});

export default async function BlogListPage() {
  return <BlogPage posts={await blogs.fetchPublishedPosts()} />;
}
