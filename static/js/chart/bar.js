export function draw_bar(element_id, obj_project_weight, svg_width, svg_height, array_weight_colors, index_only, zero_draw) {
  // Remove zero vlaue
  if (zero_draw == false) {
    Object.keys(obj_project_weight).forEach(function(key){
      if (parseInt(obj_project_weight[key]) == 0 || obj_project_weight[key] == "0" || obj_project_weight[key] == null) {
        delete obj_project_weight[key]; 
      }
    });
  }

  // Parse the Data
  var object_keys = Object.keys(obj_project_weight);
  var object_values = Object.values(obj_project_weight);

  if (index_only == true) {
    var object_keys_new = [];
    object_keys.forEach(element => object_keys_new.push(element.substring(5,7)));
    object_keys = object_keys_new;
  }

  var object_values_new = [];
  object_values.forEach(element => object_values_new.push(parseInt(element)));
  object_values = object_values_new;

  // Set the dimensions and margins of the graph
  const margin = {top: 10, right: 30, bottom: 90, left: 40},
  width = svg_width - margin.left - margin.right,
  height = svg_height - margin.top - margin.bottom;

  // Append the svg object to the body of the page
  const svg = d3.select("#" + element_id)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
   
  // X axis
  const x = d3.scaleBand()
    .range([ 0, width ])
    .domain(object_keys)
    .padding(0.2);
    svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, d3.max(object_values)]) // Data range
    .range([ height, 0]); // SVG height
    svg.append("g")
    .call(d3.axisLeft(y));
    
  var setp = height/d3.max(object_values);
  for (var index = 0; index < object_values.length; index++) {
    // Bars
    var bar = svg.selectAll("mybar")
    .data(object_values)
    .enter()
    .append("rect")
    .attr("x", function(d) { return x(object_keys[index]); })
    .attr("width", x.bandwidth())
    //.attr("fill", array_weight_colors[parseInt(object_keys[index].substring(5,7))-1])
    .attr("fill", array_weight_colors[parseInt(object_keys[index])-1])
    .attr("height", d => 0)
    .attr("y", d => y(0))

    // Animation
    bar.transition()
    .ease(d3.easeLinear)
    .duration(800)
    .attr("height", d => object_values[index]*setp)
    .attr("y", d => y(object_values[index]))
    .delay((d,i) => {return i*100})
  }
}