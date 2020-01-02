/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable object-curly-newline */

/**
 * GridBase Test Suite
 */

import {
  select,
  BaseType,
  scaleLinear,
  ScaleContinuousNumeric,
} from 'd3';
import { Grid, grid } from '.';
import { SvgFixture } from '../../test/fixtures';
import { Coords, extractLineCoords } from '../../test/util';
import { SimpleSelection } from '../util';

describe('grid', () => {
  const f = new SvgFixture();
  let container: SimpleSelection;
  let scaleX: ScaleContinuousNumeric<any, any>;
  let scaleY: ScaleContinuousNumeric<any, any>;
  let tickValues: number[];
  let grid2D: Grid<any, any>;
  const lineNodes = (dir?: string): BaseType[] => container.selectAll(`.grid${dir ? `.${dir}` : ''} line`).nodes();
  // TODO: See note in grid-base-test regarding fixing types
  // @ts-ignore
  const actualLineCoords = (dir?: string): Coords[] => lineNodes(dir).map(extractLineCoords);

  beforeEach(() => {
    container = select(f.setup() as BaseType);
    scaleX = scaleLinear().domain([0, 2]).range([0, 50]);
    scaleY = scaleLinear().domain([0, 2]).range([100, 150]);
    tickValues = [0, 1, 2];
    grid2D = grid(scaleX, scaleY).tickValues(tickValues);
  });

  afterEach(() => {
    f.teardown();
  });

  it('should render a h and v container group with the correct classes', () => {
    container.call(grid2D);

    const expected = 1;
    const actualH = container.selectAll('g.grid.horizontal').nodes();
    const actualV = container.selectAll('g.grid.vertical').nodes();

    expect(actualH).toHaveLength(expected);
    expect(actualV).toHaveLength(expected);
  });

  it('should render the correct number of gridlines when direction is full', () => {
    container.call(grid2D);

    const expected = tickValues.length;
    const actualH = lineNodes('horizontal');
    const actualV = lineNodes('vertical');

    expect(actualH).toHaveLength(expected);
    expect(actualV).toHaveLength(expected);
  });

  it('should render the correct number of gridlines when direction is horizontal', () => {
    container.call(grid2D.direction('horizontal'));

    const expectedH = tickValues.length;
    const expectedV = 0;
    const actualH = lineNodes('horizontal');
    const actualV = lineNodes('vertical');

    expect(actualH).toHaveLength(expectedH);
    expect(actualV).toHaveLength(expectedV);
  });

  it('should render the correct number of gridlines when direction is vertical', () => {
    container.call(grid2D.direction('vertical'));

    const expectedH = 0;
    const expectedV = tickValues.length;
    const actualH = lineNodes('horizontal');
    const actualV = lineNodes('vertical');

    expect(actualH).toHaveLength(expectedH);
    expect(actualV).toHaveLength(expectedV);
  });

  it('should render the correct number of gridlines when hideEdges is first', () => {
    container.call(grid2D.hideEdges('first'));
    expect(lineNodes('horizontal')).toHaveLength(2);
    expect(lineNodes('vertical')).toHaveLength(2);
  });

  it('should render the correct number of gridlines when hideEdges is last', () => {
    container.call(grid2D.hideEdges('last'));
    expect(lineNodes('horizontal')).toHaveLength(2);
    expect(lineNodes('vertical')).toHaveLength(2);
  });

  it('should render the correct number of gridlines when hideEdges is both', () => {
    container.call(grid2D.hideEdges('both'));
    expect(lineNodes('horizontal')).toHaveLength(1);
    expect(lineNodes('vertical')).toHaveLength(1);
  });

  it('should render the correct number of gridlines when hideEdgesH is used', () => {
    container.call(grid2D.hideEdges(['both', false]));
    expect(lineNodes('horizontal')).toHaveLength(1);
    expect(lineNodes('vertical')).toHaveLength(3);
  });

  it('should render the correct number of gridlines when hideEdgesV is used', () => {
    container.call(grid2D.hideEdges([false, 'both']));
    expect(lineNodes('horizontal')).toHaveLength(3);
    expect(lineNodes('vertical')).toHaveLength(1);
  });

  it('should render tickValues properly', () => {
    const ticksH = [0, 0.1];
    const ticksV = [0.2, 0.3, 0.4, 0.5];

    container.call(grid2D.tickValues([ticksH, ticksV]));
    expect(lineNodes('horizontal')).toHaveLength(ticksH.length);
    expect(lineNodes('vertical')).toHaveLength(ticksV.length);
  });

  describe('positioning', () => {
    let expectedCoordsH: Coords[];
    let expectedCoordsV: Coords[];

    beforeEach(() => {
      expectedCoordsH = [
        { x1: 0, x2: 50, y1: 100.5, y2: 100.5 },
        { x1: 0, x2: 50, y1: 125.5, y2: 125.5 },
        { x1: 0, x2: 50, y1: 150.5, y2: 150.5 },
      ];
      expectedCoordsV = [
        { x1: 0.5, x2: 0.5, y1: 100, y2: 150 },
        { x1: 25.5, x2: 25.5, y1: 100, y2: 150 },
        { x1: 50.5, x2: 50.5, y1: 100, y2: 150 },
      ];
    });

    it('should position both the horizontal and vertical gridlines correctly', () => {
      container.call(grid2D);
      expect(actualLineCoords('horizontal')).toEqual(expectedCoordsH);
      expect(actualLineCoords('vertical')).toEqual(expectedCoordsV);
    });

    it('should position the gridlines correctly when offsetStart is set', () => {
      const expectedH = expectedCoordsH.map((d) => ({ ...d, x1: -10 }));
      const expectedV = expectedCoordsV.map((d) => ({ ...d, y1: 95 }));

      container.call(grid2D.offsetStart([10, 5]));
      expect(actualLineCoords('horizontal')).toEqual(expectedH);
      expect(actualLineCoords('vertical')).toEqual(expectedV);
    });

    it('should position the gridlines correctly when offsetEnd is set', () => {
      const expectedH = expectedCoordsH.map((d) => ({ ...d, x2: 60 }));
      const expectedV = expectedCoordsV.map((d) => ({ ...d, y2: 155 }));

      container.call(grid2D.offsetEnd([10, 5]));
      expect(actualLineCoords('horizontal')).toEqual(expectedH);
      expect(actualLineCoords('vertical')).toEqual(expectedV);
    });
  });

  describe('API', () => {
    it('should have an X and Y scale accessor that defaults to constructor value', () => {
      const newScaleX = scaleLinear();
      const newScaleY = scaleLinear();

      expect(grid2D.scaleX()).toBe(scaleX);
      expect(grid2D.scaleY()).toBe(scaleY);
      expect(grid2D.scaleX(newScaleX)).toBe(grid2D);
      expect(grid2D.scaleY(newScaleY)).toBe(grid2D);
      expect(grid2D.scaleX()).toBe(newScaleX);
      expect(grid2D.scaleY()).toBe(newScaleY);
    });

    it('should have a direction accessor that defaults to full ', () => {
      const previous = 'full';
      const next = 'vertical';

      expect(grid2D.direction()).toBe(previous);
      expect(grid2D.direction(next)).toBe(grid2D);
      expect(grid2D.direction()).toBe(next);
    });

    it('should have an offsetStart accessor that defaults to 0 and sets H and V values together or independently', () => {
      const previous = [0, 0];
      const nextSingle = [10, 10];
      const nextTuple: [number, number] = [5, 15];

      expect(grid2D.offsetStart()).toEqual(previous);
      expect(grid2D.offsetStart(nextSingle[0])).toBe(grid2D);
      expect(grid2D.offsetStart()).toEqual(nextSingle);
      grid2D.offsetStart(nextTuple);
      expect(grid2D.offsetStart()).toEqual(nextTuple);
    });

    it('should have an offsetEnd accessor that defaults to 0 and sets H and V values together or independently', () => {
      const previous = [0, 0];
      const nextSingle = [10, 10];
      const nextTuple: [number, number] = [5, 15];

      expect(grid2D.offsetEnd()).toEqual(previous);
      expect(grid2D.offsetEnd(nextSingle[0])).toBe(grid2D);
      expect(grid2D.offsetEnd()).toEqual(nextSingle);
      grid2D.offsetEnd(nextTuple);
      expect(grid2D.offsetEnd()).toEqual(nextTuple);
    });

    it('should have a hideEdges accessor that defaults to false and sets H and V values together or independently', () => {
      const previous = [false, false];
      const nextSingle = ['both', 'both'];
      const nextTuple: [boolean|string, boolean|string] = [true, 'first'];

      expect(grid2D.hideEdges()).toEqual(previous);
      expect(grid2D.hideEdges(nextSingle[0])).toBe(grid2D);
      expect(grid2D.hideEdges()).toEqual(nextSingle);
      grid2D.hideEdges(nextTuple);
      expect(grid2D.hideEdges()).toEqual(nextTuple);
    });

    it('should have a ticks accessor that defaults to null and sets H and V values together or independently', () => {
      const previous = [null, null];
      const nextSingle = [1, 1];
      const nextTuple: [number, number] = [5, 10];

      expect(grid2D.ticks()).toEqual(previous);
      expect(grid2D.ticks(nextSingle[0])).toBe(grid2D);
      expect(grid2D.ticks()).toEqual(nextSingle);
      grid2D.ticks(nextTuple);
      expect(grid2D.ticks()).toEqual(nextTuple);
    });
  });

  it('should have a tickValues accessor that defaults to null and sets H and V values together or independently', () => {
    const previous = [null, null];
    const nextSingle = [[0, 1, 2], [0, 1, 2]];
    const nextTuple: [number[], number[]] = [[3, 4, 5], [6, 7, 8]];

    // Recreate grid as we use tickValues in beforeEach
    grid2D = grid(scaleX, scaleY);

    expect(grid2D.tickValues()).toEqual(previous);
    expect(grid2D.tickValues(nextSingle[0])).toBe(grid2D);
    expect(grid2D.tickValues()).toEqual(nextSingle);
    grid2D.tickValues(nextTuple);
    expect(grid2D.tickValues()).toEqual(nextTuple);
  });
});
