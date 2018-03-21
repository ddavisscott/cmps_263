function refreshGraph(){
    
    
// select the element that will be replaced
var el = document.querySelector('.brushingDiv');

// <a href="/javascript/manipulation/creating-a-dom-element-51/">create a new element</a> that will take the place of "el"
var newEl = document.createElement('div');
newEl.className = "brushingDiv";
newEl.innerHTML = '<svg width="800" height="500" class = "brushing" ></svg>';

// replace el with newEL
el.parentNode.replaceChild(newEl, el);
    
    //var elem = document.getElementById('brushing');
    //elem.parentNode.removeChild(elem);
var yLabel = "Temperature in C";
var nodeId = document.getElementById("nodeId").value;
var sensor = document.getElementById("sensor").value;
    console.log("sensor:" +sensor);
    
    
console.log("node Id1: "+nodeId);
var dataTpye = "Temperature";
var dataSource;

if (nodeId == 1){
    dataSource = "data1.csv";
}

if (nodeId == 2){
    dataSource = "data2.csv";
}
    if (nodeId == 3){
    dataSource = "data3.csv";
}


    

    

  
    
   
    console.log("node Id2: "+nodeId);
    

    console.log(dataSource);
    

// get the sensor type from select
function selectVariable() {
    datatype = document.getElementById("variable").value;
    console.log("Value selected " + datatype);
    if(datatype == "temperature") {
        yLabel = "Temperature in C"
    }
    else {
        yLabel = "";
    }
    //get_readings_prev_hours();
    
}




var svg2 = d3.select(".brushing"),
    margin = {top: 20, right: 20, bottom: 110, left: 40},
    margin2 = {top: 430, right: 20, bottom: 30, left: 40},
    width = +svg2.attr("width") - margin.left - margin.right,
    height = +svg2.attr("height") - margin.top - margin.bottom,
    height2 = +svg2.attr("height") - margin2.top - margin2.bottom;

//var parseDate = d3.timeParse("%I %d %b %Y");
var parseDate = d3.timeParse("%d %m %Y");


var x = d3.scaleTime().range([0, width]),
    x2 = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    y2 = d3.scaleLinear().range([height2, 0]);

var xAxis = d3.axisBottom(x),
    xAxis2 = d3.axisBottom(x2),
    yAxis = d3.axisLeft(y);

var brush = d3.brushX()
    .extent([[0, 0], [width, height2]])
    .on("brush end", brushed);

var zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on("zoom", zoomed);

var area = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return x(d.date); })
    .y0(height)
    .y1(function(d) { return y(d.price); });

var area2 = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return x2(d.date); })
    .y0(height2)
    .y1(function(d) { return y2(d.price); });

svg2.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var focus = svg2.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = svg2.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");



console.log("node Id: "+nodeId);

    console.log(dataSource);
    

d3.csv(dataSource, type, function(error, data) {
  if (error) throw error;

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.price; })]);
  x2.domain(x.domain());
  y2.domain(y.domain());

  focus.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area);

  focus.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
  focus.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 15) + ")")
      .style("text-anchor", "middle")
      .text("Timeline");
  focus.append("g")
      .attr("class", "axis axis--y")
      .call(yAxis);
// text label for the y axis
  focus.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left - 5 )
          .attr("x",0 - (height / 2) )
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text(yLabel);

  context.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area2);

  context.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis2);

  context.append("g")
      .attr("class", "brush")
      .call(brush)
      .call(brush.move, x.range());

  svg2.append("rect")
      .attr("class", "zoom")
      .attr("width", width)
      .attr("height", height)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(zoom);
});



//get data from URL
function send_http_request() {
    console.log(URL);
    xhr.open("GET", URL);
    xhr.setRequestHeader('Authorization', "QRESkJWzMesUozNu6vfGJDcjKxGjzJ");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = onrequestCompletion;
    xhr.send();
}

function get_readings_prev_hours() {
    URL = "http://sproutlabs-dev.herokuapp.com/api/nodes/prev_xh/" + nodeId +"?hours="+duration;
    send_http_request();
}

function onrequestCompletion() {
    console.log("Hello world");
    var response = JSON.parse(xhr.responseText);
    console.log(response);
    //var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October','November','December'];
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct','Nov','Dec'];
    prevHoursData.readings = [];
    for (var i=0; i<response.length; i++) {
        date = new Date(response[i].updatedAt);
        prevHoursData.readings.push({
            "day": Math.ceil(((i)/8) + 1),
            "hour": (i+1),
            "humidity" : response[i].humidity,
            "temperature" : response[i].temperature,
            "battery" : response[i].battery,
            "moisture" : response[i].moisture,
            "sunglight" : response[i].sunglight,
            "date" :  months[date.getMonth()] + " " + date.getFullYear().toString() ,
            "date2" : months[date.getMonth()] + " "+ date.getDay().toString() +" " + date.getFullYear().toString()
        });
    } // for loop
    console.log(prevHoursData);
    request_complete = true;
    buildTable();
    data = data_set.readings;
    plotGraph();
}

// Get the node id from select

/////////////////////////////////


function brushed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
  var s = d3.event.selection || x2.range();
  x.domain(s.map(x2.invert, x2));
  focus.select(".area").attr("d", area);
  focus.select(".axis--x").call(xAxis);
  svg2.select(".zoom").call(zoom.transform, d3.zoomIdentity
      .scale(width / (s[1] - s[0]))
      .translate(-s[0], 0));
}

function zoomed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
  var t = d3.event.transform;
  x.domain(t.rescaleX(x2).domain());
  focus.select(".area").attr("d", area);
  focus.select(".axis--x").call(xAxis);
  context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
}
//moisture,light,humidity,temperature,price
function type(d) {
  d.date = parseDate(d.date);
  //d.price = +d.price;

    switch (sensor) {
  case 'temperature':
    d.price = +d.temperature;
    yLabel = "Temperature  in F ";
    break;
  case 'humidity':
         d.price = +d.humidity;
         yLabel = "Humidity";
    break;
    case 'light':
         d.price = +d.light;
         yLabel = "Sunlight in lux";     
    break;
  
  default:
    d.price = +d.moisture; 
    yLabel = "Moisture in m3.m-3";
}
 
    
  return d;
}
}