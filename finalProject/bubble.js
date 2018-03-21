
var svg = d3.select(".bubble"),
    margin = {top: 20, right: 20, bottom: 110, left: 40},
    margin2 = {top: 430, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    height2 = +svg.attr("height") - margin2.top - margin2.bottom;





var nodes_data =  [
    {"name": "Router", "type": "router", "usage":31, "Moisture": 91, "Light": 44, "Humidity": 32, "Temperature": 66},
    {"name": "Extender1", "type": "router", "usage":31, "Moisture": 76, "Light": 67, "Humidity": 21, "Temperature": 42},
    {"name": "Extender2", "type": "router", "usage":31, "Moisture": 28, "Light": 96, "Humidity": 23, "Temperature": 57},
    {"name": "Extender3", "type": "router", "usage":31, "Moisture": 28, "Light": 96, "Humidity": 23, "Temperature": 57},
    {"name": "Extender4", "type": "router", "usage":31, "Moisture": 89, "Light": 17, "Humidity": 79, "Temperature": 40},
    {"name": "Extender5", "type": "router", "usage":31,  "Moisture": 54, "Light": 62, "Humidity": 26, "Temperature": 55},
    {"name": "Extender6", "type": "router", "usage":31, "Moisture": 50, "Light": 57, "Humidity": 38, "Temperature": 56},
    {"name": "Node_3", "type": "weak", "usage":41, "Moisture": 95, "Light": 75, "Humidity": 34, "Temperature": 70},
    {"name": "Node_4", "type": "strong", "usage":41,  "Moisture": 70, "Light": 53, "Humidity": 64, "Temperature": 73},
    {"name": "Node_5", "type": "average", "usage":55, "Moisture": 75, "Light": 100, "Humidity": 37, "Temperature": 74},
    {"name": "Node_6", "type": "average", "usage":55,  "Moisture": 99, "Light": 11, "Humidity": 32, "Temperature": 66},
    {"name": "Node_7", "type": "weak", "usage":51, "Moisture": 47, "Light": 85, "Humidity": 48, "Temperature": 66},
    {"name": "Node_8", "type":"weak", "usage":31, "Moisture": 27, "Light": 49, "Humidity": 16, "Temperature": 74},
    {"name": "Node_9", "type": "strong", "usage":31, "Moisture": 43, "Light": 23, "Humidity": 73, "Temperature": 40},
    {"name": "Node_10", "type":"strong", "usage":51,  "Moisture": 94, "Light": 91, "Humidity": 69, "Temperature": 41},
    {"name": "Node_11", "type":"average", "usage":31, "Moisture": 84, "Light": 11, "Humidity": 62, "Temperature": 62},
    {"name": "Node_12", "type": "strong", "usage":31, "Moisture": 31, "Light": 73, "Humidity": 11, "Temperature": 78},
    {"name": "Node_14", "type": "strong", "usage":21, "Moisture": 61, "Light": 58, "Humidity": 14, "Temperature": 77},
    {"name": "Node_15", "type":"strong", "usage":21,  "Moisture": 100, "Light": 81, "Humidity": 9, "Temperature": 70},
    {"name": "Node_16", "type": "strong", "usage":41,  "Moisture": 93, "Light": 71, "Humidity": 32, "Temperature": 64},
    {"name": "Node_17", "type": "average", "usage":41, "Moisture": 34, "Light": 11, "Humidity": 70, "Temperature": 67}
   
    ]

var links_data = [
    {"source": "Router", "target": "Extender1", "type":"A", "dist":10 },
    {"source": "Router", "target": "Extender2", "type":"A", "dist":10},
    {"source": "Router", "target": "Extender3", "type":"A", "dist":10},
    {"source": "Router", "target": "Extender4", "type":"A", "dist":10},
    {"source": "Router", "target": "Extender5", "type":"A", "dist":10},
    
    {"source": "Router", "target": "Extender6", "type":"A", "dist":10},
    {"source": "Extender1", "target": "Node_3", "type":"A", "dis":10},
    {"source": "Extender1", "target": "Node_4", "type":"A", "dist":10},
    {"source": "Extender2", "target": "Node_5", "type":"A", "dist":10},
    {"source": "Extender2", "target": "Node_6", "type":"A", "dist":10},
    {"source": "Extender3", "target": "Node_7", "type":"E", "dist":10},
    {"source": "Extender3", "target": "Node_8", "type":"A", "dist":10},
    {"source": "Extender4", "target": "Node_9", "type":"A", "dist":10},
    {"source": "Extender4", "target": "Node_10", "type":"E", "dist":10},
    {"source": "Extender1", "target": "Node_11", "type":"A", "dist":10},
    {"source": "Extender5", "target": "Node_12", "type":"A", "dist":10},
    {"source": "Extender6", "target": "Node_14", "type":"E", "dist":10},
    {"source": "Extender1", "target": "Node_15", "type":"A", "dis":10},
    {"source": "Extender1", "target": "Node_16", "type":"A", "dist":10},
    {"source": "Extender3", "target": "Node_17", "type":"E", "dist":10},
    ]

console.log(links_data[1].dist);
//set up the simulation 
var simulation = d3.forceSimulation()
					//add nodes
					.nodes(nodes_data);
    
function dist(d)
{
  return d.dist;
}
    
 
var radius= 40;
                               
var link_force =  d3.forceLink(links_data).distance(150)
                        .id(function(d) { return d.name;}); 
            
var charge_force = d3.forceManyBody().distanceMax(300).distanceMin(200)
    .strength(-2500);
 
var attractForce = d3.forceManyBody().strength(-500); 
var repelForce = d3.forceManyBody().strength(400).distanceMin(120);
    
var center_force = d3.forceCenter((width/2)-200, (height /2)-100);  

var duration = setDuration(0);

var prevHoursData = {
        readings: []
};

var prevTempData = {
        readings: []
};

var prevMoistureData = {
        readings: []
};

var prevSunlightData = {
        readings: []
};

var prevBatterylightData = {
        readings: []
};

var prevHumidityData = {
        readings: []
};    
var latestReadings = {
    nodes : []
}

var sensorNodeLimits = {
    nodes : []
}

var xhr = new XMLHttpRequest();
//get_readings_prev_hours(1, duration);
get_latest_readings(1);
get_node_limits();
function setDuration(hours) {
    
    duration = hours;
    return duration;
}


                        
simulation
    .force("charge_force", charge_force)
    .force("center_force", center_force)
    .force("links",link_force)
    .force("attractForce",attractForce)
    .force('collision', d3.forceCollide().radius(function(d) {
    return d.dist
  }))
    

        
//add tick instructions: 
simulation.on("tick", tickActions );

//draw lines for the links 
var link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links_data)
    .enter().append("line")
    .attr("stroke-width", 4)
    .style("stroke", linkColour);        

//Define Tooltip here
    var tooltip = d3.select("body").append("div").attr("class", "toolTip");
    var div_tooltip = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

//draw circles for the nodes 
var node = svg.append("g")
        .attr("class", "nodes") 
        .selectAll("circle")
        .data(nodes_data)
        .enter()
        .append("circle")
        .attr("r", circleRadius)
        .attr("fill", circleColour)
        .attr("background-image", "find_code.png")
        .on("mouseover", function(d) {		
            div_tooltip.transition()		
                .duration(200)		
                .style("opacity", .9);	
            
            //{"name": "Router", "type": "router", "usage":31, "Moisture": 91, "Light": 44, "Humidity": 32, "Temperature": 66},
            div_tooltip	.html("<center>"+d.name + "</center><br/>" 
                            +"<strong>Moisture: </strong>"+d.Moisture+ "<br/>" 
                            +"<strong>Light: </strong>" +d.Light+ "<br/>" 
                            +"<strong>Humidity: </strong>"+d.Humidity+ "<br/>"  
                            +"<strong>Temperature: </strong>"+d.Temperature+ "<br/>" 
                             
                             )	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
            })	
        
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });
      
var drag_handler = d3.drag()
	.on("start", drag_start)
	.on("drag", drag_drag)
	.on("end", drag_end);	
	
//drag_handler(node)

/** Functions **/
//Function to choose what color circle we have
//Let's return blue for males and red for females
function circleColour(d){
	if(d.type =="strong"){
		return "green";
	} 
    if(d.type =="average"){
		return "orange";
	}
    if(d.type =="weak"){
		return "red";
	}
    else {
		return "grey";
	}
}
    
    
function circleRadius(d){
    
    return d.usage;   
}

//Function to choose the line colour and thickness 
//If the link type is "A" return green 
//If the link type is "E" return red 
function linkColour(d){
	if(d.type == "A"){
		return "grey";
	} 
    
    else {
		return "red";
	}
}


//drag handler
//d is the node 
function drag_start(d) {
 if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function drag_drag(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}


function drag_end(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}
      
function tickActions() {
    //bounding box around the outside 
      node
        .attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
        .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });
        
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
	  } 
// Receive data 
        
        
        function get_readings_prev_hours(nodeId, duration) {
            console.log(nodeId);
            
            xhr.open("GET", "http://sproutlabs-dev.herokuapp.com/api/nodes/prev_xh/" + nodeId +"?hours="+duration);
            xhr.setRequestHeader('Authorization', "QRESkJWzMesUozNu6vfGJDcjKxGjzJ");
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onload = get_readings_prev_hours_complete;
            xhr.send();
                  
        }
        
        function get_readings_prev_hours_complete() {
            var response = JSON.parse(xhr.responseText);
            for (var i=0; i<response.length; i++) {
                prevHoursData.readings.push({
                    "day": Math.ceil(((i)/8) + 1),
                    "hour": (i+1),
                    "humidity" : response[i].humidity,
                    "temperature" : response[i].temperature,
                    "battery" : response[i].battery
                });
            }
            //console.log("Previous reading");
            //console.log(prevHoursData);
            getTempData(prevHoursData);
            getMoistureData(prevHoursData);
            getSunLightData(prevHoursData);
            getBatteryData(prevHoursData);
            gethumidityData(prevHoursData);

        }
        
        function getTempData()  {
          for (var i=0; i<prevHoursData.readings.length; i++) {
              prevTempData.readings.push({
                  "day": prevHoursData.readings[i].day,
                  "hour": prevHoursData.readings[i].hour,
                  "value": prevHoursData.readings[i].temperature
              });
          }
          console.log(prevTempData);       
        }
        
        function getMoistureData()  {
          for (var i=0; i<prevHoursData.readings.length; i++) {
              prevMoistureData.readings.push({
                  "day": prevHoursData.readings[i].day,
                  "hour": prevHoursData.readings[i].hour,
                  "value": prevHoursData.readings[i].temperature
              });
          }
          console.log(prevMoistureData);       
        }
    
        function getBatteryData()  {
          for (var i=0; i<prevHoursData.readings.length; i++) {
              prevBatterylightData.readings.push({
                  "day": prevHoursData.readings[i].day,
                  "hour": prevHoursData.readings[i].hour,
                  "value": prevHoursData.readings[i].temperature
              });
          }
          console.log(prevBatterylightData);       
        }
    
        function gethumidityData()  {
          for (var i=0; i<prevHoursData.readings.length; i++) {
              prevHumidityData.readings.push({
                  "day": prevHoursData.readings[i].day,
                  "hour": prevHoursData.readings[i].hour,
                  "value": prevHoursData.readings[i].temperature
              });
          }
          console.log(prevHumidityData);       
        }
    
        function getSunLightData()  {
          for (var i=0; i<prevHoursData.readings.length; i++) {
              prevSunlightData.readings.push({
                  "day": prevHoursData.readings[i].day,
                  "hour": prevHoursData.readings[i].hour,
                  "value": prevHoursData.readings[i].temperature
              });
          }
          console.log(prevSunlightData);       
        }
        
    
        function get_latest_readings(nodesIds) {
            for (var i=0; i<nodesIds; i++) {
              xhr.open("GET", "http://sproutlabs-dev.herokuapp.com/api/nodes/" + i  +"/latest_reading");
              xhr.setRequestHeader('Authorization', "QRESkJWzMesUozNu6vfGJDcjKxGjzJ");
              xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
              xhr.onload = get_latest_readings_complete;
              xhr.send();  
            }
            
                  
        }
    
        function get_latest_readings_complete() {
            var response = JSON.parse(xhr.responseText);
            console.log(response);
            latestReadings.nodes.push({
                    "nodeId" : response.nodeId,
                    "humidity" : response.humidity,
                    "temperature" : response.temperature,
                    "sunlight": response.sunlight,
                    "moisture": response.moisture,
                    "battery" : response.battery
                });
            console.log(latestReadings);
            

        }
        function get_node_limits() {
            xhr.open("GET", "http://sproutlabs-dev.herokuapp.com/api/users/getuser");
            xhr.setRequestHeader('Authorization', "QRESkJWzMesUozNu6vfGJDcjKxGjzJ");
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onload = get_node_limits_complete;
            xhr.send(); 
        }
         function get_node_limits_complete() {
            var response = JSON.parse(xhr.responseText);
            console.log(response);
            for(var i=0; i<response.nodes.length; i++) {
               sensorNodeLimits.nodes.push({
                    "nodeId" : response.nodes[i].id,
                    "tempMin" : response.nodes[i].tempMin,
                    "tempMax" : response.nodes[i].tempMax,
                    "humidityMin" : response.nodes[i].humidityMin,
                    "humidityMax" : response.nodes[i].humidityMax,
                    "moistureMin" : response.nodes[i].moistureMin,
                    "moistureMax" : response.nodes[i].moistureMax,
                    "sunlightMin" : response.nodes[i].sunlightMin,
                    "sunlightMax" : response.nodes[i].sunlightMax,
                    
                }); 
            }
            console.log(sensorNodeLimits); 

        }