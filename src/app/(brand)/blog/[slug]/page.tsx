import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogContent, prepareArticle } from "@/components/blog/BlogContent";
import { PostCard } from "@/components/blog/blogPage";
import { SubscribeForm } from "@/components/blog/SubscribeForm";
import { Icon } from "@/components/icons";
import { MkSection } from "@/components/marketing/kit";
import { ClosingCta, Crumbs } from "@/components/platform/ModulePage";
import { blogs } from "@/lib/api";
import { SEO_CONSTANTS } from "@/lib/jsonld";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [];
}

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await blogs.fetchPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  const url = `${SEO_CONSTANTS.BASE_URL}/blog/${post.slug}`;
  // Posts live only on ecodrix.com now (services.ecodrix.com was shut down), so a
  // CMS canonical is honoured only when it points back to this site.
  const sameSite = (u: string) => {
    try {
      return new URL(u, url).host === new URL(url).host;
    } catch {
      return false; // a malformed CMS value falls back to this page's URL
    }
  };
  const canonical = post.canonicalUrl && sameSite(post.canonicalUrl) ? post.canonicalUrl : url;
  return {
    // The root template adds " | ECODrIx".
    title: post.metaTitle || post.title,
    description: post.metaDescription || undefined,
    keywords: post.metaKeywords?.length ? post.metaKeywords : undefined,
    alternates: { canonical },
    openGraph: {
      title: post.metaTitle || post.title || undefined,
      description: post.metaDescription || undefined,
      url,
      type: "article",
      publishedTime: post.publishDate || undefined,
      authors: post.author?.name ? [post.author.name] : undefined,
      images: post.featuredImage?.url
        ? [{ url: post.featuredImage.url, alt: post.featuredImage.altText || post.title || "" }]
        : ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle || post.title || undefined,
      description: post.metaDescription || undefined,
      images: post.featuredImage?.url ? [post.featuredImage.url] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await blogs.fetchPostBySlug(slug);
  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription,
    image: post.featuredImage?.url,
    datePublished: post.publishDate,
    dateModified: post.updatedAt || post.publishDate,
    author: { "@type": "Person", name: post.author?.name || "ECODrIx Team" },
    publisher: { "@type": "Organization", name: "ECODrIx", url: SEO_CONSTANTS.BASE_URL },
    mainEntityOfPage: `${SEO_CONSTANTS.BASE_URL}/blog/${post.slug}`,
    wordCount: post.wordCount,
    keywords: post.metaKeywords?.join(", "),
  };

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const article = prepareArticle(post.body || "");
  // Up to three other posts, newest first (the cached list, no bodies).
  const related = (await blogs.fetchPublishedPosts()).filter((p) => p.slug !== post.slug).slice(0, 3);
  const url = `${SEO_CONSTANTS.BASE_URL}/blog/${post.slug}`;
  const share = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${post.title} ${url}`)}`,
      icon: "whatsapp" as const,
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      icon: "share-2" as const,
    },
    {
      label: "Email",
      href: `mailto:?subject=${encodeURIComponent(post.title ?? "")}&body=${encodeURIComponent(url)}`,
      icon: "mail" as const,
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <article className="w-full">
        <header data-tone="subtle" className="py-section bg-background pt-10! pb-12! md:pt-14!">
          <div className="mx-auto w-full max-w-6xl">
            <Crumbs items={[{ name: "Blog", href: "/blog" }, { name: post.title ?? "Post" }]} />
            {post.category && (
              <p className="mt-6 w-fit rounded-sm bg-accent-muted px-2 py-0.5 text-[12px] font-semibold text-accent">
                {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
              </p>
            )}
            <h1 className="mt-4 max-w-4xl text-[clamp(32px,4.4vw,50px)] leading-[1.08] tracking-[-0.03em]">
              {post.title}
            </h1>
            {post.metaDescription && (
              <p className="mt-5 max-w-3xl text-[clamp(16px,1.4vw,18px)] leading-relaxed text-muted-foreground">
                {post.metaDescription}
              </p>
            )}
            <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] text-muted-foreground">
              {post.author?.name && (
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="grid size-7 place-items-center rounded-full bg-accent-muted text-[12px] font-bold text-accent"
                  >
                    {post.author.name.charAt(0)}
                  </span>
                  <span className="font-semibold text-foreground">{post.author.name}</span>
                </span>
              )}
              {post.publishDate && (
                <span className="flex items-center gap-1.5">
                  <Icon name="calendar" size={14} variant="line" />
                  <time dateTime={post.publishDate}>{fmt(post.publishDate)}</time>
                </span>
              )}
              {post.readTime && (
                <span className="flex items-center gap-1.5">
                  <Icon name="clock" size={14} variant="line" />
                  {post.readTime} min read
                </span>
              )}
              {post.views > 0 && (
                <span className="flex items-center gap-1.5">
                  <Icon name="eye" size={14} variant="line" />
                  {post.views.toLocaleString("en-IN")} views
                </span>
              )}
            </p>
          </div>
        </header>

        <div className="py-section pt-10! md:pt-14!">
          <div className="mx-auto w-full max-w-6xl">
            {post.featuredImage?.url && (
              <div className="relative mb-12 aspect-16/8 overflow-hidden rounded-[16px] shadow-card">
                <Image
                  src={post.featuredImage.url}
                  alt={post.featuredImage.altText || post.title || ""}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1200px) 100vw, 1152px"
                />
              </div>
            )}
            {/* The text keeps a readable line; the sidebar uses the rest of the width. */}
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem]">
              <div className="min-w-0 max-w-[72ch]">
                <BlogContent html={article.html} />

                {post.tags?.length > 0 && (
                  <div className="mt-12 border-t border-border-soft pt-6">
                    <h2 className="font-sans text-[14px] font-semibold tracking-normal text-foreground">Topics</h2>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-sm bg-background px-2 py-0.5 text-[13px] text-muted-foreground"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-8 flex flex-wrap items-center gap-2">
                  <span className="mr-1 text-[14px] font-semibold text-foreground">Share</span>
                  {share.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 items-center gap-2 rounded-md bg-background px-3 text-[14px] font-medium text-foreground hover:bg-hover"
                    >
                      <Icon name={s.icon} size={16} variant="line" />
                      {s.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ))}
                </div>

                {/* Phones and tablets: the sidebar's subscribe box comes here, after the article. */}
                <div className="mt-12 rounded-[16px] bg-background p-6 lg:hidden">
                  <h2 className="font-sans text-[17px] font-semibold tracking-normal">Get the next post by email</h2>
                  <p className="mt-1 text-[14px] text-muted-foreground">About twice a month. Nothing else.</p>
                  <SubscribeForm source="blog_post" className="mt-4" />
                </div>

                <p className="mt-12">
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-1.5 font-sans text-[15px]/5 font-[650] text-accent hover:underline hover:underline-offset-3 motion-safe:focus-visible:animate-focus group"
                  >
                    <Icon name="arrow-left" size={14} variant="line" />
                    All posts
                  </Link>
                </p>
              </div>

              <aside className="hidden lg:block" aria-label="About this post">
                <div className="sticky top-24 flex flex-col gap-6">
                  {article.outline.length >= 2 && (
                    <nav aria-label="On this page">
                      <h2 className="font-sans text-[13px] font-semibold tracking-normal text-muted-foreground">
                        On this page
                      </h2>
                      <ol className="mt-3 flex flex-col gap-0.5 border-l border-border-soft">
                        {article.outline.map((h) => (
                          <li key={h.id}>
                            <a
                              href={`#${h.id}`}
                              className="-ml-px block border-l-2 border-transparent py-1.5 pl-3 text-[14px] leading-snug text-muted-foreground hover:border-accent hover:text-foreground"
                            >
                              {h.text}
                            </a>
                          </li>
                        ))}
                      </ol>
                    </nav>
                  )}
                  <div className="rounded-[16px] bg-background p-5">
                    <h2 className="font-sans text-[16px] font-semibold tracking-normal">Get the next post by email</h2>
                    <p className="mt-1 text-[13px] text-muted-foreground">About twice a month. Nothing else.</p>
                    <SubscribeForm source="blog_post" variant="card" className="mt-4" />
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <MkSection id="more-posts" tone="subtle" title="More from the blog">
          <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <li key={p.id}>
                <PostCard post={p} />
              </li>
            ))}
          </ul>
        </MkSection>
      )}

      <ClosingCta
        title="Put what you just read to work"
        body="ERIX brings WhatsApp, your pipeline, GST invoices and automation into one workspace. Request early access."
      />
    </>
  );
}
