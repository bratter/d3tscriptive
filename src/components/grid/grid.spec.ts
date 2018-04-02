/**
 * GridBase Test Suite
 */

import { Fixtures } from '../../../test/fixtures'
import { select } from 'd3-selection'
import { ScaleLinear, scaleLinear} from 'd3-scale'
import { Grid, grid } from './'

function extractLineCoords(el: SVGLineElement) {
  let sel = select(el);

  return {
      x1: +sel.attr('x1'),
      x2: +sel.attr('x2'),
      y1: +sel.attr('y1'),
      y2: +sel.attr('y2')
  } 
}

describe('grid', () => {
  let f = new Fixtures(),
      container,
      scaleX,
      scaleY,
      tickValues: number[],
      grid2D: Grid<any, any>,
      lineNodes = (dir?: string) => container.selectAll(`.grid${dir ? '.' + dir : ''} line`).nodes(),
      actualLineCoords = (dir?: string) => lineNodes(dir).map(extractLineCoords)

  beforeEach(() => {
    f.svg()
    container = select('.test-svg')
    scaleX = scaleLinear().domain([0, 2]).range([0, 50])
    scaleY = scaleLinear().domain([0, 2]).range([100, 150])
    tickValues = [0, 1, 2]
    grid2D = grid(scaleX, scaleY).tickValues(tickValues)
  })

  afterEach(() => {
    f.teardown()
  })

  it('should render a h and v container group with the correct classes', () => {
    container.call(grid2D)
    
    let expected = 1,
        actualH = container.selectAll('g.grid.horizontal').nodes().length,
        actualV = container.selectAll('g.grid.vertical').nodes().length

    expect(actualH).toBe(expected)
    expect(actualV).toBe(expected)
  })

  it('should render the correct number of gridlines when direction is full', () => {
    container.call(grid2D)
    
    let expected = tickValues.length,
        actualH = lineNodes('horizontal').length,
        actualV = lineNodes('vertical').length

    expect(actualH).toBe(expected)
    expect(actualV).toBe(expected)
  });

  it('should render the correct number of gridlines when direction is horizontal', () => {
      container.call(grid2D.direction('horizontal'))
      
      let expectedH = tickValues.length,
          expectedV = 0,
          actualH = lineNodes('horizontal').length,
          actualV = lineNodes('vertical').length

      expect(actualH).toBe(expectedH)
      expect(actualV).toBe(expectedV)
  });

  it('should render the correct number of gridlines when direction is vertical', () => {
      container.call(grid2D.direction('vertical'))
      
      let expectedH = 0,
          expectedV = tickValues.length,
          actualH = lineNodes('horizontal').length,
          actualV = lineNodes('vertical').length

      expect(actualH).toBe(expectedH)
      expect(actualV).toBe(expectedV)
  })

  it('should render the correct number of gridlines when hideEdges is first', () => {
    container.call(grid2D.hideEdges('first'))
    expect(lineNodes('horizontal').length).toBe(2)
    expect(lineNodes('vertical').length).toBe(2)
  })

  it('should render the correct number of gridlines when hideEdges is last', () => {
      container.call(grid2D.hideEdges('last'))
      expect(lineNodes('horizontal').length).toBe(2)
      expect(lineNodes('vertical').length).toBe(2)
  })

  it('should render the correct number of gridlines when hideEdges is both', () => {
      container.call(grid2D.hideEdges('both'))
      expect(lineNodes('horizontal').length).toBe(1)
      expect(lineNodes('vertical').length).toBe(1)
  })

  it('should render the correct number of gridlines when hideEdgesH is used', () => {
      container.call(grid2D.hideEdges(['both', false]))
      expect(lineNodes('horizontal').length).toBe(1)
      expect(lineNodes('vertical').length).toBe(3)
  });

  it('should render the correct number of gridlines when hideEdgesV is used', () => {
      container.call(grid2D.hideEdges([false, 'both']))
      expect(lineNodes('horizontal').length).toBe(3)
      expect(lineNodes('vertical').length).toBe(1)
  })

  it('should render tickValues properly', () => {
    let ticksH = [0, 0.1],
        ticksV = [0.2, 0.3, 0.4, 0.5]

    container.call(grid2D.tickValues([ticksH, ticksV]))
    expect(lineNodes('horizontal').length).toBe(ticksH.length)
    expect(lineNodes('vertical').length).toBe(ticksV.length)
  })

  describe('positioning', () => {
    let expectedCoordsH,
        expectedCoordsV

    beforeEach(() => {
      expectedCoordsH = [
          { x1: 0, x2: 50, y1: 100.5, y2: 100.5 },
          { x1: 0, x2: 50, y1: 125.5, y2: 125.5 },
          { x1: 0, x2: 50, y1: 150.5, y2: 150.5 }
      ]
      expectedCoordsV = [
          { x1: 0.5, x2: 0.5, y1: 100, y2: 150 },
          { x1: 25.5, x2: 25.5, y1: 100, y2: 150 },
          { x1: 50.5, x2: 50.5, y1: 100, y2: 150 }
      ]
    })

    it('should position both the horizontal and vertical gridlines correctly', () => {
      container.call(grid2D)
      expect(actualLineCoords('horizontal')).toEqual(expectedCoordsH)
      expect(actualLineCoords('vertical')).toEqual(expectedCoordsV)
    })

    it('should position the gridlines correctly when offsetStart is set', () => {
      let expectedH = expectedCoordsH.map(d => ({ ...d, x1: -10 })),
          expectedV = expectedCoordsV.map(d => ({ ...d, y1: 95 }))
      
      container.call(grid2D.offsetStart([10, 5]))
      expect(actualLineCoords('horizontal')).toEqual(expectedH)
      expect(actualLineCoords('vertical')).toEqual(expectedV)
    })

    it('should position the gridlines correctly when offsetEnd is set', () => {
        let expectedH = expectedCoordsH.map(d => ({ ...d, x2: 60 })),
            expectedV = expectedCoordsV.map(d => ({ ...d, y2: 155 }))
        
        container.call(grid2D.offsetEnd([10, 5]))
        expect(actualLineCoords('horizontal')).toEqual(expectedH)
        expect(actualLineCoords('vertical')).toEqual(expectedV)
    })
  })

  describe('API', () => {
    it('should have an X and Y scale accessor that defaults to constructor value', () => {
      let newScaleX = scaleLinear(),
          newScaleY = scaleLinear()

      expect(grid2D.scaleX()).toBe(scaleX)
      expect(grid2D.scaleY()).toBe(scaleY)
      expect(grid2D.scaleX(newScaleX)).toBe(grid2D)
      expect(grid2D.scaleY(newScaleY)).toBe(grid2D)
      expect(grid2D.scaleX()).toBe(newScaleX)
      expect(grid2D.scaleY()).toBe(newScaleY)
    })

    it('should have a direction accessor that defaults to full ', () => {
      let previous = 'full',
          next = 'vertical'

      expect(grid2D.direction()).toBe(previous)
      expect(grid2D.direction(next)).toBe(grid2D)
      expect(grid2D.direction()).toBe(next)
    })

    it('should have an offsetStart accessor that defaults to 0 and sets H and V values together or independently', () => {
      let previous = [0, 0],
          nextSingle = [10, 10],
          nextTuple: [number, number] = [5, 15]

      expect(grid2D.offsetStart()).toEqual(previous)
      expect(grid2D.offsetStart(nextSingle[0])).toBe(grid2D)
      expect(grid2D.offsetStart()).toEqual(nextSingle)
      grid2D.offsetStart(nextTuple)
      expect(grid2D.offsetStart()).toEqual(nextTuple)
    })

    it('should have an offsetEnd accessor that defaults to 0 and sets H and V values together or independently', () => {
      let previous = [0, 0],
          nextSingle = [10, 10],
          nextTuple: [number, number] = [5, 15]

      expect(grid2D.offsetEnd()).toEqual(previous)
      expect(grid2D.offsetEnd(nextSingle[0])).toBe(grid2D)
      expect(grid2D.offsetEnd()).toEqual(nextSingle)
      grid2D.offsetEnd(nextTuple)
      expect(grid2D.offsetEnd()).toEqual(nextTuple)
    })

    it('should have a hideEdges accessor that defaults to false and sets H and V values together or independently', () => {
      let previous = [false, false],
          nextSingle = ['both', 'both'],
          nextTuple: [boolean|string, boolean|string] = [true, 'first']

      expect(grid2D.hideEdges()).toEqual(previous)
      expect(grid2D.hideEdges(nextSingle[0])).toBe(grid2D)
      expect(grid2D.hideEdges()).toEqual(nextSingle)
      grid2D.hideEdges(nextTuple)
      expect(grid2D.hideEdges()).toEqual(nextTuple)
    })

    it('should have a ticks accessor that defaults to null and sets H and V values together or independently', () => {
      let previous = [null, null],
          nextSingle = [1, 1],
          nextTuple: [number, number] = [5, 10]

      expect(grid2D.ticks()).toEqual(previous)
      expect(grid2D.ticks(nextSingle[0])).toBe(grid2D)
      expect(grid2D.ticks()).toEqual(nextSingle)
      grid2D.ticks(nextTuple)
      expect(grid2D.ticks()).toEqual(nextTuple)
    })
  })

  it('should have a tickValues accessor that defaults to null and sets H and V values together or independently', () => {
    let previous = [null, null],
    nextSingle = [[0, 1, 2], [0, 1, 2]],
    nextTuple: [number[], number[]] = [[3, 4, 5], [6, 7, 8]]
    
    // Recreate grid as we use tickValues in beforeEach
    grid2D = grid(scaleX, scaleY)

    expect(grid2D.tickValues()).toEqual(previous)
    expect(grid2D.tickValues(nextSingle[0])).toBe(grid2D)
    expect(grid2D.tickValues()).toEqual(nextSingle)
    grid2D.tickValues(nextTuple)
    expect(grid2D.tickValues()).toEqual(nextTuple)
  })
})
