
    //Define Margin
    var margin = {left: 20, right: 80, top: 50, bottom: 20 }, 
        width = 960,
        height = 500;

// create a clipping region 


    //Define Color
    var colors = d3.scaleOrdinal(d3.schemeCategory20);

    
    //Define SVG
      var svg = d3.select("#block")
        .append("svg")
        .attr("id", "main")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      ; 

        


      var xScale = d3.scaleLinear()          
              .range([0, width])
              .nice();

      var yScale = d3.scaleLinear()
            .range([height, 0]);
            xScale.domain([0,16]);
            yScale.domain([0,450]);

 var xScale = d3.scaleLinear()
  .domain([0, 15])
  .range([0, width]);
var yScale = d3.scaleLinear()
  .domain([0, 400])
  .range([height, 0]);


    

  
                            
    
    //Define Tooltip here
    
      
       //Define Axis
//    var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickPadding(2);
//    var yAxis = d3.svg.axis().scale(yScale).orient("left").tickPadding(2);

    var xAxis = d3.axisBottom(xScale).ticks(12);
    var yAxis = d3.axisLeft(yScale).ticks(12 * height / width);
    var gX = svg.append('g')
  .attr('transform', 'translate(' + 0 + ',' + ((width/2)+20 )+ ')')
  .call(xAxis);
var gY = svg.append('g')
  .attr('transform', 'translate(' +0 + ',' + 0 + ')')
  .call(yAxis);
        
    
    // Get the data
d3.csv("scatterdata.csv", function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
      d.gdp         = d.gdp;
      d.polulation  = d.population;
      d.country     = d.country;
      d.ec          = d.ec;
      d.epc         = d.ecc;
      d.total       = +d.ec;
  });
 
    

    
    //Draw Scatterplot
        var points = svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", function(d) { return Math.sqrt(d.total)/.2; })
        .attr("cx", function(d) {return xScale(d.gdp);})
        .attr("cy", function(d) {return yScale(d.epc);})
        .style("fill", function (d) { return colors(d.country); })
        .on("mouseover", function(d) {
            
            
            var xPosition = parseFloat(d3.select(this).attr("cx"));
            var yPosition = parseFloat(d3.select(this).attr("cy"));
            
            
            d3.select("#tooltip")
						.style("left", xPosition+140 + "px")
						.style("top", yPosition+120 + "px")
						.select("#country")
						.text(d.country);
            d3.select("#tooltip")
                        .select("#population")
						.text(d.population);
            d3.select("#tooltip")
                        .select("#gdp")
						.text(d.gdp);
            d3.select("#tooltip")
                        .select("#epc")
						.text(d.ecc);
            d3.select("#tooltip")
                        .select("#total")
						.text(d.ec);
            
            
                        
                       
                        
            d3.select("#tooltip").classed("hidden", false);
//       div.style("opacity", .9);
//       div.html("<div>"+d.country+"<br/>"
//                +"Population: "+d.population +" million"+"<br/>"
//                +"GDP: $"+d.gdp +" trillion"+"<br/>"
//                +"EPC: "+d.ecc +" million BTUs"+"<br/>"
//                +"Total: "+d.ec +" million</div>"
//               )
//         .style("left", function(d) {return xScale(d.gdp);})
//         .style("top",function(d) {return yScale(d.epc);})
       })
     .on("mouseout", function() {
         d3.select("#tooltip").classed("hidden", true);

			   });
    //Add .on("mouseover", .....
    //Add Tooltip.html with transition and style
    //Then Add .on("mouseout", ....
    
    //Scale Changes as we Zoom
    // Call the function d3.behavior.zoom to Add zoom
   
    
      var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    //Draw Country Names
       var countries= svg.selectAll(".text")
        .data(data)
        .enter().append("text")
        .attr("class","text")
        //.style("text-anchor", "start")
        .attr("x", function(d) {return xScale(d.gdp);})
        .attr("y", function(d) {return yScale(d.epc);})
        
        .style("fill", "black")
        .text(function (d) {return d.country; })
        ;

// //x-axis
//    svg.append("g")
//        .attr("class", "x axis")
//        .attr("transform", "translate(0," + height + ")")
//        .call(xAxis)
//        .append("text")
//        .attr("class", "label")
//        .attr("y", 50)
//        .attr("x", width/2)
//        .style("text-anchor", "middle")
//        .attr("font-size", "12px")
//        .text("GDP (in Trillion US Dollars) in 2010");
//
//    
//    //Y-axis
//    svg.append("g")
//        .attr("class", "y axis")
//        .call(yAxis)
//        .append("text")
//        .attr("class", "label")
//        .attr("transform", "rotate(-90)")
//        .attr("y", 50)
//        .attr("x", 50)
//        .attr("dy", ".71em")
//        .style("text-anchor", "end")
//        .attr("font-size", "12px")
//        .text("Energy Consumption per Capita (in Million BTUs per person)");

    
     // draw legend colored rectangles
    svg.append("rect")
        .attr("x", width-250)
        .attr("y", height-190)
        .attr("width", 220)
        .attr("height", 180)
        .attr("fill", "lightgrey")
        .style("stroke-size", "1px");

    svg.append("circle")
        .attr("r", 5)
        .attr("cx", width-100)
        .attr("cy", height-175)
        .style("fill", "white");
    
    svg.append("circle")
        .attr("r", 15.8)
        .attr("cx", width-100)
        .attr("cy", height-150)
        .style("fill", "white");

    svg.append("circle")
        .attr("r", 50)
        .attr("cx", width-100)
        .attr("cy", height-80)
        .style("fill", "white");

    svg.append("text")
        .attr("class", "label")
        .attr("x", width -150)
        .attr("y", height-172)
        .style("text-anchor", "end")
        .text(" 1 Trillion BTUs");

    svg.append("text")
        .attr("class", "label")
        .attr("x", width -150)
        .attr("y", height-147)
        .style("text-anchor", "end")
        .text(" 10 Trillion BTUs");

    svg.append("text")
        .attr("class", "label")
        .attr("x", width -150)
        .attr("y", height-77)
        .style("text-anchor", "end")
        .text(" 100 Trillion BTUs");
    
     svg.append("text")
        .attr("class", "label")
        .attr("x", width -150)
        .attr("y", height-15)
        .style("text-anchor", "middle")
        .style("fill", "Green") 
        .attr("font-size", "16px")
        .text("Total Energy Consumption");  
   
    
    // Pan and zoom
var zoom = d3.zoom()
    .scaleExtent([.5, 20])
    .extent([[0, 0], [width/2, height/2]])
    .on("zoom", zoomed);

svg.append("rect")
    .attr("width", width/2)
    .attr("height", height/2)
    .style("fill", "none")
    .style("pointer-events", "all")
    .attr('transform', 'translate(' + 200 + ',' + 0+ ')')
    
    .call(zoom);
    
  
    
     function zoomed() {
// create new scale ojects based on event
    var new_xScale = d3.event.transform.rescaleX(xScale);
    var new_yScale = d3.event.transform.rescaleY(yScale);
// update axes
    gX.call(xAxis.scale(new_xScale));
    gY.call(yAxis.scale(new_yScale));
     points.data(data)
     .attr('cx', function(d) {return new_xScale(d.gdp)})
     .attr('cy', function(d) {return new_yScale(d.epc)})
         
         
    countries.data(data)
     .attr('x', function(d) {return new_xScale(d.gdp)})
     .attr('y', function(d) {return new_yScale(d.epc)});
   
}


    

});

