"use client";

import { cancelFrame, frame } from "framer-motion";
import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** Fast start, long soft landing: used for anchor jumps ("Request early access"). */
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t));

/**
 * Lenis runs on framer-motion's frame loop instead of its own rAF, so the
 * scroll-linked animations (story rail, reveals, the channel wave) read the
 * same scroll value in the same frame: no one-frame lag, no jitter.
 */
function Clock() {
  const lenis = useLenis();
  useEffect(() => {
    if (!lenis) return;
    const update = ({ timestamp }: { timestamp: number }) => lenis.raf(timestamp);
    frame.update(update, true);
    return () => cancelFrame(update);
  }, [lenis]);
  return null;
}

/** Keeps Lenis in step with the page: overlays and route changes. */
function Bridge() {
  const lenis = useLenis();
  const path = usePathname();
  const lastPath = useRef(path);

  // Radix locks body scroll for the phone menu and the select list
  // (react-remove-scroll sets data-scroll-locked): stop Lenis meanwhile, so
  // the page behind never moves. Scrollable overlay content carries
  // data-lenis-prevent and scrolls natively.
  useEffect(() => {
    if (!lenis) return;
    const sync = () => (document.body.hasAttribute("data-scroll-locked") ? lenis.stop() : lenis.start());
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(document.body, { attributes: true, attributeFilter: ["data-scroll-locked"] });
    return () => mo.disconnect();
  }, [lenis]);

  // After a route change: measure the new page (Lenis would otherwise clamp
  // to the old page's height until its resize observer fires). With a #hash
  // (e.g. "Request early access" → /#contact from another page), land on the
  // target; its scroll-margin (scroll-mt-20) keeps it clear of the fixed
  // header. Without one, adopt wherever the browser put the page (top for a
  // new page, the old position on Back/Forward), so Lenis never glides from
  // the previous page's offset.
  useEffect(() => {
    if (!lenis || lastPath.current === path) return;
    lastPath.current = path;
    let raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => {
        lenis.resize();
        const id = decodeURIComponent(location.hash.slice(1));
        const target = id && document.getElementById(id);
        lenis.scrollTo(target || window.scrollY, { immediate: true, force: true });
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [lenis, path]);

  return null;
}

export default function LenisRoot() {
  return (
    <ReactLenis
      root
      options={{
        autoRaf: false, // driven by <Clock /> on framer-motion's frame loop
        lerp: 0.1, // wheel and trackpad: smooth, keeps the trackpad's own momentum
        syncTouch: false, // touch scrolls natively
        allowNestedScroll: true, // inner scroll areas (menus, tables, lists) scroll themselves
        anchors: { duration: 1.1, easing: easeOutExpo },
        stopInertiaOnNavigate: true,
      }}
    >
      <Clock />
      <Bridge />
    </ReactLenis>
  );
}
