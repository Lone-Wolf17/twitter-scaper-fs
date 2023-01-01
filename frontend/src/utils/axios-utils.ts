import axios from "axios";
import { BackendEndpoints } from "../constants/BackendEndpoints";

const axiosInstance = axios.create({
  baseURL: BackendEndpoints.baseUrl,
});

export default axiosInstance;
