import { MouseEvent } from "react";

export function setupCanvas(
  canvas: HTMLCanvasElement,
  canvasSize: number,
  callbacks?: {
    mousedown: (() => void)[];
  }
) {
  let xStart, yStart, xEnd, yEnd;
  let mousedown = false;
  const ctx = canvas.getContext("2d");
  ctx.canvas.width = canvasSize;
  ctx.canvas.height = canvasSize;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvasSize, canvasSize);
  ctx.lineWidth = 40;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.strokeStyle = "white";

  canvas.addEventListener("mousedown", (event) => {
    callbacks.mousedown?.forEach((callback) => callback());
    event.preventDefault();
    event.stopPropagation();
    xStart = event.offsetX;
    xEnd = xStart;
    yStart = event.offsetY;
    yEnd = yStart;
    mousedown = true;
    draw("mousedown");
  });
  canvas.addEventListener("mouseup", (event) => {
    mousedown = false;
  });
  canvas.addEventListener("mousemove", (event) => {
    if (mousedown) {
      xEnd = event.offsetX;
      yEnd = event.offsetY;
      draw("mousemove");
      xStart = xEnd;
      yStart = yEnd;
    }
  });
  canvas.addEventListener("mouseenter", () => {
    document.body.style.cursor = "crosshair";
  });
  canvas.addEventListener("mouseleave", () => {
    mousedown = false;
    document.body.style.cursor = "default";
  });

  function draw(event: MouseEvent["type"]) {
    if (event === "mousedown") {
      ctx.beginPath();
      ctx.moveTo(xStart, yStart);
      ctx.lineTo(xEnd, yEnd);
      ctx.stroke();
    } else if (event === "mousemove") {
      ctx.beginPath();
      ctx.moveTo(xStart, yStart);
      ctx.lineTo(xEnd, yEnd);
      ctx.stroke();
    }
  }
}
