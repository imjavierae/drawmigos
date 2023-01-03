import { useEffect, useRef } from "react";

export function useOnDraw(onDraw: any) {
  const canvasRef = useRef<any>(null);
  const prevPointRef = useRef<any>(null);
  const isDrawingRef = useRef<any>(false);

  const mouseMoveListenerRef = useRef<any>(null);
  const mouseUpListenerRef = useRef<any>(null);

  useEffect(() => {
    function initMouseMoveListener() {
      const mouseMoveListener = (e: MouseEvent) => {
        if (isDrawingRef.current) {
          const point = computePointInCanvas(e.clientX, e.clientY);
          const ctx = canvasRef.current.getContext("2d");
          if (onDraw) onDraw(ctx, point, prevPointRef.current);
          prevPointRef.current = point;
          console.log(point);
        }
      };
      mouseMoveListenerRef.current = mouseMoveListener;
      window.addEventListener("mousemove", mouseMoveListener);
    }

    function initeMouseUpListener() {
      const listener = () => {
        isDrawingRef.current = false;
        prevPointRef.current = null;
      };
      mouseUpListenerRef.current = listener;
      window.addEventListener("mouseup", listener);
    }

    function computePointInCanvas(clientX: number, clientY: number) {
      // Compute the position of the pointer relative to the canvas and not the window.
      if (canvasRef.current) {
        const boundingRect = canvasRef.current.getBoundingClientRect();
        return {
          x: clientX - boundingRect.left,
          y: clientY - boundingRect.top,
        };
      } else {
        return null;
      }
    }

    function removeListeners() {
      if (mouseMoveListenerRef.current) {
        window.removeEventListener("mousemove", mouseMoveListenerRef.current);
      }
      if (mouseUpListenerRef.current) {
        window.removeEventListener("mouseup", mouseUpListenerRef.current);
      }
    }

    initMouseMoveListener();
    initeMouseUpListener();

    return () => {
      removeListeners();
    };
  }, [onDraw]);

  function setCanvasRef(ref: any) {
    canvasRef.current = ref;
  }

  function onMouseDown() {
    isDrawingRef.current = true;
  }

  return {
    setCanvasRef,
    onMouseDown,
  };
}
