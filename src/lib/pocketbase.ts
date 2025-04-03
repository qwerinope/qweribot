import PocketBase from 'pocketbase'
const PBURL = process.env.PBURL ?? 'http://pocketbase:8090'
const pb = new PocketBase(PBURL)
export default pb
