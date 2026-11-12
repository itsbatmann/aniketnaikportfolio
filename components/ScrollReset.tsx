"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * A Link keeps the scroll position when the incoming page is already in the
 * viewport, which on a one-page-per-project site means arriving halfway down a
 * case study. Reset it on forward navigation, but leave back/forward alone so
 * the browser can restore where you were.
 */
export default function ScrollReset() {
  const pathname = usePathname();
  const popped = useRef(false);

  useEffect(() => {
    const onPop = () => {
      popped.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (popped.current) {
      popped.current = false;
      return;
    }
    if (window.location.hash) return;
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
