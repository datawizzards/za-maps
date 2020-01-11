$(document).ready(function(){

	var show = $('.button.active').val();

	 $('.button').click(function() {
        $('.button').removeClass('active')
        $(this).addClass('active')

        console.log($(this).val());
        show = $(this).val();
        visualize(show);

    })

	visualize(show);

	function visualize(show){

		d3.select("svg").remove();

	    var svg = d3.select("main").append("svg").attr("width","960").attr("height", "700"),
	        width = +svg.attr("width"),
	        height = +svg.attr("height");

	    var projection = d3.geoAlbers()
	        .center([24.7, -29.2])
	        .rotate([0, 0, 12])
	        .parallels([-22.1, -34.1])
	        .scale(3000)
	        .translate([200, 600]);

	    var path = d3.geoPath()
	        .projection(projection);

	    var color = d3.scaleThreshold()
	        .domain(d3.range(2, 10))
	        .range(d3.schemeBlues[9]);

	    var colors = {
	        "Northern Cape": "#64B5F6",
	        "NC": "#64B5F6",  
	        "Mpumalanga":"#4DD0E1", 
	        "MP":"#4DD0E1", 
	        "KwaZulu-Natal":"#81C784",
	        "KZN":"#81C784",
	        "Western Cape": "#BA68C8",
	        "WC": "#BA68C8",
	        "Free State": "#DCE775",
	        "FS": "#DCE775",
	        "North West": "#FFF176",
	        "NW": "#FFF176",
	        "Gauteng": "#F06292",
	        "GT": "#F06292",
	        "Limpopo": "#E57373",
	        "LIM": "#E57373",
	        "Eastern Cape": "#FFB74D",
	        "EC": "#FFB74D"
	    }

	    var data_points = {
	        "Northern Cape": 253, 
	        "Mpumalanga": 550, 
	        "KwaZulu-Natal": 800,
	        "Western Cape": 600,
	        "Free State": 563,
	        "North West": 234,
	        "Gauteng":  223,
	        "Limpopo": 123,
	        "Eastern Cape": 12
	    }

	    var tooltip = d3.select('body')
	        .append('div')
	        .attr('class', 'tooltip')
	        .style('opacity', 0);

	    var promises = {"Province": d3.json("geojson/za-provinces.topojson"),
	    	"District": d3.json("geojson/za-districts.topojson"),
	    	"Local": d3.json("geojson/za-local.topojson"),
	    	"Wards": d3.json("geojson/za-wards.topojson"),
	    }

	    Promise.all([promises[show]]).then(ready)

	    d3.selectAll("g > *").remove()

	    // STRARTS HERE
	    function ready([data]){

	        console.log(data);
	        console.log(topojson.feature(data, data.objects.layer1).features);

	        svg.append("g")
	            .attr("class", "layer1")
	          .selectAll("path")
	          .data(topojson.feature(data, data.objects.layer1).features)

	          .enter().append("path")
	            .attr("fill", d => colors[d.properties.PROVINCE] || '#19865C')
	            .attr("d", path)
	            .on('mouseover', function(d){
	                tooltip.transition()
	                  .duration(200)
	                  .style('opacity', 0.9);

	                tooltip.html('<b>' + d.properties.PROVINCE + '</b><hr/>' + 'Number of people : ' + data_points[d.properties.PROVINCE])
	                  .style('left', d3.event.pageX + 'px')
	                  .style('top', d3.event.pageY - 28 +'px');
	              })
	            .on('mouseout', () => {
	              tooltip.transition()
	                .duration(500)
	                .style('opacity', 0);
	            });
	          // THIS IS TITLE TOOLTIP
	          // .append("title")
	          //   .text(d => d.properties.PROVINCE + ': ' + 7 + "%");


	        svg.append("path")
	            .datum(topojson.mesh(data, data.arcs, (a, b) => a !== b))
	            .attr("class", "province")
	            //.attr("stroke-width", '10px')
	            .attr("d", path);

	    }
	    //ENDS HERE 
	}
        


});