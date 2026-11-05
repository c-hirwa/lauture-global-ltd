import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// On navigation: jump to #anchor if the URL has one (e.g. /services#pricing), otherwise to the top.
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0 });
      return;
    }

    const id = decodeURIComponent(hash.slice(1));
    let tries = 0;
    let timer: ReturnType<typeof setTimeout>;
    // Pages are lazy-loaded, so the target may not exist on the first frame.
    const scrollToTarget = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (tries++ < 20) {
        timer = setTimeout(scrollToTarget, 100);
      }
    };
    scrollToTarget();
    return () => clearTimeout(timer);
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
