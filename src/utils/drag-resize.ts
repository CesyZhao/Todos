import { DomRect } from "../types/drag";

export const getDomRect = (target: HTMLElement) => {
  const { left, top, right, bottom, height, width, x, y } = target.getBoundingClientRect();
  return { left, top, right, bottom, height, width, x, y };
};


export const handleResizeRight = (target: HTMLElement, rect: DomRect, e: Event & MouseEvent) => {
  const { clientX } = e;

  rect.right = clientX;

  target.style.width = clientX - rect.left + 'px';
};

export const handleResizeLeft = (target: HTMLElement, rect: DomRect, e: Event & MouseEvent) => {
  const { clientX } = e;

  const offset = clientX - rect.left;

  rect.left += offset;
  rect.width -= offset;

  target.style.left = rect.left + 'px';
  target.style.width = rect.width + 'px';
};

export const handleResizeTop = (target: HTMLElement, rect: DomRect, e: Event & MouseEvent) => {
  const { clientY } = e;

  const offset = clientY - rect.top;

  rect.top += offset;
  rect.height -= offset;

  target.style.top = rect.top + 'px';
  target.style.height = rect.height + 'px';
}

export const handleResizeBottom = (target: HTMLElement, rect: DomRect, e: Event & MouseEvent) => {
  const { clientY } = e;

  rect.bottom = clientY;

  target.style.height = rect.bottom - rect.top + 'px';
}

export const handleResizeTopLeft = (target: HTMLElement, rect: DomRect, e: Event & MouseEvent) => {
  handleResizeTop(target, rect, e);
  handleResizeLeft(target, rect, e);
}

export const handleResizeTopRight = (target: HTMLElement, rect: DomRect, e: Event & MouseEvent) => {
  handleResizeTop(target, rect, e);
  handleResizeRight(target, rect, e);
}

export const handleResizeBottomRight = (target: HTMLElement, rect: DomRect, e: Event & MouseEvent) => {
  handleResizeBottom(target, rect, e);
  handleResizeRight(target, rect, e);
}

export const handleResizeBottomLeft = (target: HTMLElement, rect: DomRect, e: Event & MouseEvent) => {
  handleResizeBottom(target, rect, e);
  handleResizeLeft(target, rect, e);
}

let offsetX: number, offsetY: number

export const handleMove = (target: HTMLElement, rect: DomRect, e: Event & MouseEvent) => {
  const { clientX, clientY } = e;
  const { top: oldTop, left: oldLeft } =  rect;
  offsetX = offsetX || (clientX - oldLeft);
  offsetY = offsetY || (clientY - oldTop);

  const left = clientX - offsetX;
  const top = clientY - offsetY;

  target.style.left = left + 'px';
  target.style.top = top + 'px';

  rect.left = left;
  rect.top = top;
}

export const clearPosition = () => {
  offsetX = 0;
  offsetY = 0;
}