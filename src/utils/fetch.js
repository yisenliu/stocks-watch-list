import axios from 'axios';

export default function fetch(parameters) {
  return axios(parameters);
}
export const createInstance = axios.create;
