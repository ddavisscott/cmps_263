var min = 10;
    var max = 70;
    var margin = { top: 50, right: 0, bottom: 100, left: 30 },
          width = 960 - margin.left - margin.right,
          height = 800 - margin.top - margin.bottom,
          gridSize = Math.floor(width / 10),
          legendElementWidth = gridSize*2,
          buckets = 9,
          //colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively 
          colors = ["#ffffbf","#1a9641","#fdae61","#d7191c"];
          //colorbrewer.YlGnBu[9]
           days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
          times = ["5a", "10a", "3p",  "8p","12p"];
          datasets = ["binary_node1_humidity.tsv", "binary_node1_temp.tsv", "binary_node1_moisture.tsv","binary_node1_light.tsv"
                     ,"binary_node2_humidity.tsv", "binary_node2_temp.tsv", "binary_node2_moisture.tsv","binary_node2_light.tsv"
                     ,"binary_node3_humidity.tsv", "binary_node3_temp.tsv", "binary_node3_moisture.tsv","binary_node3_light.tsv"];

      var svg = d3.select(".binary")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var dayLabels = svg.selectAll(".dayLabel")
          .data(days)
          .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * gridSize; })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
            .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

      var timeLabels = svg.selectAll(".timeLabel")
          .data(times)
          .enter().append("text")
            .text(function(d) { return d; })
            .attr("x", function(d, i) { return i * gridSize; })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize / 2 + ", -6)")
            .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

      var heatmapChart = function(tsvFile) {
        d3.tsv(tsvFile,
        function(d) {
          return {
            day: +d.day,
            hour: +d.hour,
            value: +d.value
          };
        },
        function(error, data) {
            console.log(data);
 
            var colorScale = d3.scaleQuantile()
              .domain([0, buckets - 1, d3.max(data, function (d) { return d.value; })])
              .domain([min, max-10, max])
              .range(colors);

          var cards = svg.selectAll(".hour")
              .data(data, function(d) {return d.day+':'+d.hour;});

          cards.append("title");

          cards.enter().append("rect")
              .attr("x", function(d) { return (d.hour - 1) * gridSize; })
              .attr("y", function(d) { return (d.day - 1) * gridSize; })
              .attr("rx", 6)
              .attr("ry", 6)
              .attr("class", "hour bordered")
              .attr("width", gridSize)
              .attr("height", gridSize)
              .style("fill", colors[0]);

          cards.transition().duration(1000)
              .style("fill", function(d) { return colorScale(d.value); });

          cards.select("title").text(function(d) { return d.value; });
          
          cards.exit().remove();

        

        });  
      };

      heatmapChart(datasets[1]);
      
      var datasetpicker = d3.select("#dataset-picker").selectAll(".dataset-button")
        .data(datasets);

      datasetpicker.enter()
        .append("input")
        .attr("value", function(d){ return "Dataset " + d })
        .attr("type", "button")
        .attr("id", "change")
        .on("click", function(d) {
          heatmapChart(d);
        });