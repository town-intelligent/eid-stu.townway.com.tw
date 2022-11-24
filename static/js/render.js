export function convert_project_weight_to_render_json(obj_project_weight) {
  var obj_result = [];

  for (const key in obj_project_weight){
    var obj_weight = {}
    obj_weight.letter = `${key}`;
    obj_weight.frequency = `${obj_project_weight[key]}`;
    obj_result.push(obj_weight);
  }

  return obj_result;
}