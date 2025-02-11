"use client";

export default function ScrollToBottom() {
  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  return <div onClick={scrollToBottom} style={{ cursor: "pointer" }}>Contact</div>;
}
