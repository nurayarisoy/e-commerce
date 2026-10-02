"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cartStore";

export default function ClearCartOnComplete({ active }) {
  useEffect(() => {
    if (active) useCartStore.getState().clear();
  }, [active]);

  return null;
}