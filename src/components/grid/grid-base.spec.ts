/**
 * GridBase Test Suite
 */

import { Fixtures } from '../../../test/fixtures'
import { select, selectAll } from 'd3-selection'
import { scaleLinear } from 'd3-scale'
import { AxisScale } from 'd3-axis'
import { GridBase, gridHorizontal } from './'
import { SimpleSelection } from '../../helpers'

describe('gridHorizontal', () => {
  let f = new Fixtures(),
      container: SimpleSelection,
      scale: AxisScale<any>,
      grid: GridBase<any>

  beforeEach(() => {
    f.svg()
    container = select('.test-svg')
    scale = scaleLinear().domain([0, 2]).range([0, 100])
    grid = gridHorizontal(scale)
  })

  afterEach(() => {
    f.teardown()
  })

  it('should return a generator function from the constructor', () => {
    expect(typeof grid === 'function').toBeTruthy()
  })

  describe('on render with selection', () => {
    it('should render a container group with the correct classes when passed a selection', () => {
      container.call(grid)

      let expected = 1,
          actual = container.selectAll('g.grid.horizontal').nodes().length

      expect(actual).toBe(expected)
    })
  })

  describe('API', () => {
    it('should have a scale accessor that defaults to the constructor value', () => {
      let previous = scale,
          newScale = scaleLinear();

      expect(grid.scale()).toBe(scale);
      expect(grid.scale(newScale)).toBe(grid);
      expect(grid.scale()).toBe(newScale);
    });
  })
})
