/* ----------------------------------------------------------------------------
File: BarGraphSample.js
Contructs the Bar Graph using D3
80 characters perline, avoid tabs. Indet at 4 spaces. See google style guide on
JavaScript if needed.
-----------------------------------------------------------------------------*/ 

// Search "D3 Margin Convention" on Google to understand margins.
// Add comments here in your own words to explain the margins below (.25 point)
//these margin values are use when initilizing the svg object. SVG will have margins //around it in the values defined below.
var margin = {top: 10, 
              right: 40, 
              bottom: 150, 
              left: 50},
    width = 760 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    

// Define SVG. "g" means group SVG elements together.
// Confused about SVG still, see Chapter 3. 
// Add comments here in your own words to explain this segment of code (.25 point)
//we create the svg object.svg object serves as a container for all 
//svg elements. d3.select() grabs the body DOM element and appends the
//svg with margins

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/* --------------------------------------------------------------------
SCALE and AXIS are two different methods of D3. See D3 API Refrence and 
look up SVG AXIS and SCALES. See D3 API Refrence to understand the 
difference between Ordinal vs Linear scale.
----------------------------------------------------------------------*/ 

// Define X and Y SCALE.
// Add comments in your own words to explain the code below (.25 point)
//we define the x and y scalses here. x scale is ordinal wete y is
//numeric
var xScale = d3.scaleBand()
    .rangeRound([0, width])
    .padding([0.1]);

var yScale = d3.scaleLinear()
    .domain([0, 20])
    .range([height, 0]);


// Define X and Y AXIS
// Define tick marks on the y-axis as shown on the output with an interval of 5 and $ sign(1 point)
var xAxis = d3.axisBottom(xScale)
 .tickValues(xDomain);

console.log(xScale.domain());
var yAxis = d3.axisLeft(yScale)
.ticks(4)
.tickFormat( function(d) {return "$" + d });

 
/* --------------------------------------------------------------------
To understand how to import data. See D3 API refrence on CSV. Understand
the difference between .csv, .tsv and .json files. To import a .tsv or
.json file use d3.tsv() or d3.json(), respectively.
----------------------------------------------------------------------*/ 

var xDomain =[];

// data.csv contains the country name(key) and its GDP(value)
// 1 point for explaining the code for reading the data
//we use d3.csv() method to read the data from
//csv file. for each line we create a key value pair 
var dataset = d3.csv("GDP2016TrillionUSDollars.csv",function(error, data){
    
    data.forEach(function(d) {
        d.key = d.key;
        xDomain.push(d.key);
        d.value = +d.value;
    });
    
    // Return X and Y SCALES (domain). See Chapter 7:Scales (Scott M.) 
    // .25 point for explaining the code below
    //now we define the domain dor the data in order to map it with the
    //scale x scale domain is 15 country names
    //y scale is from o to max value in the data
    
    xScale.domain(xDomain);
    yScale.domain([0,d3.max(data, function(d) {return d.value; })]);
    
    // Creating rectangular bars to represent the data. 
    // Add comments to explain the code below (no points but there may be a quiz in future)
    //we select all rec tags(none at the begining) then bind it to the 
    //data then introduce the effect. later we position the recs acourding to data x and y scales


    
    svg.selectAll("rect")
			   .data(data)
			   .enter()
			   .append("rect")
               .transition().duration(1000)
               .delay( function(d,i) {return i * 100;})
			   .attr("x", function(d) {
			   		return xScale(d.key);
			   })
			   .attr("y", function(d) {
			   		return yScale(d.value);
			   })
			   .attr("width", xScale.bandwidth())
			   .attr("height", function(d) {
			   		return height - yScale(d.value);
			   })
                // create increasing to decreasing shade of blue as shown on the output (2 points)
                .attr("fill", function(d){console.log("d.value "+d.value); return "rgb(0,0,"+(255-Math.round(d.value*10))+")"});
    
      // Label the data values(d.value) (3 points)
			   
        svg.selectAll("text")
                .data(data)
                .enter()
                .append("text")
                .transition().duration(1000)
                .delay( function(d,i) {return i*100;})
                .text(function(d){ return d.value})
                .attr("x", function(d) {
			   		return xScale(d.key)+8;
			   })
			   .attr("y", function(d) {
			   		return yScale(d.value)+15;
			   })
                .attr("fill","white")
                .attr("font-size", "10px");;
  
               
  
    
    // Draw xAxis and position the label at -60 degrees as shown on the output (1 point)
    svg.append("g")
        .attr("class", "x axis line")
        .attr("transform", "translate(0," + (height+20) + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-60)")
        .attr("dx", "-.8em")
        .attr("dy", ".25em")
        .style("text-anchor", "end")
        .attr("font-size", "10px");
        
    
    // Draw yAxis and postion the label (2 points)
 svg.append("g")
        .attr("class", "y axis line")
        .call(yAxis)
        .selectAll("text")
        .attr("dx", "-.8em")
        .attr("dy", ".25em")
        .style("text-anchor", "end")
        .attr("font-size", "10px");
// text label for the y axis
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -55)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Trillions of US Dollars ($)"); 
    
     });

console.log(xDomain[1]);

  


      


        
    