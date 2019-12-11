var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("data.csv").then(function(demoData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    demoData.forEach(function(data) {
      data.income = +data.income;
      data.obesity = +data.obesity;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(demoData, d => d.income), d3.max(demoData, d => d.income)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(demoData, d => d.obesity), d3.max(demoData, d => d.obesity)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(demoData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.income))
    .attr("cy", d => yLinearScale(d.obesity))
    .classed("stateCircle", true)
    .attr("r", "15")
    // .attr("class", "stateCircle");

    var circlesLabels = chartGroup.selectAll("null")
    .data(demoData)
    .enter()
    .append("text")
    .text(d => `${d.abbr}`)
    .attr("text-anchor", "middle")
    .attr("class", "stateText")
    .attr("x", d => xLinearScale(d.income))
    .attr("y", d => yLinearScale(d.obesity));


    // // Step 6: Initialize tool tip
    // // ==============================
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Household Income: $${d.income}<br>Obesity:${d.obesity}%`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseout", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left+2)
      .attr("x", 0 - (height/2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Obesity(%)");

    chartGroup.append("null")
      .attr("transform", `translate(${width / 2}, ${height + margin.top -8})`)
      .attr("class", "axisText")
      .text("Household Income ($)");
  }).catch(function(error) {
    console.log(error);
  });