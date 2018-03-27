// Define variables
var height = 300,
    width = 400,
    margin = { top: 20, right: 20, bottom: 20, left: 20 },
    chartHeight = height - margin.top - margin.bottom,
    chartWidth = width - margin.left - margin.right,
    chartBg = '#EEE'

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
