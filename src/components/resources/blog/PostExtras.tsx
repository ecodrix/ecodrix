import Image from "next/image";
import Link from "next/link";
import { PrimaryCta } from "@/components/marketing/kit";
import { buttonVariants } from "@/components/ui/button";
import { isOwnSite, safeHref } from "@/lib/resources/blog-seo";

type Cta = NonNullable<BlogSummary["callToAction"]>[number];

/** Mid-article call to action: the post's first CTA, or the site default when it is missing or its link is unsafe. */
export function MidCta({ cta }: { cta?: Cta }) {
  const href = safeHref(cta?.href);
  const custom = cta && href && cta.heading && cta.label ? { ...cta, href } : null;
  return (
    <aside className="my-10 rounded-[16px] bg-background p-6 sm:p-8" aria-label="Next step">
      <p className="font-sans text-[20px] font-semibold tracking-normal text-foreground">
        {custom ? custom.heading : "Put this to work in ERIX"}
      </p>
      {(custom ? custom.text : true) && (
        <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
          {custom ? custom.text : "WhatsApp, your pipeline, GST invoices and automation in one workspace."}
        </p>
      )}
      <div className="mt-5">
        {custom ? (
          <Link
            href={custom.href}
            {...(custom.href.startsWith("/") || isOwnSite(custom.href) ? {} : { target: "_blank", rel: "noopener" })}
            className={buttonVariants({ size: "default" })}
          >
            {custom.label}
            {!custom.href.startsWith("/") && !isOwnSite(custom.href) && (
              <span className="sr-only"> (opens in a new tab)</span>
            )}
          </Link>
        ) : (
          <PrimaryCta />
        )}
      </div>
    </aside>
  );
}

/** Author box under the article. Only when there is more than a name (the byline already shows that). */
export function AuthorBox({ author }: { author: NonNullable<BlogSummary["author"]> }) {
  const url = safeHref(author.url);
  if (!author.name || !(author.bio || url || author.avatar)) return null;
  const avatar = safeHref(author.avatar);
  return (
    <section className="mt-12 flex gap-4 border-t border-border-soft pt-6" aria-label="About the author">
      {avatar && (
        <Image src={avatar} alt="" width={56} height={56} unoptimized className="size-14 rounded-full object-cover" />
      )}
      <div className="min-w-0">
        <p className="text-[13px] text-muted-foreground">Written by</p>
        <p className="font-sans text-[17px] font-semibold text-foreground">{author.name}</p>
        {author.bio && <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">{author.bio}</p>}
        {url && (
          <a
            href={url}
            rel={isOwnSite(url) ? "author" : "author noopener"}
            {...(isOwnSite(url) ? {} : { target: "_blank" })}
            className="mt-2 inline-block text-[15px] font-semibold text-accent hover:underline hover:underline-offset-3"
          >
            More about {author.name}
            {!isOwnSite(url) && <span className="sr-only"> (opens in a new tab)</span>}
          </a>
        )}
      </div>
    </section>
  );
}
