import { select } from 'd3';

export interface Coords {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

export function extractLineCoords(el: SVGLineElement): Coords {
  const sel = select(el);

  return {
    x1: +sel.attr('x1'),
    x2: +sel.attr('x2'),
    y1: +sel.attr('y1'),
    y2: +sel.attr('y2'),
  };
}
