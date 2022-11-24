import { convert_project_weight_to_render_json } from './render.js'
import {Runtime, Inspector} from "https://cdn.jsdelivr.net/npm/@observablehq/runtime@4/dist/runtime.js";
import notebook from  "https://api.observablehq.com/d/d3e0f3933b2d6038.js?v=3";

export function draws(weight_project) {
  /* var arr_task_uuid = [id_project];
  var weight_project = getProjectWeight(arr_task_uuid); */
  var input_for_render = convert_project_weight_to_render_json(weight_project);
  const runtime = new Runtime();
  const main = runtime.module(notebook, name => {
    if (name === "chart") return new Inspector(document.querySelector("#observablehq-chart-b9eea16e1"));
    
    return ["udpdate","trigger"].includes(name);
  });
  main.redefine("alphabet", input_for_render);
}