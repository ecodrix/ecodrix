import { HeroMotif, MkSection } from "@/components/marketing/kit";
import { BlogIndex } from "@/components/resources/blog/BlogIndex";
import { SubscribeCard } from "@/components/resources/blog/SubscribeForm";

export function BlogPage({ posts }: { posts: BlogSummary[] }) {
  return (
    <div className="w-full">
      {/* The site's navy hero, kept short: a blog visitor came for the posts right under it. */}
      <section className="band-navy relative py-[clamp(40px,6vw,64px)]" aria-labelledby="blog-title">
        <HeroMotif />
        <div className="relative mx-auto grid w-full max-w-wrap items-center gap-[clamp(28px,5vw,64px)] px-gutter min-[900px]:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)]">
          <div className="min-w-0">
            <h1 id="blog-title" className="font-display text-mk-hero text-balance text-white">
              The ERIX blog
            </h1>
            <p className="mt-[22px] max-w-[34em] font-sans text-mk-hero-lead text-pretty text-white/80">
              Practical notes on WhatsApp selling, pipelines, GST invoicing and automation for Indian businesses.
            </p>
          </div>
          {/* surface-light: the form keeps its normal light colours inside the navy band. */}
          <div
            id="subscribe"
            className="surface-light min-w-0 scroll-mt-24 rounded-[16px] bg-surface p-6 text-foreground sm:p-8 min-[900px]:justify-self-end min-[900px]:max-w-[520px]"
          >
            <SubscribeCard />
          </div>
        </div>
      </section>

      <MkSection id="posts" className="pt-8! md:pt-10!">
        <BlogIndex posts={posts} />
      </MkSection>
    </div>
  );
}
