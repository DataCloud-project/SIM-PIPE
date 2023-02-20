// IP address of host running the simpipe controller and exposing graphql API
// export let SIM_PIPE_CONTROLLER_URL = 'https://192.168.0.249:9000/graphql';
export const SIM_PIPE_CONTROLLER_URL =
  import.meta.env.VITE_SIM_PIPE_CONTROLLER_URL ?? 'https://simpipe.sct.sintef.no/graphql';
export const SIM_PIPE_CONVERTER_URL =
  import.meta.env.VITE_SIM_PIPE_CONVERTER_URL ?? 'https://simpipe.sintef.no/convert/';
export const TODO_PARAMETER = 'dummy';
