import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { categoryLabel, fmtDate } from "@/lib/resources/blog";
import { cn } from "@/lib/utils";

function Cover({ post, sizes, priority }: { post: BlogSummary; sizes: string; priority?: boolean }) {
  // Fixed 16:9 box: the cover (or the designed fallback) never shifts the layout.
  return (
    <div className="relative aspect-video overflow-hidden rounded-[12px] bg-accent-muted">
      {post.featuredImage?.url ? (
        <Image
          src={post.featuredImage.url}
          alt={post.featuredImage.altText || post.title || ""}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover motion-safe:transition-[scale] motion-safe:duration-500 motion-safe:group-hover:scale-[1.02]"
        />
      ) : (
        <div aria-hidden="true" className="absolute inset-0 flex items-end justify-between p-5 text-accent">
          <span className="font-display text-[clamp(36px,6vw,64px)] leading-none font-bold tracking-[-0.04em] opacity-80">
            {post.category ? categoryLabel(post.category) : "ERIX"}
          </span>
          <Icon name="file-text" size={28} variant="duo" />
        </div>
      )}
    </div>
  );
}

export function Chip({ children }: { children: string }) {
  return (
    <span className="w-fit rounded-full bg-accent-muted px-2.5 py-0.5 text-[12px] font-semibold text-accent">
      {children}
    </span>
  );
}

export function Meta({ post }: { post: BlogSummary }) {
  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-muted-foreground">
      {post.publishDate && <time dateTime={post.publishDate}>{fmtDate(post.publishDate)}</time>}
      {post.publishDate && post.readTime ? <span aria-hidden="true">·</span> : null}
      {post.readTime ? <span>{post.readTime} min read</span> : null}
    </p>
  );
}

/** Uniform grid card. The whole card is one link (the title's ::after covers it). */
export function PostCard({ post }: { post: BlogSummary }) {
  return (
    <article className="group relative flex h-full flex-col">
      <Cover post={post} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px" />
      <div className="flex flex-1 flex-col pt-4">
        {post.category && <Chip>{categoryLabel(post.category)}</Chip>}
        <h3 className="mt-3 line-clamp-2 font-display text-[20px] leading-snug font-semibold tracking-[-0.015em] text-balance text-foreground">
          <Link
            href={`/blog/${post.slug}`}
            className="after:absolute after:inset-0 after:rounded-[16px] group-hover:text-accent focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-accent"
          >
            {post.title}
          </Link>
        </h3>
        {post.metaDescription && (
          <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-muted-foreground">{post.metaDescription}</p>
        )}
        <div className="mt-auto pt-4">
          <Meta post={post} />
        </div>
      </div>
    </article>
  );
}

/** The large lead post: cover beside the text on wide screens. */
export function FeaturedPost({ post }: { post: BlogSummary }) {
  return (
    <article
      className={cn(
        "group relative grid gap-6 rounded-[16px] bg-background p-4 shadow-card hover:bg-hover focus-within:bg-hover",
        "md:p-6 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-10",
      )}
    >
      <Cover post={post} priority sizes="(max-width: 1024px) 100vw, 640px" />
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <Chip>Featured</Chip>
          {post.category && <span className="text-[13px] text-muted-foreground">{categoryLabel(post.category)}</span>}
        </div>
        <h2 className="mt-4 font-display text-[clamp(26px,3vw,38px)] leading-[1.12] font-bold tracking-[-0.025em] text-balance text-foreground">
          <Link
            href={`/blog/${post.slug}`}
            className="after:absolute after:inset-0 after:rounded-[16px] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-accent"
          >
            {post.title}
          </Link>
        </h2>
        {post.metaDescription && (
          <p className="mt-4 line-clamp-4 text-[17px] leading-relaxed text-muted-foreground">{post.metaDescription}</p>
        )}
        <div className="mt-5">
          <Meta post={post} />
        </div>
        <span className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-[650] text-accent">
          Read the post
          <Icon name="arrow-right" size={14} variant="line" />
        </span>
      </div>
    </article>
  );
}
