"use client";

import { useEffect, useRef, useState } from "react";
import { BilanData } from "@/types/bilan";
import SheetPreview from "./SheetPreview";

const A4_H = 1123;

interface Props {
  data: BilanData;
}

export default function PreviewPanel({ data }: Props) {
  // Ce ref est sur la zone intérieure contrainte (max-w) — pas le conteneur avec padding.
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.75);

  useEffect(() => {
    function resize() {
      if (!innerRef.current) return;
      setScale((innerRef.current.clientWidth / 794) * 1.2);
    }
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const pageW = 794 * scale;
  const pageH = A4_H * scale;

  const pageBox = {
    width: pageW,
    height: pageH,
    overflow: "hidden" as const,
    background: "#fff",
    borderRadius: 2,
    boxShadow:
      "0 18px 40px -18px rgba(0,0,0,.35), 0 0 0 1px rgba(0,0,0,.05)",
    flexShrink: 0,
  };

  return (
    <div className="px-10 py-12 flex flex-col items-center bg-[#e9eaec] min-h-[calc(100vh-60px)]">
      {/* Zone mesurée — max-w limite le scale quelle que soit la largeur du panel */}
      <div ref={innerRef} className="w-full max-w-[580px]">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-[#6b6e74]">Aperçu A4</span>
          <span className="text-xs text-[#2f5fa8]">● mis à jour en direct</span>
        </div>

        <div className="flex flex-col gap-5">
          {[0, 1].map((pageIndex) => {
            // Page 2 : on recule le clip de TOP_PAD px pour créer une marge haute,
            // puis on recouvre ces px avec un bloc blanc.
            const TOP_PAD = pageIndex === 1 ? 50 : 0;
            const offset = pageIndex * A4_H - TOP_PAD;
            const boxHeight = (A4_H + TOP_PAD) * scale;
            return (
              <div key={pageIndex} style={{ ...pageBox, height: boxHeight, position: "relative" }}>
                <div
                  style={{
                    transformOrigin: "top left",
                    transform: `scale(${scale}) translateY(-${offset}px)`,
                  }}
                >
                  <SheetPreview data={data} />
                </div>
                {TOP_PAD > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: TOP_PAD * scale,
                      background: "#fff",
                      zIndex: 1,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
