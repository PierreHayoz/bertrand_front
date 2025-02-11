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
    let observer;

    const handleMasonry = () => {
      if (!items || items.length < 1 || !masonryContainer.current) return;
    
      let gapSize = 0;
      if (masonryContainer.current) {
        const computedStyle = window.getComputedStyle(masonryContainer.current);
        if (computedStyle) {
          gapSize = parseInt(computedStyle.getPropertyValue("grid-row-gap")) || 0;
        }
      }
    
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

    handleMasonry();

    // Observer les changements dans les enfants du conteneur
    observer = new MutationObserver(() => {
      setItems(Array.from(masonryContainer.current.children));
      handleMasonry();
    });

    observer.observe(masonryContainer.current, { childList: true });

    // Observer le redimensionnement des éléments
    const resizeObserver = new ResizeObserver(handleMasonry);
    items.forEach((el) => resizeObserver.observe(el));

    window.addEventListener("resize", handleMasonry);

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleMasonry);
    };
  }, [items]);

  const elementLeft = (el) => el.getBoundingClientRect().left;
  const elementTop = (el) => el.getBoundingClientRect().top + window.scrollY;
  const elementBottom = (el) => el.getBoundingClientRect().bottom + window.scrollY;

  return masonryContainer;
};

export default useMasonry;
