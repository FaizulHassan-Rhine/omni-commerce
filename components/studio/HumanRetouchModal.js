'use client';

import { useEffect, useRef, useState } from 'react';
import Modal from '@/components/ui/Modal';
import { mediaPreviewStyle } from '@/lib/studio-edit';
import { resolveImage } from '@/lib/images';
import { Eraser, Undo2 } from 'lucide-react';

const MARKER_COLOR = 'rgba(180, 70, 220, 0.55)';
const MARKER_WIDTH = 18;

function pointFromEvent(event, el) {
  const rect = el.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * el.width,
    y: ((event.clientY - rect.top) / rect.height) * el.height,
  };
}

function paintStrokes(ctx, strokes, width, height) {
  ctx.clearRect(0, 0, width, height);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = MARKER_COLOR;
  ctx.lineWidth = MARKER_WIDTH;
  (strokes || []).forEach((stroke) => {
    if (!stroke || !stroke.length) return;
    ctx.beginPath();
    ctx.moveTo(stroke[0].x, stroke[0].y);
    for (let i = 1; i < stroke.length; i += 1) {
      ctx.lineTo(stroke[i].x, stroke[i].y);
    }
    if (stroke.length === 1) {
      ctx.lineTo(stroke[0].x + 0.1, stroke[0].y);
    }
    ctx.stroke();
  });
}

export default function HumanRetouchModal({ open, asset, onClose, onSubmit }) {
  const [instructions, setInstructions] = useState('');
  const [strokes, setStrokes] = useState([]);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const currentStroke = useRef(null);
  const strokesRef = useRef([]);
  const drawingRef = useRef(false);

  strokesRef.current = strokes;

  const redraw = (nextStrokes = strokesRef.current) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    paintStrokes(ctx, (nextStrokes || []).filter(Boolean), canvas.width, canvas.height);
  };

  const syncCanvasSize = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const { width, height } = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    redraw(strokesRef.current);
  };

  useEffect(() => {
    if (!open) return undefined;
    setInstructions('');
    setStrokes([]);
    drawingRef.current = false;
    currentStroke.current = null;
    const timer = window.setTimeout(syncCanvasSize, 40);
    const onResize = () => syncCanvasSize();
    window.addEventListener('resize', onResize);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', onResize);
    };
  }, [open, asset?.id]);

  useEffect(() => {
    redraw(strokes);
  }, [strokes]);

  if (!asset) return null;

  const startDraw = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    event.preventDefault();
    canvas.setPointerCapture?.(event.pointerId);
    const point = pointFromEvent(event, canvas);
    currentStroke.current = [point];
    drawingRef.current = true;
    redraw([...strokesRef.current.filter(Boolean), currentStroke.current]);
  };

  const moveDraw = (event) => {
    if (!drawingRef.current || !currentStroke.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    event.preventDefault();
    const point = pointFromEvent(event, canvas);
    currentStroke.current = [...currentStroke.current, point];
    redraw([...strokesRef.current.filter(Boolean), currentStroke.current]);
  };

  const endDraw = (event) => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    const canvas = canvasRef.current;
    canvas?.releasePointerCapture?.(event.pointerId);
    const finished = currentStroke.current;
    currentStroke.current = null;
    if (finished?.length) {
      setStrokes((prev) => [...prev.filter(Boolean), finished]);
    }
  };

  const clearMarks = () => {
    setStrokes([]);
    currentStroke.current = null;
    drawingRef.current = false;
  };

  const undoMark = () => {
    setStrokes((prev) => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    const text = instructions.trim();
    if (!text && strokes.length === 0) return;
    onSubmit?.({
      asset,
      instructions: text,
      marks: strokes,
    });
  };

  return (
    <Modal open={open} onClose={onClose} title="Human Retouch" size="xl">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div>
          <p className="mb-2 text-sm text-text-secondary">
            Draw with the marker pen on areas that need retouching.
          </p>
          <div
            ref={containerRef}
            className="relative w-full touch-none overflow-hidden rounded-xl border border-gray-200 bg-gray-100"
          >
            <img
              src={resolveImage(asset.src)}
              alt=""
              className="aspect-square w-full object-cover select-none"
              style={mediaPreviewStyle(asset)}
              draggable={false}
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 h-full w-full cursor-crosshair"
              onPointerDown={startDraw}
              onPointerMove={moveDraw}
              onPointerUp={endDraw}
              onPointerCancel={endDraw}
            />
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-text-muted">
              {strokes.length === 0
                ? 'No marker strokes yet.'
                : `${strokes.length} marker stroke${strokes.length === 1 ? '' : 's'}.`}
            </p>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={undoMark}
                disabled={strokes.length === 0}
                className="btn-ghost px-2 py-1 text-xs"
              >
                <Undo2 className="h-3.5 w-3.5" /> Undo
              </button>
              <button
                type="button"
                onClick={clearMarks}
                disabled={strokes.length === 0}
                className="btn-ghost px-2 py-1 text-xs"
              >
                <Eraser className="h-3.5 w-3.5" /> Clear
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <label className="label" htmlFor="human-retouch-instructions">
            Instructions
          </label>
          <textarea
            id="human-retouch-instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={10}
            placeholder="Describe what the retoucher should change. Example: Soften background lights, clean dust on the bag, keep product color natural."
            className="input min-h-[12rem] flex-1 resize-none"
          />
          <p className="mt-2 text-xs text-text-muted">
            Your notes and marker strokes will be sent with the retouch request.
          </p>
          <div className="mt-4 flex flex-wrap justify-end gap-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!instructions.trim() && strokes.length === 0}
              className="btn-gradient"
            >
              Submit retouch request
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
