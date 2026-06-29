"use client";

import { useState, useRef, useEffect } from "react";

export default function ProductGallery({ images = [] }) {
  const [index, setIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const imgRef = useRef(null);
  const containerRef = useRef(null);
  const draggingRef = useRef(false);
  const pointerStartRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const pointers = useRef(new Map());
  const pinchRef = useRef({ initialDist: 0, initialScale: 1 });
  const lastTapRef = useRef({ time: 0, x: 0, y: 0 });
  const [isSnapping, setIsSnapping] = useState(false);
  const txRef = useRef(0);
  const tyRef = useRef(0);
  const velocityRef = useRef({ vx: 0, vy: 0 });
  const lastMoveRef = useRef({ t: 0, x: 0, y: 0 });
  const momentumFrameRef = useRef(null);

  // track container and image sizing for bounds
  const [bounds, setBounds] = useState({ maxTx: 0, maxTy: 0 });

  useEffect(() => {
    setScale(1); // reset zoom when image changes
    setTx(0);
    setTy(0);
    txRef.current = 0;
    tyRef.current = 0;
    // recalc bounds after image loads
    const calc = () => {
      const img = imgRef.current;
      const container = containerRef.current;
      if (!img || !container) return;
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      const nw = img.naturalWidth || cw;
      const nh = img.naturalHeight || ch;
      const ratio = Math.min(cw / nw, ch / nh);
      const displayedW = nw * ratio;
      const displayedH = nh * ratio;
      const maxTx = Math.max(0, (displayedW * 1 - cw) / 2);
      const maxTy = Math.max(0, (displayedH * 1 - ch) / 2);
      setBounds({ displayedW, displayedH, cw, ch, maxTx, maxTy });
    };
    // calc soon and on resize
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [index]);

  const zoomIn = () => setScale((s) => Math.min(3, +(s + 0.25).toFixed(2)));
  const zoomOut = () => setScale((s) => Math.max(1, +(s - 0.25).toFixed(2)));

  const onWheel = (e) => {
    if (Math.abs(e.deltaY) < 1) return;
    if (e.deltaY < 0) zoomIn();
    else zoomOut();
  };

  // Pointer-based pan (works for mouse and touch)
  const onPointerDown = (e) => {
    // double-tap detection for touch
    if (e.pointerType === "touch") {
      const now = Date.now();
      const last = lastTapRef.current;
      const dx = Math.abs(e.clientX - last.x);
      const dy = Math.abs(e.clientY - last.y);
      const dist = Math.hypot(dx, dy);
      if (now - last.time < 300 && dist < 30) {
        // double-tap detected
        onDoubleClick(e);
        lastTapRef.current = { time: 0, x: 0, y: 0 };
        return;
      }
      lastTapRef.current = { time: now, x: e.clientX, y: e.clientY };
    }

    // register pointer
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2) {
      // start pinch
      const pts = Array.from(pointers.current.values());
      const dx = pts[0].x - pts[1].x;
      const dy = pts[0].y - pts[1].y;
      pinchRef.current.initialDist = Math.hypot(dx, dy);
      pinchRef.current.initialScale = scale;
    } else if (pointers.current.size === 1 && scale > 1) {
      // start dragging with single pointer
      draggingRef.current = true;
      pointerStartRef.current = { x: e.clientX, y: e.clientY, tx, ty };
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch (err) {}
    }
  };

  const onPointerMove = (e) => {
    if (pointers.current.has(e.pointerId)) {
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }

    if (pointers.current.size === 2) {
      // pinch
      const pts = Array.from(pointers.current.values());
      const dx = pts[0].x - pts[1].x;
      const dy = pts[0].y - pts[1].y;
      const dist = Math.hypot(dx, dy);
      const newScale = Math.max(1, Math.min(3, pinchRef.current.initialScale * (dist / pinchRef.current.initialDist)));
      setScale(newScale);
      // clamp translate after scale change
      const { maxTx, maxTy, displayedW, displayedH, cw, ch } = bounds || {};
      const maxX = Math.max(0, (displayedW * newScale - (cw || 0)) / 2);
      const maxY = Math.max(0, (displayedH * newScale - (ch || 0)) / 2);
      setTx((t) => Math.max(-maxX, Math.min(maxX, t)));
      setTy((t) => Math.max(-maxY, Math.min(maxY, t)));
      return;
    }

    if (!draggingRef.current) return;
    e.preventDefault();
    const dx = e.clientX - pointerStartRef.current.x;
    const dy = e.clientY - pointerStartRef.current.y;
    // clamp
    const { displayedW, displayedH, cw, ch } = bounds || {};
    const maxX = Math.max(0, (displayedW * scale - (cw || 0)) / 2);
    const maxY = Math.max(0, (displayedH * scale - (ch || 0)) / 2);
    const nextTx = pointerStartRef.current.tx + dx;
    const nextTy = pointerStartRef.current.ty + dy;
    const clampedX = Math.max(-maxX, Math.min(maxX, nextTx));
    const clampedY = Math.max(-maxY, Math.min(maxY, nextTy));
    setTx(clampedX);
    setTy(clampedY);
    txRef.current = clampedX;
    tyRef.current = clampedY;

    // compute velocity for momentum (pixels per ms)
    const now = performance.now();
    const last = lastMoveRef.current;
    if (last.t) {
      const dt = Math.max(1, now - last.t);
      velocityRef.current.vx = (e.clientX - last.x) / dt;
      velocityRef.current.vy = (e.clientY - last.y) / dt;
    }
    lastMoveRef.current = { t: now, x: e.clientX, y: e.clientY };
  };

  const onPointerUp = (e) => {
    // remove pointer
    pointers.current.delete(e.pointerId);
    if (draggingRef.current) {
      draggingRef.current = false;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }
    // snap to edges if close with a smooth animation
    const { displayedW, displayedH, cw, ch } = bounds || {};
    const maxX = Math.max(0, ((displayedW || 0) * scale - (cw || 0)) / 2);
    const maxY = Math.max(0, ((displayedH || 0) * scale - (ch || 0)) / 2);
    const snapThreshold = 24; // px
    let nx = tx;
    let ny = ty;
    if (maxX > 0) {
      if (Math.abs(Math.abs(tx) - maxX) < snapThreshold) nx = Math.sign(tx) * maxX;
    } else {
      nx = 0;
    }
    if (maxY > 0) {
      if (Math.abs(Math.abs(ty) - maxY) < snapThreshold) ny = Math.sign(ty) * maxY;
    } else {
      ny = 0;
    }
    if (nx !== tx || ny !== ty) {
      setIsSnapping(true);
      setTx(nx);
      setTy(ny);
      txRef.current = nx;
      tyRef.current = ny;
      // end snapping after animation
      setTimeout(() => setIsSnapping(false), 220);
    }

    // start momentum if user was dragging and we have velocity
    const { vx, vy } = velocityRef.current;
    const speed = Math.hypot(vx || 0, vy || 0);
    if (speed > 0.02 && Math.abs(scale - 1) > 0.01) {
      // apply momentum
      const decay = 0.95; // per frame
      const step = () => {
        // apply velocity to tx/ty (velocity is px per ms, convert to px per frame ~16ms)
        const vFactor = 16; // approximate ms per frame
        velocityRef.current.vx *= decay;
        velocityRef.current.vy *= decay;
        let nextX = txRef.current + velocityRef.current.vx * vFactor;
        let nextY = tyRef.current + velocityRef.current.vy * vFactor;

        const { displayedW, displayedH, cw, ch } = bounds || {};
        const maxX = Math.max(0, ((displayedW || 0) * scale - (cw || 0)) / 2);
        const maxY = Math.max(0, ((displayedH || 0) * scale - (ch || 0)) / 2);

        // clamp and reduce velocity if hitting edges
        if (nextX > maxX) {
          nextX = maxX;
          velocityRef.current.vx *= 0.3;
        } else if (nextX < -maxX) {
          nextX = -maxX;
          velocityRef.current.vx *= 0.3;
        }
        if (nextY > maxY) {
          nextY = maxY;
          velocityRef.current.vy *= 0.3;
        } else if (nextY < -maxY) {
          nextY = -maxY;
          velocityRef.current.vy *= 0.3;
        }

        txRef.current = nextX;
        tyRef.current = nextY;
        setTx(nextX);
        setTy(nextY);

        const vMag = Math.hypot(velocityRef.current.vx, velocityRef.current.vy);
        if (vMag > 0.02) {
          momentumFrameRef.current = requestAnimationFrame(step);
        } else {
          momentumFrameRef.current = null;
        }
      };
      if (momentumFrameRef.current) cancelAnimationFrame(momentumFrameRef.current);
      momentumFrameRef.current = requestAnimationFrame(step);
    }
  };

  const onDoubleClick = (e) => {
    // cycle through zoom levels [1, 2, 3]
    const levels = [1, 2, 3];
    const currentIndex = levels.reduce((acc, v, i) => (Math.abs(scale - v) < 0.01 ? i : acc), 0);
    const nextIndex = (currentIndex + 1) % levels.length;
    const targetScale = levels[nextIndex];

    if (targetScale > 1) {
      // zoom into the pointer position (center that point)
      const container = containerRef.current;
      if (!container) {
        setScale(targetScale);
        return;
      }
      const rect = container.getBoundingClientRect();
      const px = e.clientX - rect.left; // x within container
      const py = e.clientY - rect.top; // y within container
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      const relX = px - cx;
      const relY = py - cy;

      // Compute translate so that the tapped point moves to center after scaling
      const nextTx = -relX * targetScale;
      const nextTy = -relY * targetScale;

      // clamp to bounds
      const { displayedW, displayedH, cw, ch } = bounds || {};
      const maxX = Math.max(0, ((displayedW || rect.width) * targetScale - (cw || rect.width)) / 2);
      const maxY = Math.max(0, ((displayedH || rect.height) * targetScale - (ch || rect.height)) / 2);

      setTx(Math.max(-maxX, Math.min(maxX, nextTx)));
      setTy(Math.max(-maxY, Math.min(maxY, nextTy)));
      setScale(targetScale);
    } else {
      setScale(1);
      setTx(0);
      setTy(0);
      txRef.current = 0;
      tyRef.current = 0;
    }
  };

  // keyboard navigation and shortcuts
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const onKey = (ev) => {
      if (ev.key === "ArrowLeft") {
        setIndex((i) => Math.max(0, i - 1));
      } else if (ev.key === "ArrowRight") {
        setIndex((i) => Math.min(images.length - 1, i + 1));
      } else if (ev.key === "+" || ev.key === "=") {
        zoomIn();
      } else if (ev.key === "-" || ev.key === "_") {
        zoomOut();
      } else if (ev.key === "0") {
        // reset
        setScale(1);
        setTx(0);
        setTy(0);
        txRef.current = 0;
        tyRef.current = 0;
      }
    };
    node.addEventListener("keydown", onKey);
    return () => node.removeEventListener("keydown", onKey);
  }, [images.length]);

  return (
    <div>
      <div
        ref={containerRef}
        tabIndex={0}
        role="group"
        aria-label="Product image gallery"
        className="w-full h-72 md:h-96 bg-gray-50 rounded overflow-hidden flex items-center justify-center"
      >
        <div
          onWheel={onWheel}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onDoubleClick={onDoubleClick}
          style={{
            transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
            transition: isSnapping ? "transform 220ms cubic-bezier(.2,.8,.2,1)" : "transform 120ms ease-out",
            transformOrigin: "center center",
            maxWidth: "100%",
            maxHeight: "100%",
            touchAction: scale > 1 ? "none" : "auto",
            cursor: scale > 1 ? (draggingRef.current ? "grabbing" : "grab") : "default",
            display: "block",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={images[index]}
            alt={`product-${index}`}
            className="block w-full h-72 md:h-96 object-contain select-none"
            draggable={false}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setIndex(i)}
              className={`border rounded p-0.5 ${i === index ? "ring-2 ring-blue-500" : ""}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`thumb-${i}`} className="w-16 h-12 object-cover" />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            className="px-3 py-1 bg-gray-200 rounded"
            aria-label="Zoom out"
          >
            -
          </button>
          <div className="text-sm">{scale.toFixed(2)}x</div>
          <button
            onClick={zoomIn}
            className="px-3 py-1 bg-gray-200 rounded"
            aria-label="Zoom in"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
