import { MkSection } from "@/components/marketing/kit";
import { BlogIndex } from "@/components/resources/blog/BlogIndex";
import { SubscribeCard } from "@/components/resources/blog/SubscribeForm";

export function BlogPage({ posts }: { posts: BlogSummary[] }) {
  return (
    <div className="w-full">
      <section data-tone="subtle" className="py-section bg-background pt-12! pb-10! md:pt-16! md:pb-12!">
        <div className="mx-auto w-full max-w-wrap px-gutter">
          <h1 className="text-[clamp(38px,5.4vw,60px)] leading-[1.04] tracking-[-0.035em]">The ERIX blog</h1>
          <p className="mt-4 max-w-[56ch] text-[clamp(16px,1.5vw,19px)] leading-relaxed text-muted-foreground">
            Practical notes on WhatsApp selling, pipelines, GST invoicing and automation for Indian businesses.
          </p>
        </div>
      </section>

      <MkSection id="posts" className="pt-8! md:pt-10!">
        <BlogIndex posts={posts} />
      </MkSection>

      <MkSection id="subscribe" tone="subtle">
        <div className="mx-auto max-w-xl rounded-[16px] bg-surface p-6 shadow-card sm:p-8">
          <SubscribeCard />
        </div>
      </MkSection>
    </div>
  );
}
