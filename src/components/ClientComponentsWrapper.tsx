"use client";

import dynamic from "next/dynamic";

const StickyBottomBar = dynamic(() => import("@/components/StickyBottomBar"), {
  ssr: false,
});
const WhatsAppButton = dynamic(() => import("@/components/WhatsAppButton"), {
  ssr: false,
});

export default function ClientComponentsWrapper() {
  return (
    <>
      <StickyBottomBar />
      <WhatsAppButton />
    </>
  );
}