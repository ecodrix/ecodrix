"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/icons";
import { PrimaryCta } from "@/components/marketing/kit";
import { FeaturedPost, PostCard } from "@/components/resources/blog/PostCard";
import { categoriesOf, categoryLabel, pickFeatured } from "@/lib/resources/blog";
import { cn } from "@/lib/utils";

const SEARCH_FROM = 9; // search appears only when a filter pill is not enough
const PAGE = 9;

/** Filter pills, optional search, the lead post and the card grid. Filtering is client-side: the list has no bodies. */
export function BlogIndex({ posts }: { posts: BlogSummary[] }) {
  const [cat, setCat] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [shown, setShown] = useState(PAGE);
  const cats = useMemo(() => categoriesOf(posts), [posts]);

  const term = q.trim().toLowerCase();
  const filtered = posts.filter(
    (p) =>
      (!cat || p.category === cat) &&
      (!term || `${p.title} ${p.metaDescription} ${p.tags?.join(" ")}`.toLowerCase().includes(term)),
  );
  // The lead post only shows on the unfiltered view; filters show a plain grid.
  const unfiltered = !cat && !term;
  const lead = unfiltered ? pickFeatured(posts) : undefined;
  const grid = filtered.filter((p) => p !== lead);
  const visible = grid.slice(0, shown);

  const pick = (c: string | null) => {
    setCat(c);
    setShown(PAGE);
  };

  if (posts.length === 0)
    return (
      <div className="mx-auto max-w-xl rounded-[16px] bg-background p-8 text-center">
        <Icon name="file-text" size={24} variant="duo" className="mx-auto text-accent" />
        <h2 className="mt-4 font-sans text-[19px] font-semibold tracking-normal">No posts yet</h2>
        <p className="mt-2 text-muted-foreground">
          The first articles are on their way. Request early access to hear when ERIX opens.
        </p>
        <div className="mt-6 flex justify-center">
          <PrimaryCta />
        </div>
      </div>
    );

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        {cats.length > 0 && (
          <nav aria-label="Filter by category" className="flex flex-wrap gap-2">
            {[null, ...cats].map((c) => (
              <button
                key={c ?? "all"}
                type="button"
                aria-pressed={cat === c}
                onClick={() => pick(c)}
                className={cn(
                  "h-9 rounded-full px-4 text-[14px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                  cat === c ? "bg-accent text-accent-foreground" : "bg-background text-foreground hover:bg-hover",
                )}
              >
                {c ? categoryLabel(c) : "All"}
              </button>
            ))}
          </nav>
        )}
        {posts.length >= SEARCH_FROM && (
          <div className="ml-auto w-full sm:w-64">
            <label htmlFor="blog-search" className="sr-only">
              Search posts
            </label>
            <input
              id="blog-search"
              type="search"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setShown(PAGE);
              }}
              placeholder="Search posts"
              className="h-9 w-full rounded-full bg-background px-4 text-[14px] outline-none placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-accent"
            />
          </div>
        )}
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "post" : "posts"}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-[16px] bg-background p-8 text-center">
          <h2 className="font-sans text-[19px] font-semibold tracking-normal">
            {cat ? `No ${categoryLabel(cat)} posts yet` : "No posts match your search"}
          </h2>
          <p className="mt-2 text-muted-foreground">Try another category, or see every post.</p>
          <button
            type="button"
            onClick={() => {
              setCat(null);
              setQ("");
            }}
            className="mt-5 inline-flex h-10 items-center rounded-full bg-accent px-5 text-[14px] font-semibold text-accent-foreground hover:bg-accent-hover"
          >
            Show all posts
          </button>
        </div>
      ) : (
        <>
          {lead && (
            <div className="mt-8">
              <FeaturedPost post={lead} />
            </div>
          )}
          {visible.length > 0 && (
            <ul className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((p) => (
                <li key={p.id}>
                  <PostCard post={p} />
                </li>
              ))}
            </ul>
          )}
          {grid.length > shown && (
            <div className="mt-12 flex justify-center">
              <button
                type="button"
                onClick={() => setShown((n) => n + PAGE)}
                className="inline-flex h-11 items-center rounded-full bg-background px-6 text-[15px] font-semibold text-foreground hover:bg-hover"
              >
                Show more posts
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
