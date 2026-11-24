"use client";

import { Link } from "next-transition-router";
import { setNextLabel } from "../lib/motion";

/** Lien avec transition de rideau ; `label` remplace le titre affiché sur le rideau. */
export default function TransitionLink({ href, label, children, onClick, ...props }) {
  return (
    <Link
      href={href}
      onClick={(e) => {
        if (label) setNextLabel(label);
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </Link>
  );
}
