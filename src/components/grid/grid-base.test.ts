/**
 * GridBase Test Suite
 */

import { Fixtures } from '../../../test/fixtures'
import { select, selectAll, BaseType } from 'd3-selection'
// Import d3-transition for the side effect of enabling selection.transition()
import 'd3-transition'
import { ScaleLinear, scaleLinear, ScaleOrdinal, scaleOrdinal, scaleBand, ScaleBand } from 'd3-scale'
import { AxisScale } from 'd3-axis'
import { SimpleSelection } from '../../util'
import { GridBase, gridHorizontal, gridVertical } from './'

function extractLineCoords(el: SVGLineElement) {
  let sel = select(el);

  return {
      x1: +sel.attr('x1'),
      x2: +sel.attr('x2'),
      y1: +sel.attr('y1'),
      y2: +sel.attr('y2')
  } 
}

describe.skip('gridBase', () => {
  let f = new Fixtures(),
      container: SimpleSelection<BaseType>,
      lineNodes = (dir?: string) => container.selectAll(`.grid${dir ? '.' + dir : ''} line`).nodes(),
      actualLineCoords = (dir?: string) => lineNodes(dir).map(extractLineCoords),
      scale: ScaleLinear<number, number>,
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

  // TODO: Consider testing that correct lines are added/kept/removed, not just that the count is correct
  describe('on render with selection', () => {
    it('should render a container group with the correct classes when passed a selection', () => {
      container.call(grid)

      let expected = 1,
          actual = container.selectAll('g.grid.horizontal').nodes().length

      expect(actual).toBe(expected)
    })

    it('should append lines using scale.ticks when scale has a ticks method', () => {
      spyOn(scale, 'ticks').and.callThrough()
      container.call(grid)

      let expected = scale.ticks().length,
          actual = lineNodes().length

      expect(scale.ticks).toHaveBeenCalledTimes(2)
      expect(actual).toEqual(expected)
    })

    it('should append lines using scale.domain when ticks is not present', () => {
      let domain = [0, 1, 2, 3],
          ordinal = scaleOrdinal<number, number>().domain(domain)

      spyOn(ordinal, 'domain').and.callThrough()
      container.call(grid.scale(ordinal))
      
      let expected = domain.length,
          actual = lineNodes().length

      expect(ordinal.domain).toHaveBeenCalledTimes(1)
      expect(actual).toEqual(expected)
    })

    it('should append lines using tickValues when tickValues is supplied', () => {
      let tickValues = [0, 1, 2]

      spyOn(scale, 'ticks').and.callThrough()
      spyOn(scale, 'domain').and.callThrough()
      container.call(grid.tickValues(tickValues))

      let expected = tickValues.length,
          actual = lineNodes().length

      // Domain is called by scale.copy, so needs to be called once to set the position function
      expect(scale.ticks).not.toHaveBeenCalled()
      expect(scale.domain).toHaveBeenCalledTimes(1)
      expect(actual).toEqual(expected)
    })

    it('should add new lines on re-render', () => {
      let oldActual,
          newActual,
          oldTicks = [0, 1],
          newTicks = [0, 1, 2, 3];

      container.call(grid.tickValues(oldTicks));
      oldActual = lineNodes().length;
      container.call(grid.tickValues(newTicks));
      newActual = lineNodes().length;

      expect(oldActual).toEqual(oldTicks.length);
      expect(newActual).toEqual(newTicks.length);
    })

    it('should remove unused lines on re-render', () => {
      let oldActual,
          newActual,
          oldTicks = [0, 1, 2, 3],
          newTicks = [0, 1];

      container.call(grid.tickValues(oldTicks));
      oldActual = lineNodes().length;
      container.call(grid.tickValues(newTicks));
      newActual = lineNodes().length;

      expect(oldActual).toEqual(oldTicks.length);
      expect(newActual).toEqual(newTicks.length);
    })

    describe('positioning', () => {
      let tickValues, range, expectedCoords

      beforeEach(() => {
        tickValues = [0, 1, 2]
        range = [0, 50]
        expectedCoords = [
            { x1: 0, x2: 50, y1: 0.5, y2: 0.5 },
            { x1: 0, x2: 50, y1: 50.5, y2: 50.5 },
            { x1: 0, x2: 50, y1: 100.5, y2: 100.5 }
        ]

        grid.tickValues(tickValues).range(range);
      })

      it('should render lines in the correct position with black stroke and full opacity', () => {
        container.call(grid);

        let line = container.selectAll('.grid line'),
            expectedStroke = '#000',
            actualStroke = line.attr('stroke'),
            expectedOpacity = 1,
            actualOpacity = +line.attr('opacity');

        expect(actualStroke).toEqual(expectedStroke);
        expect(actualOpacity).toEqual(expectedOpacity);
        expect(actualLineCoords()).toEqual(expectedCoords);
      })

      // TODO: Check anti-aliasing behavior compared to d3.axis
      it('should render lines correctly with bandwidth scale', () => {
        let band = scaleBand().domain(['a', 'b', 'c']).range([0, 120]),
            expected = [
                { x1: 0, x2: 50, y1: 20, y2: 20 },
                { x1: 0, x2: 50, y1: 60, y2: 60 },
                { x1: 0, x2: 50, y1: 100, y2: 100 }
            ]

        container.call(grid.tickValues(null).scale(band))
        expect(actualLineCoords()).toEqual(expected)
      })

      it('should render lines correctly when offsetStart set', () => {
        let expected = expectedCoords.map(d => ({ ...d, x1: -10 }))
        
        container.call(grid.offsetStart(10))
        expect(actualLineCoords()).toEqual(expected)
      })
      
      it('should render lines correctly when offsetStart set and range is reversed', () => {
          let expected = expectedCoords.map(d => ({ ...d, x1: 60, x2: 0 }))

          container.call(grid.range([50, 0]).offsetStart(10))
          expect(actualLineCoords()).toEqual(expected)
      })

      it('should render lines correctly when offsetEnd set', () => {
        let expected = expectedCoords.map(d => ({ ...d, x2: 60 }))

        container.call(grid.offsetEnd(10))
        expect(actualLineCoords()).toEqual(expected)
      })

      it('should render lines correctly when offsetEnd set and range is reversed', () => {
          let expected = expectedCoords.map(d => ({ ...d, x1: 50, x2: -10 }))

          container.call(grid.range([50, 0]).offsetEnd(10))
          expect(actualLineCoords()).toEqual(expected)
      })

      it('should hide the first line when hideEdges is set to first', () => {
        container.call(grid.hideEdges('first'))
        expectedCoords.shift()

        expect(actualLineCoords()).toEqual(expectedCoords)
      })
      
      it('should hide the last line when hideEdges is set to last', () => {
          container.call(grid.hideEdges('last'))
          expectedCoords.pop()

          expect(actualLineCoords()).toEqual(expectedCoords);
      })
      
      it('should hide the first and last lines when hideEdges is set to both', () => {
          container.call(grid.hideEdges('both'))
          expectedCoords.shift()
          expectedCoords.pop()

          expect(actualLineCoords()).toEqual(expectedCoords);
      })

      it('should hide the first and last lines when hideEdges is set to true', () => {
          container.call(grid.hideEdges('both'))
          expectedCoords.shift()
          expectedCoords.pop()

          expect(actualLineCoords()).toEqual(expectedCoords)
      })
    })
  })

  // TODO: Consider adding tests to confirm correct positioning animation
  describe('on render with transition', () => {
    let transition

    beforeEach(() => {
        transition = container.transition().duration(1)
    })

    it('should render the container and lines when passed a transition', () => {
      let tickValues = [0, 1, 2],
          expectedContainer = 1

      transition.call(grid.tickValues(tickValues))

      expect(container.selectAll('g.grid.horizontal').nodes().length).toBe(expectedContainer)
      expect(lineNodes().length).toBe(tickValues.length)
    })

    it('should add new lines on animated re-render', (done) => {
      let newActual,
          oldTicks = [0, 1],
          newTicks = [0, 1, 2, 3]

      container.call(grid.tickValues(oldTicks))
      transition.on('end', () => {
          // Timeout captures state after rendering is complete
          setTimeout(() => {
              newActual = lineNodes().length
              expect(newActual).toEqual(newTicks.length)
              done()
          });
      }).call(grid.tickValues(newTicks))
    })

    it('should remove unused lines on animated re-render', (done) => {
      let newActual,
          oldTicks = [0, 1, 2, 3],
          newTicks = [0, 1];

      container.call(grid.tickValues(oldTicks))
      transition.on('end', () => {
          setTimeout(() => {
              newActual = lineNodes().length
              expect(newActual).toEqual(newTicks.length)
              done()
          })
      }).call(grid.tickValues(newTicks))
    })
  })

  describe('API', () => {
    it('should have a scale accessor that defaults to the constructor value', () => {
      let previous = scale,
          newScale = scaleLinear()

      expect(grid.scale()).toBe(scale)
      expect(grid.scale(newScale)).toBe(grid)
      expect(grid.scale()).toBe(newScale)
    })

    it('should have a range accessor that defaults to [0, 1]', () => {
      let previous = [0, 1],
          next = [200, 0]

      expect(grid.range()).toEqual(previous)
      expect(grid.range(next)).toBe(grid)
      expect(grid.range()).toEqual(next)
    })

    it('should have an offsetStart accessor that defaults to 0', () => {
      let previous = 0,
          next = 10

      expect(grid.offsetStart()).toBe(previous)
      expect(grid.offsetStart(next)).toBe(grid)
      expect(grid.offsetStart()).toBe(next)
    })

    it('should have an offsetEnd accessor that defaults to 0', () => {
      let previous = 0,
          next = 10

      expect(grid.offsetEnd()).toBe(previous)
      expect(grid.offsetEnd(next)).toBe(grid)
      expect(grid.offsetEnd()).toBe(next)
    })

    it('should have a hideEdges accessor that defaults to false', () => {
      let previous = false,
          next = 'both'

      expect(grid.hideEdges()).toBe(previous)
      expect(grid.hideEdges(next)).toBe(grid)
      expect(grid.hideEdges()).toBe(next)
    })

    it('should have a ticks accessor that defaults to null', () => {
      let previous = null,
          next = 5

      expect(grid.ticks()).toBe(previous)
      expect(grid.ticks(next)).toBe(grid)
      expect(grid.ticks()).toBe(next)
    })

    it('should have a tickValues accessor that defaults to null', () => {
      let previous = null,
          next = [0, 0.5, 1]

      expect(grid.tickValues()).toEqual(previous)
      expect(grid.tickValues(next)).toBe(grid)
      expect(grid.tickValues()).toEqual(next)
      // Resetting to null also works
      expect(grid.tickValues(previous)).toBe(grid)
      expect(grid.tickValues()).toEqual(previous)
    })
  })

  describe('gridVertical', () => {
    let tickValues, range, expected

    beforeEach(() => {
      tickValues = [0, 1, 2]
      range = [0, 50]
      expected = [
        { x1: 0.5, x2: 0.5, y1: 0, y2: 50 },
        { x1: 50.5, x2: 50.5, y1: 0, y2: 50 },
        { x1: 100.5, x2: 100.5, y1: 0, y2: 50 }
      ]
      grid = gridVertical(scale).tickValues(tickValues).range(range);
    })

    it('should render a container group with correct classes and lines', () => {
      container.call(grid);

      let expectedContainer = 1,
          actualContainer = container.selectAll('g.grid.vertical').nodes().length,
          expectedLines = tickValues.length,
          actualLines = lineNodes().length

      expect(actualContainer).toBe(expectedContainer)
      expect(actualLines).toBe(expectedLines)
    })

    it('should position the lines correctly', () => {
        container.call(grid)
        expect(actualLineCoords()).toEqual(expected)
    })
  })
})

describe('gridVertical', () => {
  let f = new Fixtures(),
      container: SimpleSelection<BaseType>,
      lineNodes = (dir?: string) => container.selectAll(`.grid${dir ? '.' + dir : ''} line`).nodes(),
      actualLineCoords = (dir?: string) => lineNodes(dir).map(extractLineCoords),
      scale: ScaleLinear<number, number>,
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
})
