import authProvider  from "../lib/auth";
import { ApiClient } from "@twurple/api";
const api = new ApiClient({ authProvider })
export default api