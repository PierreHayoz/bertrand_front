"use client";
import { Link } from "next-transition-router";
import { LABELS } from "../providers";

export default function TransitionLink({ href, label, children, ...props }) {
  const handleClick = () => {
  const entry = LABELS[href];
  const text = label ?? entry?.label ?? "";
  const sub = entry?.subtitle ?? null;
  window.__setCurtainLabel?.(text);
  window.__setCurtainSubtitle?.(sub);
};

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}