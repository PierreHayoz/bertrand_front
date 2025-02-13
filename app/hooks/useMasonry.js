import { useEffect, useState, useRef } from "react";

const useMasonry = () => {
  const masonryContainer = useRef(null);
  const [items, setItems] = useState([]);
  
  useEffect(() => {
    if (masonryContainer.current) {
      setItems(Array.from(masonryContainer.current.children));
    }
  }, []);

  useEffect(() => {
    if (!masonryContainer.current) return;

    const handleMasonry = () => {
      if (!items || items.length < 1 || !masonryContainer.current) return;

      const gapSize = parseInt(window.getComputedStyle(masonryContainer.current).getPropertyValue("grid-row-gap")) || 0;

      items.forEach((el) => {
        if (!(el instanceof HTMLElement)) return;

        let previous = el.previousSibling;
        while (previous) {
          if (previous.nodeType === 1) {
            el.style.marginTop = "0";
            if (previous instanceof HTMLElement && elementLeft(previous) === elementLeft(el)) {
              el.style.marginTop = -(elementTop(el) - elementBottom(previous) - gapSize) + "px";
              break;
            }
          }
          previous = previous.previousSibling;
        }
      });
    };

    // Recalculer la mise en page après le redimensionnement ou l'ajout d'éléments
    const handleResize = () => {
      requestAnimationFrame(() => {
        handleMasonry();
      });
    };

    // Observer les changements dans le conteneur
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(masonryContainer.current);

    // Observer les changements dans les enfants du conteneur
    const observer = new MutationObserver(() => {
      setItems(Array.from(masonryContainer.current.children));
      handleMasonry();
    });

    observer.observe(masonryContainer.current, { childList: true });

    window.addEventListener("resize", handleResize);

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [items]);

  const elementLeft = (el) => el.getBoundingClientRect().left;
  const elementTop = (el) => el.getBoundingClientRect().top + window.scrollY;
  const elementBottom = (el) => el.getBoundingClientRect().bottom + window.scrollY;

  return masonryContainer;
};

export default useMasonry;
