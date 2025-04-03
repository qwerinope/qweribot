import authProvider, { broadcasterAuthProvider as BCAuthFunction } from "../lib/auth";
import { ApiClient } from "@twurple/api";
const api = new ApiClient({ authProvider })
export default api
const broadcasterAuthProvider = BCAuthFunction !== undefined ? await BCAuthFunction() : undefined
const broadcasterApi = broadcasterAuthProvider !== undefined ? new ApiClient({ authProvider: broadcasterAuthProvider }) : undefined
export { broadcasterApi, broadcasterAuthProvider }
