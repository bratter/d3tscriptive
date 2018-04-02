// ----------------------------------------------------------------------------
// Define common variables
// ----------------------------------------------------------------------------

var height = 300,
    width = 400,
    margin = { top: 20, right: 20, bottom: 20, left: 20 },
    chartHeight = height - margin.top - margin.bottom,
    chartWidth = width - margin.left - margin.right,
    chartBg = '#FBFBFB',
    scaleX = d3.scaleLinear().domain([0, 1]).range([0, chartWidth]),
    scaleY = d3.scaleLinear().domain([0, 1]).range([chartHeight, 0])

// Callback that will render the grid 
function renderCallback(gridGenerator) {
  d3.select(this).call(gridGenerator)
}

// ----------------------------------------------------------------------------
// Horizontal and vertical grid demos
// ----------------------------------------------------------------------------

// Grid setup
var gridH = d3ts.gridHorizontal(scaleY)
    .range([0, chartWidth])
    .ticks(5)
    .offsetStart(20)
    .offsetEnd(5)
    .hideEdges('first')

var gridV = d3ts.gridVertical(scaleX)
    .range([chartHeight, 0])
    .ticks(5)
    .offsetStart(20)
    .offsetEnd(5)
    .hideEdges(false)

// Build the containers and the chart area
var g1d = d3.select('.grid-1d')
  .selectAll('svg').data([gridH, gridV])
  .enter()
  .append('svg')
    .attr('height', height)
    .attr('width', width)
  .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

var area = g1d.append('rect')
    .attr('height', chartHeight)
    .attr('width', chartWidth)
    .attr('fill', chartBg)

// Render the grids
g1d.each(renderCallback)

// TODO: Build ability to update using API with forms, including transition
d3.select('#grid1dH-offsetStart').node().value = gridH.offsetStart()

var submit = d3.select('#grid1dH').on('submit', function(d, i, nodes) {
    d3.event.preventDefault()
    // console.log(this, d, i, nodes)
    var form = d3.select(d3.event.target),
        offsetStart = +form.select('#grid1dH-offsetStart').node().value || 0,
        t = form.select('#gridH1d-transition').node().checked ? d3.transition().duration(1000) : null

    // console.log(form.selectAll('input').nodes())
    gridH.offsetStart(offsetStart)
    g1d.each(function (d) {
      var context = d3.select(this)
      if (t) context = context.transition(t)
      context.call(d)
    })
})

// ----------------------------------------------------------------------------
// 2D Grid Demo
// ----------------------------------------------------------------------------

// Chart svg element, chart group, and chart area
var g2d = d3.select('.grid-2d')
  .append('svg')
    .attr('height', height)
    .attr('width', width)
  .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

var area2d = g2d
  .append('rect')
    .attr('height', chartHeight)
    .attr('width', chartWidth)
    .attr('fill', chartBg)

// Grid demo
var grid2d = d3ts.grid(scaleX, scaleY)
    .offsetStart([10, 0])
    .offsetEnd([0, 10])
    .ticks([3, 7])
    .hideEdges([false, 'both'])

g2d.call(grid2d)
