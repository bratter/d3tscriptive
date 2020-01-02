/**
 * Grid
 */

import { AxisScale } from 'd3';
import { SimpleContext, SimpleSelection } from '../util/index';
import { gridHorizontal, gridVertical } from './grid-base';

/**
 * Interface describing a 2-dimensional grid component.
 * The generic types <DomainX> and <DomainY> are the types of the X and Y domains respectively.
 * TODO: Doc blocks
 * TODO: Consider adding H/V variants to the API
 */
export interface Grid<DomainX, DomainY> {
  (context: SimpleContext): void;
  scaleX(): AxisScale<DomainX>;
  scaleX(_: AxisScale<DomainX>): this;
  scaleY(): AxisScale<DomainY>;
  scaleY(_: AxisScale<DomainY>): this;
  direction(): string;
  direction(_: string): this;
  offsetStart(): [number, number];
  offsetStart(_: number): this;
  offsetStart(_: [number, number]): this;
  offsetEnd(): [number, number];
  offsetEnd(_: number): this;
  offsetEnd(_: [number, number]): this;
  hideEdges(): [boolean|string, boolean|string];
  hideEdges(_: boolean|string): this;
  hideEdges(_: [boolean|string, boolean|string]): this;
  ticks(): [number, number];
  ticks(_: number): this;
  ticks(_: [number, number]): this;
  tickValues(): [number[]|null, number[]|null];
  tickValues(_: number[]): this;
  tickValues(_: [number[], number[]]): this;
}

export function grid<DomainX, DomainY>(
  initialScaleX: AxisScale<DomainX>,
  initialScaleY: AxisScale<DomainY>,
): Grid<DomainX, DomainY> {
  const gridH = gridHorizontal(initialScaleY);
  const gridV = gridVertical(initialScaleX);
  let scaleX = initialScaleX;
  let scaleY = initialScaleY;
  let direction = 'full';
  let tickValuesH: number[]|null = null;
  let tickValuesV: number[]|null = null;

  const grid = function (context: SimpleContext): void {
    if (direction === 'full' || direction === 'horizontal') {
      gridH.tickValues(tickValuesH).range(scaleX.range());
    } else {
      gridH.tickValues([]);
    }

    if (direction === 'full' || direction === 'vertical') {
      gridV.tickValues(tickValuesV).range(scaleY.range());
    } else {
      gridV.tickValues([]);
    }

    // Call the underlying grids (needs type to avoid error, unsure why)
    (context as SimpleSelection).call(gridH).call(gridV);
  } as Grid<DomainX, DomainY>;

  // API

  grid.scaleX = function (_?: AxisScale<DomainX>): any {
    return _ !== undefined ? (scaleX = _, gridV.scale(scaleX), this) : scaleX;
  };

  grid.scaleY = function (_?: AxisScale<DomainY>): any {
    return _ !== undefined ? (scaleY = _, gridH.scale(scaleY), this) : scaleY;
  };

  grid.direction = function (_?: string): any {
    return _ !== undefined ? (direction = _, this) : direction;
  };

  grid.offsetStart = function (_?: number|[number, number]): any {
    if (_ === undefined) return [gridH.offsetStart(), gridV.offsetStart()];

    const asArray = Array.isArray(_) ? _ : [_, _];
    gridH.offsetStart(asArray[0]);
    gridV.offsetStart(asArray[1]);

    return this;
  };

  grid.offsetEnd = function (_?: number|[number, number]): any {
    if (_ === undefined) return [gridH.offsetEnd(), gridV.offsetEnd()];

    const asArray = Array.isArray(_) ? _ : [_, _];
    gridH.offsetEnd(asArray[0]);
    gridV.offsetEnd(asArray[1]);

    return this;
  };

  grid.hideEdges = function (_?: boolean|string|[boolean|string, boolean|string]): any {
    if (_ === undefined) return [gridH.hideEdges(), gridV.hideEdges()];

    const asArray = Array.isArray(_) ? _ : [_, _];
    gridH.hideEdges(asArray[0]);
    gridV.hideEdges(asArray[1]);

    return this;
  };

  grid.ticks = function (_?: number|[number, number]): any {
    if (_ === undefined) return [gridH.ticks(), gridV.ticks()];

    const asArray = Array.isArray(_) ? _ : [_, _];
    gridH.ticks(asArray[0]);
    gridV.ticks(asArray[1]);

    return this;
  };

  grid.tickValues = function (_?: number[]|[number[], number[]]): any {
    if (_ === undefined) return [tickValuesH, tickValuesV];

    const asArrays = (Array.isArray(_[0]) ? _ : [_, _]) as [number[], number[]];
    [tickValuesH, tickValuesV] = asArrays;

    return this;
  };

  return grid;
}
