// TODO: Fix typings, then remove this disable block
/* eslint-disable no-underscore-dangle */
// TODO: Consider replacing __grid with a Symbol then removing this block
/* eslint-disable @typescript-eslint/ban-ts-ignore */
// TODO: Modify the positioning attachment functions then remove this block
/* eslint-disable no-param-reassign */
/* eslint-disable no-cond-assign */

/**
 * GridBase
 */

import { BaseType, ValueFn, AxisScale } from 'd3';
import { classArray } from '../util/classes';
import { SimpleContext, selectionFromContext, SimpleTransition } from '../util/selection';

/**
 * Type to allow attaching a positioning function to the element
 */
type GridType = BaseType & { parentNode: GridType; __grid: any };

/**
 * Patch the AxisScale in d3-axis module with optional ticks method
 * See module augmention in https://www.typescriptlang.org/docs/handbook/declaration-merging.html
 * TODO: Potentially move this patch to a helper if it is needed elsewhere
 */
declare module 'd3-axis' {
  interface AxisScale<Domain> {
    ticks?(_?: number): number[];
    round?(): boolean;
    round?(round: boolean): this;
  }
}

// Opacity for fade in/out
const EPSILON = 1e-6;

// Direction orientations
const DIR = {
  H: 'horizontal',
  V: 'vertical',
};

// Default positioning function for continuous scales
// The +0.5 avoids anti-aliasing artifacts
function number<Domain>(scale: AxisScale<Domain>): (d: Domain) => number {
  // @ts-ignore
  return (d: Domain): number => +scale(d) + 0.5;
}

// Replacement positioning function for banded scales
// Also adjusted for anti-aliasing
function center<Domain>(scale: AxisScale<Domain>): (d: Domain) => number {
  // @ts-ignore
  let offset = Math.max(0, scale.bandwidth() - 1) / 2;

  // @ts-ignore
  if (scale.round()) offset = Math.round(offset);
  // @ts-ignore
  return (d: Domain): number => +scale(d) + offset + 0.5;
}

/**
 * Interface defining a base grid component.
 * The generic <Domain> is the type of the grid domain.
 * TODO: Doc comments for interface elements
 * TODO: Determine if should make ticks overloads fully compatible with axis implementations
 * TODO: Cap offsetStart/End at the range so it doesn't extend over the edge
 */
export interface GridBase<Domain> {
  (context: SimpleContext): void;
  scale(): AxisScale<Domain>;
  scale(_: AxisScale<Domain>): this;
  range(): number[];
  range(_: number[]): this;
  offsetStart(): number;
  offsetStart(_: number): this;
  offsetEnd(): number;
  offsetEnd(_: number): this;
  hideEdges(): boolean|string;
  hideEdges(_: boolean|string): this;
  ticks(): number;
  ticks(_: number): this;
  tickValues(): number[];
  tickValues(_: number[]|null|undefined): this;
}

// TODO: Change AxisScale generic to Domain, then fix the transition functions
export function gridBase<Domain>(orient: string, initialScale: AxisScale<any>): GridBase<Domain> {
  let scale = initialScale;
  let range = [0, 1];
  let offsetStart = 0;
  let offsetEnd = 0;
  let hideEdges: boolean|string = false;
  let ticks: number|null = null;
  let tickValues: number[]|null = null;

  const classArr = classArray('grid', orient);
  const x = orient === DIR.H ? 'x' : 'y';
  const y = orient === DIR.H ? 'y' : 'x';

  // Helpers

  function scaleTicks(): number[] {
    return (scale.ticks
      // eslint-disable-next-line prefer-spread
      ? scale.ticks.apply(scale, ticks ? [ticks] : [])
      : scale.domain()
    ).slice();
  }

  function getValues(): number[] {
    const hideFirst = hideEdges === true || hideEdges === 'both' || hideEdges === 'first';
    const hideLast = hideEdges === true || hideEdges === 'both' || hideEdges === 'last';
    const values = tickValues === null ? scaleTicks() : tickValues.slice();

    if (hideFirst) values.shift();
    if (hideLast) values.pop();

    return values;
  }

  const gridBase = function (context: SimpleContext): void {
    const values = getValues();
    const position = (scale.bandwidth ? center : number)(scale.copy());
    const k = range[range.length - 1] >= range[0] ? 1 : -1;
    const selection = selectionFromContext(context);
    const initContainer = selection.selectAll<GridType, any>(classArr.asSelector()).data([null]);
    const container = initContainer.merge(
      initContainer.enter().append<GridType>('g').attr('class', classArr.asList()),
    );
    let line: SimpleContext = container.selectAll('line').data(values, scale as ValueFn<BaseType, any, any>).order();
    let lineExit: SimpleContext = line.exit();
    let lineEnter = line.enter().append('line').attr('stroke', '#000');

    // TODO: Fix typing
    // @ts-ignore
    line = line.merge(lineEnter);

    // If context is a transition, then animate the lines
    // TODO: Type guard for Transition type
    if (context !== selection) {
      line = line.transition(context as SimpleTransition);

      // TODO: Fix typing in first function for both exit and enter
      lineExit = lineExit.transition(context as SimpleTransition)
        .attr('opacity', EPSILON)
        // @ts-ignore
        .attr(`${y}1`, function (this: Element, d: number) { return Number.isFinite(d = position(d)) ? d : this.getAttribute(`${y}1`); })
        .attr(`${y}2`, function (this: Element, d: number) { return Number.isFinite(d = position(d)) ? d : this.getAttribute(`${y}2`); });

      lineEnter = lineEnter
        .attr('opacity', EPSILON)
        // @ts-ignore
        .attr(`${y}1`, function (this: GridType, d: number) { let p = this.parentNode.__grid; return p && Number.isFinite(p = p(d)) ? p : position(d); })
        .attr(`${y}2`, function (this: GridType, d: number) { let p = this.parentNode.__grid; return p && Number.isFinite(p = p(d)) ? p : position(d); });
    }

    lineExit.remove();

    line
      .attr('opacity', 1)
      .attr(`${x}1`, +range[0] - k * offsetStart)
      .attr(`${x}2`, +range[range.length - 1] + k * offsetEnd)
      .attr(`${y}1`, (d) => position(d))
      .attr(`${y}2`, (d) => position(d));

    // Attach the positioning function to the container
    // so it can be referenced in future animations
    // cannot use arrow function as this must be bound correctly
    container.each(function () { this.__grid = position; });
  } as GridBase<Domain>;

  // API

  gridBase.scale = function (_?: AxisScale<Domain>): any {
    return _ !== undefined ? (scale = _, this) : scale;
  };

  gridBase.range = function (_?: number[]): any {
    return _ !== undefined ? (range = _, this) : range;
  };

  gridBase.offsetStart = function (_?: number): any {
    return _ !== undefined ? (offsetStart = _, this) : offsetStart;
  };

  gridBase.offsetEnd = function (_?: number): any {
    return _ !== undefined ? (offsetEnd = _, this) : offsetEnd;
  };

  gridBase.hideEdges = function (_?: boolean|string): any {
    return _ !== undefined ? (hideEdges = _, this) : hideEdges;
  };

  gridBase.ticks = function (_?: number): any {
    return _ !== undefined ? (ticks = _, this) : ticks;
  };

  gridBase.tickValues = function (_?: number[]|null|undefined): any {
    return _ !== undefined
      ? (tickValues = _ == null ? null : [..._].slice(), this)
      : tickValues && tickValues.slice();
  };

  return gridBase;
}

export function gridHorizontal<Domain>(scale: AxisScale<Domain>): GridBase<Domain> {
  return gridBase<Domain>(DIR.H, scale);
}

export function gridVertical<Domain>(scale: AxisScale<Domain>): GridBase<Domain> {
  return gridBase<Domain>(DIR.V, scale);
}
