import axios from "axios";
import { baseUrl } from "./Constants";


export default axios.create({
  baseURL: baseUrl,


  headers: {
    "Content-type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*"
  },
  mode: "cors"
});