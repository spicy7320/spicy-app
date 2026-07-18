import PocketBase from 'pocketbase';

// Use your local network IP so it works when accessing from 192.168.100.16
   // Force redeploy
const pb = new PocketBase('https://spicy-backend-o17f.onrender.com');
// Disable auto-cancellation to prevent React Strict Mode errors
pb.autoCancellation(false);

export default pb;