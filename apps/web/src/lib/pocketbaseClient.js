import PocketBase from 'pocketbase';

// Connect to Render backend
const pb = new PocketBase('https://spicy-backend-o17f.onrender.com');

// Disable auto-cancellation to prevent React Strict Mode errors
pb.autoCancellation(false);

export default pb;