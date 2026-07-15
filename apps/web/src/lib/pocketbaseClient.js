import PocketBase from 'pocketbase';

// Use your local network IP so it works when accessing from 192.168.100.16
const pb = new PocketBase('http://127.0.0.1:8090');
// Disable auto-cancellation to prevent React Strict Mode errors
pb.autoCancellation(false);

export default pb;