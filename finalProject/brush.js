var duration = 24*30*12;
var prev_duration = duration;
var prevHoursData = {
    readings: []
};
var data_set = {
    readings: []
};
var dataType = "temperature";
var request_complete = false;
//var data = [];
var nodeId = 1;
var URL = "";
var hash_table = [];
/* http request builder */
var xhr = new XMLHttpRequest();
//get_readings_prev_hours();


/* testing git push */
var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 110, left: 40},
    margin2 = {top: 430, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    height2 = +svg.attr("height") - margin2.top - margin2.bottom;

var parseDate = d3.timeParse("%b %Y");

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
    .x(function(d) { return x(parseDate(d.date)); })
    .y0(height)
    .y1(function(d) { return y(+d.value); });

var area2 = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return x2(parseDate(d.date)); })
    .y0(height2)
    .y1(function(d) { return y2(+d.value); });

    var areaA = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return x(parseDate(d.date)); })
    .y0(height)
    .y1(function(d) { return y(+d.value); });

var area2A = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return x2(parseDate(d.date)); })
    .y0(height2)
    .y1(function(d) { return y2(+d.value); });

svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");




function plotGraph() {
  console.log("New Data");
  console.log(data);
  
  x.domain(d3.extent(data, function(d) { return parseDate(d.date); }));
  y.domain([0, d3.max(data, function(d) { return +d.value; })]);
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

  focus.append("g")
      .attr("class", "axis axis--y")
      .call(yAxis);

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

  svg.append("rect")
      .attr("class", "zoom")
      .attr("width", width)
      .attr("height", height)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(zoom);
}

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
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct','Nov','Dec'];
    for (var i=0; i<response.length; i++) {
        date = new Date(response[i].updatedAt);
        prevHoursData.readings.push({
            "day": Math.ceil(((i)/8) + 1),
            "hour": (i+1),
            "humidity" : response[i].humidity,
            "temperature" : response[i].temperature,
            "battery" : response[i].battery,
            "date" :  months[date.getMonth()] + " " + date.getFullYear().toString()  
        });
    } // for loop
    console.log(prevHoursData);
    request_complete = true;
    buildTable(dataType);
    data = data_set.readings;
    plotGraph();
}


function brushed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
  var s = d3.event.selection || x2.range();
  x.domain(s.map(x2.invert, x2));
  focus.select(".area").attr("d", area);
  focus.select(".axis--x").call(xAxis);
  svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
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

function buildTable(datatype) {
    console.log(prevHoursData.readings.length);
    for (var i=0; i<prevHoursData.readings.length; i++) {
        if(datatype == "temperature") {
            hash_table[prevHoursData.readings[i].date] =  prevHoursData.readings[i].temperature;
        } else if(datatype == "humidity") {
            hash_table[prevHoursData.readings[i].date] =  prevHoursData.readings[i].humidity;
        } else if(datatype == "battery") {
            hash_table[prevHoursData.readings[i].date] =  prevHoursData.readings[i].battery;
        } else if(datatype == "moisture") {
            hash_table[prevHoursData.readings[i].date] =  prevHoursData.readings[i].moisture;
        } else if(datatype == "sunlight") {
            hash_table[prevHoursData.readings[i].date] =  prevHoursData.readings[i].sunlight;
        } 
    }
    for(var key in hash_table ) {
      if (hash_table.hasOwnProperty(key)) {
        data_set.readings.push({
          "date": key,
          "value": hash_table[key]
        });
      } 
  }
}

function selectNodeId() {
    nodeId = document.getElementById("nodeId").value;
    get_readings_prev_hours();
    
}


function selectVariable() {
    datatype = document.getElementById("variable").value;
    get_readings_prev_hours();
    
}
/* set  duration */
function setDuration(hours) {
    prev_duration = duration;
    duration = hours;
    get_readings_prev_hours();
    //return duration;
}
