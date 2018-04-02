/**
 * Grid
 */

import { AxisScale } from 'd3-axis'
import { SimpleContext, SimpleSelection } from "../../helpers/index";
import { gridHorizontal, gridVertical, GridBase } from './index';

/**
 * Interface describing a 2-dimensional grid component.
 * The generic types <DomainX> and <DomainY> are the types of the X and Y domains respectively.
 * TODO: Doc blocks
 * TODO: Consider adding H/V variants to the API
 */
export interface Grid<DomainX, DomainY> {
  (context: SimpleContext): void
  scaleX(): AxisScale<DomainX>
  scaleX(_: AxisScale<DomainX>): this
  scaleY(): AxisScale<DomainY>
  scaleY(_: AxisScale<DomainY>): this
  direction(): string
  direction(_: string): this
  offsetStart(): [number, number]
  offsetStart(_: number): this
  offsetStart(_: [number, number]): this
  offsetEnd(): [number, number]
  offsetEnd(_: number): this
  offsetEnd(_: [number, number]): this
  hideEdges(): [boolean|string, boolean|string]
  hideEdges(_: boolean|string): this
  hideEdges(_: [boolean|string, boolean|string]): this
  ticks(): [number, number]
  ticks(_: number): this
  ticks(_: [number, number]): this
  tickValues(): [number[], number[]]
  tickValues(_: number[]): this
  tickValues(_: [number[], number[]]): this
}

export function grid<DomainX, DomainY>(scaleX: AxisScale<DomainX>, scaleY: AxisScale<DomainY>): Grid<DomainX, DomainY> {
  let gridH = gridHorizontal(scaleY),
      gridV = gridVertical(scaleX),
      direction: string = 'full',
      tickValuesH: number[] = null,
      tickValuesV: number[] = null

  const grid = <Grid<DomainX, DomainY>>function(context: SimpleContext): void {
    (direction === 'full' || direction === 'horizontal')
      ? gridH.tickValues(tickValuesH).range(scaleX.range())
      : gridH.tickValues([]);

    (direction === 'full' || direction === 'vertical')
      ? gridV.tickValues(tickValuesV).range(scaleY.range())
      : gridV.tickValues([]);

    // Call the underlying grids (needs type to avoid error, unsure why)
    (<SimpleSelection>context).call(gridH).call(gridV)
  }

  // API

  grid.scaleX = function(_?: AxisScale<DomainX>): any {
    return arguments.length ? (scaleX = _, gridV.scale(scaleX), this) : scaleX
  }

  grid.scaleY = function(_?: AxisScale<DomainY>): any {
      return arguments.length ? (scaleY = _, gridH.scale(scaleY), this) : scaleY
  }

  grid.direction = function(_?: string): any {
    return arguments.length ? (direction = _, this) : direction
  }

  grid.offsetStart = function(_?: number|[number, number]): any {
    if (!arguments.length) return [gridH.offsetStart(), gridV.offsetStart()]

    _ = Array.isArray(_) ? _ : [_, _]
    gridH.offsetStart(_[0])
    gridV.offsetStart(_[1])

    return this
  }

  grid.offsetEnd = function(_?: number|[number, number]): any {
    if (!arguments.length) return [gridH.offsetEnd(), gridV.offsetEnd()]

    _ = Array.isArray(_) ? _ : [_, _]
    gridH.offsetEnd(_[0])
    gridV.offsetEnd(_[1])
    
    return this
  }

  grid.hideEdges = function(_?: boolean|string|[boolean|string, boolean|string]): any {
    if (!arguments.length) return [gridH.hideEdges(), gridV.hideEdges()]

    _ = Array.isArray(_) ? _ : [_, _]
    gridH.hideEdges(_[0])
    gridV.hideEdges(_[1])
    
    return this
  }

  grid.ticks = function(_?: number|[number, number]): any {
    if (!arguments.length) return [gridH.ticks(), gridV.ticks()]

    _ = Array.isArray(_) ? _ : [_, _]
    gridH.ticks(_[0])
    gridV.ticks(_[1])
    
    return this
  }

  grid.tickValues = function(_?: number[]|[number[], number[]]): any {
    if (!arguments.length) return [tickValuesH, tickValuesV]

    _ = <[number[], number[]]>(Array.isArray(_[0]) ? _ : [_, _])
    tickValuesH = _[0]
    tickValuesV = _[1]
    
    return this
  }

  return grid
}
