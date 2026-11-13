import { PostCard } from "@/components/blog/blogPage";
import { MkSection } from "@/components/marketing/kit";
import { blogs } from "@/lib/api";
import { pageMetadata } from "@/lib/seo";

// Same 60 s refresh as the blog: a post the founder publishes shows within a minute.
export const revalidate = 60;

export const metadata = pageMetadata({
  title: "What's new in ERIX",
  description: "What each ERIX version adds, newest first.",
  path: "/whats-new",
});

const time = (p: BlogSummary) => (p.publishDate ? Date.parse(p.publishDate) : 0);

export default async function WhatsNewPage() {
  const posts = (await blogs.fetchPublishedPosts())
    .filter((p) => p.tags?.includes("whats-new"))
    .sort((a, b) => time(b) - time(a));
  return (
    <div className="w-full">
      <section data-tone="subtle" className="py-section bg-background pt-12! pb-14! md:pt-16!">
        <div className="mx-auto w-full max-w-wrap px-gutter">
          <h1 className="text-[clamp(38px,5.4vw,60px)] leading-[1.04] tracking-[-0.035em]">What's new in ERIX</h1>
          <p className="mt-5 max-w-[56ch] text-[clamp(16px,1.5vw,19px)] leading-relaxed text-muted-foreground">
            What each version adds, newest first.
          </p>
        </div>
      </section>
      <MkSection id="posts">
        {posts.length === 0 ? (
          <p className="mx-auto max-w-xl text-center text-muted-foreground">
            No release posts yet. They appear here when a version goes live.
          </p>
        ) : (
          <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post.id}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        )}
      </MkSection>
    </div>
  );
}
