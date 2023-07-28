export default function concatParams(params) {
  let paramsStrs = '?';
  for (const [key, value] of Object.entries(params)) {
    paramsStrs += `${key}=${value}&`;
  }
  return paramsStrs.slice(0, -1);
}
