import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Canonical host: lautureglobal.com redirects to www, so every URL we publish uses www.
const SITE_URL = "https://www.lautureglobal.com";
const SITE_NAME = "Lauture Global LTD";

type PageMeta = { title: string; description: string };

// Per-page titles/descriptions for search results and link previews.
// Keep titles under ~60 characters and descriptions under ~160.
const PAGES: Record<string, PageMeta> = {
  "/": {
    title: "Lauture Global LTD — Explore, Relocate & Invest in Rwanda",
    description:
      "Kigali-based experts in relocation, tourism, investment and business advisory in Rwanda. Personalised guidance for individuals, families and entrepreneurs.",
  },
  "/about": {
    title: "About Us | Lauture Global LTD",
    description:
      "Meet Lauture Global, a Kigali-based team helping people explore, relocate to and invest in Rwanda with personalised strategy and local insight.",
  },
  "/services": {
    title: "Relocation Packages & Pricing | Lauture Global LTD",
    description:
      "Relocation, vacation planning, visas, business setup and investment support in Rwanda. Compare our Basic, Comprehensive and Premium packages.",
  },
  "/partners": {
    title: "Our Partners in Rwanda | Lauture Global LTD",
    description:
      "Hotels, lodges, real estate, tour operators and community partners across Rwanda, selected to give our clients reliable, high-quality experiences.",
  },
  "/founders": {
    title: "Our Founders | Lauture Global LTD",
    description: "Meet the founders behind Lauture Global and their experience helping clients settle and thrive in Rwanda.",
  },
  "/resources": {
    title: "Guides for Life in Rwanda | Lauture Global LTD",
    description:
      "Practical guides on business setup, community life and culture in Rwanda, plus our magazine and travel brochures.",
  },
  "/contact": {
    title: "Contact Us | Lauture Global LTD",
    description:
      "Talk to Lauture Global in Kigali by WhatsApp, phone or email, or book a consultation about exploring, relocating to or investing in Rwanda.",
  },
};

// Signed-in and transactional pages shouldn't appear in search results.
const NOINDEX_PREFIXES = ["/login", "/dashboard", "/admin", "/payment-success", "/payment-failed", "/success"];

const setMeta = (attr: "name" | "property", key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const setCanonical = (href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
};

const RouteMeta = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const path = pathname !== "/" ? pathname.replace(/\/+$/, "") : "/";
    const page = PAGES[path];
    const noindex = !page || NOINDEX_PREFIXES.some((p) => path === p || path.startsWith(p + "/"));
    const meta = page ?? { title: SITE_NAME, description: PAGES["/"].description };
    const url = SITE_URL + (path === "/" ? "/" : path);

    document.title = meta.title;
    setMeta("name", "description", meta.description);
    setMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
    setMeta("property", "og:title", meta.title);
    setMeta("property", "og:description", meta.description);
    setMeta("property", "og:url", url);
    setMeta("name", "twitter:title", meta.title);
    setMeta("name", "twitter:description", meta.description);
    setCanonical(page ? url : SITE_URL + "/");
  }, [pathname]);

  return null;
};

export default RouteMeta;
