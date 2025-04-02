import authProvider, { broadcasterAuthProvider as BCAuthFunction } from "../lib/auth";
import { ApiClient } from "@twurple/api";
const api = new ApiClient({ authProvider })
export default api
const broadcasterApi = BCAuthFunction !== undefined ? new ApiClient({ authProvider: await BCAuthFunction() }) : undefined
export { broadcasterApi }
