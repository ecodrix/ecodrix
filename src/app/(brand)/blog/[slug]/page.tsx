import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icons";
import { EmailCta, MkSection, PrimaryCta } from "@/components/marketing/kit";
import { Crumbs } from "@/components/platform/shared/ModulePage";
import { BlogContent, prepareArticle } from "@/components/resources/blog/BlogContent";
import { CopyLink } from "@/components/resources/blog/CopyLink";
import { PostCard } from "@/components/resources/blog/PostCard";
import { PostToc } from "@/components/resources/blog/PostToc";
import { SubscribeForm } from "@/components/resources/blog/SubscribeForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { blogs } from "@/lib/api";
import { AuthorBox, MidCta } from "@/components/resources/blog/PostExtras";
import { absUrl, isoDate, isUpdatedLater, safeHref, splitForCta } from "@/lib/resources/blog-seo";
import { categoryLabel, fmtDate, relatedPosts, shareLinks } from "@/lib/resources/blog";
import { getBreadcrumbSchema, SEO_CONSTANTS } from "@/lib/seo/jsonld";

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
  const description = post.searchDescription || post.metaDescription || undefined;
  const title = post.metaTitle || post.title || undefined;
  const social = post.socialImage?.url
    ? { url: post.socialImage.url, alt: post.socialImage.altText || post.title || "" }
    : post.featuredImage?.url
      ? { url: post.featuredImage.url, alt: post.featuredImage.altText || post.title || "" }
      : null;
  return {
    // The root template adds " | ECODrIx". Google ignores the keywords meta, so none is emitted.
    title,
    description,
    robots: post.noindex ? { index: false, follow: true } : undefined,
    alternates: { canonical, types: { "application/rss+xml": "/blog/rss.xml" } },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: isoDate(post.publishDate),
      modifiedTime: isoDate(post.updatedAt),
      section: post.category ? categoryLabel(post.category) : undefined,
      tags: post.tags?.length ? post.tags : undefined,
      authors: post.author?.name ? [post.author.name] : undefined,
      images: social ? [social] : ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: social ? [{ url: social.url, alt: social.alt }] : ["/opengraph-image"],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await blogs.fetchPostBySlug(slug);
  if (!post) notFound();

  const url = `${SEO_CONSTANTS.BASE_URL}/blog/${post.slug}`;
  const authorUrl = safeHref(post.author?.url);
  const images = [
    ...new Set(
      [post.socialImage?.url, post.featuredImage?.url].map((u) => absUrl(SEO_CONSTANTS.BASE_URL, u)).filter(Boolean),
    ),
  ];
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.searchDescription || post.metaDescription || undefined,
    image: images.length ? images : undefined,
    datePublished: isoDate(post.publishDate),
    dateModified: isoDate(post.updatedAt) || isoDate(post.publishDate),
    author: {
      "@type": "Person",
      name: post.author?.name || "ECODrIx Team",
      ...(authorUrl && { url: authorUrl, sameAs: [authorUrl] }),
    },
    publisher: {
      "@type": "Organization",
      name: "ECODrIx",
      url: SEO_CONSTANTS.BASE_URL,
      logo: { "@type": "ImageObject", url: `${SEO_CONSTANTS.BASE_URL}/logo.png` },
    },
    mainEntityOfPage: url,
    wordCount: post.wordCount,
  };
  const crumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: post.title ?? "Post", url },
  ]);

  const article = prepareArticle(post.body || "");
  const split = splitForCta(article.html);
  // Same category first, then the newest (the cached list, no bodies).
  const related = relatedPosts(await blogs.fetchPublishedPosts(), post);
  const share = shareLinks(post.title ?? "", url);
  const shareCls =
    "inline-flex h-10 items-center gap-2 rounded-full bg-background px-4 text-[14px] font-medium text-foreground hover:bg-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={crumbSchema} />

      <article className="w-full">
        <div className="py-section pt-8! md:pt-12!">
          {/* Reading column 720px; from 1200px the "On this page" rail sits beside it. */}
          <div className="mx-auto grid w-full max-w-[1080px] gap-x-16 px-gutter min-[1200px]:grid-cols-[minmax(0,720px)_240px] min-[1200px]:justify-center">
            <div className="mx-auto w-full min-w-0 max-w-[720px] min-[1200px]:mx-0">
              <header>
                <Crumbs items={[{ name: "Blog", href: "/blog" }, { name: post.title ?? "Post" }]} />
                {post.category && (
                  <p className="mt-8 w-fit rounded-full bg-accent-muted px-2.5 py-0.5 text-[12px] font-semibold text-accent">
                    {categoryLabel(post.category)}
                  </p>
                )}
                <h1 className="mt-4 text-[clamp(30px,4.2vw,46px)] leading-[1.1] tracking-[-0.03em] text-balance">
                  {post.title}
                </h1>
                {post.metaDescription && (
                  <p className="mt-5 text-[clamp(18px,1.6vw,20px)] leading-relaxed text-muted-foreground">
                    {post.metaDescription}
                  </p>
                )}
                <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-border-soft py-4 text-[14px] text-muted-foreground">
                  {post.author?.name && (
                    <span className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="grid size-8 place-items-center rounded-full bg-accent-muted text-[13px] font-bold text-accent"
                      >
                        {post.author.name.charAt(0)}
                      </span>
                      <span className="font-semibold text-foreground">{post.author.name}</span>
                    </span>
                  )}
                  {post.publishDate && <time dateTime={post.publishDate}>{fmtDate(post.publishDate)}</time>}
                  {isUpdatedLater(post.publishDate, post.updatedAt) && post.updatedAt && (
                    <span>
                      Updated <time dateTime={isoDate(post.updatedAt)}>{fmtDate(post.updatedAt)}</time>
                    </span>
                  )}
                  {post.readTime ? <span>{post.readTime} min read</span> : null}
                </p>
              </header>

              {post.featuredImage?.url && (
                <div className="relative mt-8 aspect-video overflow-hidden rounded-[16px] bg-accent-muted">
                  <Image
                    src={post.featuredImage.url}
                    alt={post.featuredImage.altText || post.title || ""}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 720px"
                  />
                </div>
              )}

              <div className="mt-8 min-[1200px]:hidden">
                <PostToc outline={article.outline} variant="inline" />
              </div>

              <div className="mt-8">
                {split ? (
                  <>
                    <BlogContent html={split[0]} />
                    <MidCta cta={post.callToAction?.[0]} />
                    <BlogContent html={split[1]} />
                  </>
                ) : (
                  <BlogContent html={article.html} />
                )}
              </div>

              {post.author && <AuthorBox author={post.author} />}

              {post.tags?.length > 0 && (
                <div className="mt-12 border-t border-border-soft pt-6">
                  <h2 className="font-sans text-[14px] font-semibold tracking-normal text-foreground">Topics</h2>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <li key={tag} className="rounded-full bg-background px-3 py-1 text-[13px] text-muted-foreground">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-2">
                <span className="mr-1 text-[14px] font-semibold text-foreground">Share</span>
                <CopyLink url={url} />
                {[
                  { label: "LinkedIn", href: share.linkedin },
                  { label: "X", href: share.x },
                ].map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className={shareCls}>
                    {s.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ))}
              </div>

              <div className="mt-12 rounded-[16px] bg-background p-6 sm:p-8">
                <h2 className="font-sans text-[20px] font-semibold tracking-normal">Put this to work in ERIX</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                  WhatsApp, your pipeline, GST invoices and automation in one workspace.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <PrimaryCta />
                  <EmailCta />
                </div>
              </div>

              <div className="mt-6 rounded-[16px] bg-background p-6 sm:p-8">
                <h2 className="font-sans text-[17px] font-semibold tracking-normal">Get the next post by email</h2>
                <p className="mt-1 text-[14px] text-muted-foreground">About twice a month. Nothing else.</p>
                <SubscribeForm source="blog_post" className="mt-4" />
              </div>

              <p className="mt-10">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1.5 font-sans text-[15px]/5 font-[650] text-accent hover:underline hover:underline-offset-3"
                >
                  <Icon name="arrow-left" size={14} variant="line" />
                  All posts
                </Link>
              </p>
            </div>

            <aside className="hidden min-[1200px]:block" aria-label="About this post">
              <div className="h-full pt-[4.5rem]">
                <PostToc outline={article.outline} variant="rail" />
              </div>
            </aside>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <MkSection id="more-posts" tone="subtle" title="Keep reading">
          <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <li key={p.id}>
                <PostCard post={p} />
              </li>
            ))}
          </ul>
        </MkSection>
      )}
    </>
  );
}
