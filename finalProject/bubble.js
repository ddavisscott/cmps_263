var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");
    


var nodes_data =  [
    {"name": "Router", "type": "router", "usage":31},
    {"name": "Extender1", "type": "router", "usage":31},
    {"name": "Extender2", "type": "router", "usage":31},
    {"name": "Extender3", "type": "router", "usage":31},
    {"name": "Extender4", "type": "router", "usage":31},
    {"name": "Extender5", "type": "router", "usage":31},
    {"name": "Extender6", "type": "router", "usage":31},
    {"name": "Iphone1", "type": "weak", "usage":41},
    {"name": "Camera1", "type": "strong", "usage":41},
    {"name": "TV", "type": "average", "usage":55},
    {"name": "Lock", "type": "average", "usage":55},
    {"name": "TV2", "type": "weak", "usage":51},
    {"name": "Lock2", "type":"weak", "usage":31},
    {"name": "TV3", "type": "strong", "usage":31},
    {"name": "Lock3", "type":"strong", "usage":51},
    {"name": "Lock4", "type":"average", "usage":31},
    {"name": "TV4", "type": "strong", "usage":31},
    {"name": "Lock5", "type":"average", "usage":51},
     {"name": "TV5", "type": "strong", "usage":21},
    {"name": "Lock6", "type":"strong", "usage":21},
    {"name": "Iphone2", "type": "strong", "usage":41},
    {"name": "Camera2", "type": "average", "usage":41}
   
   
    ]
//Sample links data 
//type: A for Ally, E for Enemy
var links_data = [
    {"source": "Router", "target": "Extender1", "type":"A", "dist":10 },
    {"source": "Router", "target": "Extender2", "type":"A", "dist":10},
    {"source": "Router", "target": "Extender3", "type":"A", "dist":10},
    {"source": "Router", "target": "Extender4", "type":"A", "dist":10},
    {"source": "Router", "target": "TV5", "type":"A", "dist":10},
    {"source": "Router", "target": "Lock6", "type":"A", "dist":10},
    {"source": "Extender1", "target": "Iphone1", "type":"A", "dis":10},
    {"source": "Extender1", "target": "Camera1", "type":"A", "dist":10},
    {"source": "Extender2", "target": "TV", "type":"A", "dist":10},
    {"source": "Extender2", "target": "Lock", "type":"A", "dist":10},
    {"source": "Extender3", "target": "TV2", "type":"E", "dist":10},
    {"source": "Extender3", "target": "Lock2", "type":"A", "dist":10},
    {"source": "Extender4", "target": "TV3", "type":"A", "dist":10},
    {"source": "Extender4", "target": "Lock3", "type":"E", "dist":10},
    {"source": "Extender1", "target": "Lock4", "type":"A", "dist":10},
    {"source": "Extender2", "target": "TV4", "type":"A", "dist":10},
    {"source": "Extender5", "target": "Lock5", "type":"E", "dist":10},
    {"source": "Extender5", "target": "Extender6", "type":"E", "dist":10},
    {"source": "Extender6", "target": "Extender6", "type":"E", "dist":10},
    {"source": "Extender1", "target": "Iphone2", "type":"A", "dis":10},
    {"source": "Extender1", "target": "Camera2", "type":"A", "dist":10},
    {"source": "Extender3", "target": "Extender5", "type":"E", "dist":10},
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
            div_tooltip	.html(d.name + "<br/>" )	
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