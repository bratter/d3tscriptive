// Define variables
var height = 300,
    width = 400,
    margin = { top: 20, right: 20, bottom: 20, left: 20 },
    chartHeight = height - margin.top - margin.bottom,
    chartWidth = width - margin.left - margin.right,
    chartBg = '#FBFBFB',
    scale = d3.scaleLinear().domain([0, 1]).range([chartHeight, 0])

// Create SVG element and chart group
var svg = d3.select('.grid-1d-horizontal')
  .append('svg')
    .attr('height', height)
    .attr('width', width)

var g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

// Also create a basic chart area
var chartArea = g.append('rect')
    .attr('height', chartHeight)
    .attr('width', chartWidth)
    .attr('fill', chartBg)

var gridH = d3ts.gridHorizontal(scale)
    .range([0, chartWidth])
    .ticks(5)
    .offsetStart(20)
    .offsetEnd(5)
    .hideEdges('first')

g.call(gridH)

// TODO: Build ability to update using API with forms
d3.select('#grid1dH-offsetStart').node().value = gridH.offsetStart()

var submit = d3.select('#grid1dH').on('submit', function(d, i, nodes) {
    d3.event.preventDefault()
    // console.log(this, d, i, nodes)
    var form = d3.select(d3.event.target),
        offsetStart = +form.select('#grid1dH-offsetStart').node().value || 0

    // console.log(form.selectAll('input').nodes())
    g.call(gridH.offsetStart(offsetStart))
    // g.transition().duration(1000).call(gridH.offsetStart(offsetStart))
})
