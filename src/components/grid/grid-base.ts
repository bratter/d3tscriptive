/**
 * GridBase
 */

import { BaseType, ValueFn } from 'd3-selection'
import { Transition } from 'd3-transition'
import { AxisScale } from 'd3-axis'
import { classArray } from '../../helpers/classes'
import { SimpleContext, selectionFromContext, SimpleTransition } from '../../helpers/selection' 
import { Domain } from 'domain';

/**
 * Type to allow attaching a positioning function to the element
 */
type GridType = BaseType & { parentNode: GridType, __grid: any }

/**
 * Patch the AxisScale in d3-axis module with optional ticks method
 * See module augmention in https://www.typescriptlang.org/docs/handbook/declaration-merging.html
 * TODO: Potentially move this patch to a helper if it is needed elsewhere
 */
declare module 'd3-axis' {
  interface AxisScale<Domain> {
    ticks?(_?: number): number[]
    round?(): boolean
    round?(round: boolean): this
  }
}

// Opacity for fade in/out
const EPSILON = 1e-6

// Direction orientations
const DIR = {
  H: 'horizontal',
  V: 'vertical',
}

// Default positioning function for continuous scales
// The +0.5 avoids anti-aliasing artifacts
function number<Domain>(scale: AxisScale<Domain>): (d: Domain) => number {
  return (d: Domain) => +scale(d) + 0.5;
}

// Replacement positioning function for banded scales
// Also adjusted for anti-aliasing
function center<Domain>(scale: AxisScale<Domain>): (d: Domain) => number {
  let offset = Math.max(0, scale.bandwidth() - 1) / 2;

  if (scale.round()) offset = Math.round(offset);
  return (d: Domain) => +scale(d) + offset + 0.5;
}

/**
 * Interface defining a base grid component.
 * The generic <Domain> is the type of the grid domain.
 * TODO: Doc comments for interface elements
 * TODO: Determine if should make ticks overloads fully compatible with axis implementations
 * TODO: Cap offsetStart/End at the range so it doesn't extend over the edge
 */
export interface GridBase<Domain> {
  (context: SimpleContext): void
  scale(): AxisScale<Domain>
  scale(_: AxisScale<Domain>): this
  range(): number[]
  range(_: number[]): this
  offsetStart(): number
  offsetStart(_: number): this
  offsetEnd(): number
  offsetEnd(_: number): this
  hideEdges(): boolean|string
  hideEdges(_: boolean|string): this
  ticks(): number
  ticks(_: number): this
  tickValues(): number[]
  tickValues(_: number[]): this
}

// TODO: Change AxisScale generic to Domain, then fix the transition functions
export function gridBase<Domain>(orient: string, scale: AxisScale<any>): GridBase<Domain> {
  let range = [0, 1],
      offsetStart = 0,
      offsetEnd = 0,
      hideEdges: boolean|string = false,
      ticks: number = null,
      tickValues: number[] = null,

      classArr = classArray('grid', orient),
      x = orient === DIR.H ? 'x' : 'y',
      y = orient === DIR.H ? 'y' : 'x'

  const gridBase = <GridBase<Domain>>function(context: SimpleContext): void {
    let values = getValues(),
        position = (scale.bandwidth ? center : number)(scale.copy()),
        k = range[range.length - 1] >= range[0]? 1 : -1,
        selection = selectionFromContext(context),
        initContainer = selection.selectAll<GridType, any>(classArr.asSelector()).data([null]),
        container = initContainer.merge(
          initContainer.enter().append<GridType>('g').attr('class', classArr.asList())
        ),
        line: SimpleContext = container.selectAll('line').data(values, <ValueFn<BaseType, any, any>>scale).order(),
        lineExit: SimpleContext = line.exit(),
        lineEnter = line.enter().append('line').attr('stroke', '#000')
    
    line = line.merge(lineEnter);

    // If context is a transition, then animate the lines
    if (context !== selection) {
      line = line.transition(<SimpleTransition>context);

      lineExit = lineExit.transition(<SimpleTransition>context)
        .attr('opacity', EPSILON)
        .attr(y + '1', function(this: Element, d: number) { return isFinite(d = position(d)) ? d : this.getAttribute(y + '1') })
        .attr(y + '2', function(this: Element, d: number) { return isFinite(d = position(d)) ? d : this.getAttribute(y + '2') })

      lineEnter = lineEnter
        .attr('opacity', EPSILON)
        .attr(y + '1', function(this: GridType, d: number) { let p = this.parentNode.__grid; return p && isFinite(p = p(d)) ? p : position(d); })
        .attr(y + '2', function(this: GridType, d: number) { let p = this.parentNode.__grid; return p && isFinite(p = p(d)) ? p : position(d); })
    }

    lineExit.remove();

    line
      .attr('opacity', 1)
      .attr(x + '1', +range[0] - k * offsetStart)
      .attr(x + '2', +range[range.length - 1] + k * offsetEnd)
      .attr(y + '1', d => position(d))
      .attr(y + '2', d => position(d))

    // Attach the positioning function to the container 
    // so it can be referenced in future animations
    // cannot use arrow function as this must be bound correctly
    container.each(function() { this.__grid = position; })
  }

  // Helpers

  function getValues(): number[] {
    let hideFirst = hideEdges === true || hideEdges === 'both' || hideEdges === 'first',
        hideLast = hideEdges === true || hideEdges === 'both' || hideEdges === 'last',
        values = tickValues === null ? scaleTicks() : tickValues.slice()

    if (hideFirst) values.shift()
    if (hideLast) values.pop()

    return values
  }

  function scaleTicks(): number[] {
      return (scale.ticks 
          ? scale.ticks.apply(scale, ticks ? [ticks] : []) 
          : scale.domain()
      ).slice()
  }

  // API

  gridBase.scale = function(_?: AxisScale<Domain>): any {
    return arguments.length ? (scale = _, this) : scale
  }

  gridBase.range = function(_?: number[]): any {
    return arguments.length ? (range = _, this) : range
  }

  gridBase.offsetStart = function(_?: number): any {
    return arguments.length ? (offsetStart = _, this) : offsetStart
  }

  gridBase.offsetEnd = function(_?: number): any {
    return arguments.length ? (offsetEnd = _, this) : offsetEnd
  }

  gridBase.hideEdges = function(_?: boolean|string): any {
    return arguments.length ? (hideEdges = _, this) : hideEdges
  }

  gridBase.ticks = function(_?: number): any {
    return arguments.length ? (ticks = _, this) : ticks
  }

  gridBase.tickValues = function(_?: number[]): any {
    return arguments.length ? (tickValues = _ == null ? null : [..._].slice(), this) : tickValues && tickValues.slice()
  }

  return gridBase
}

export function gridHorizontal<Domain>(scale: AxisScale<Domain>): GridBase<Domain> {
  return gridBase<Domain>(DIR.H, scale)
}

export function gridVertical<Domain>(scale: AxisScale<Domain>): GridBase<Domain> {
  return gridBase<Domain>(DIR.V, scale);
}
