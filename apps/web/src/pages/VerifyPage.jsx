import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';

const VerifyPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    const confirm = async () => {
      try {
        if (!token) throw new Error("No token");
        
        // This triggers the verification in PocketBase
        await pb.collection('users').confirmVerification(token);
        
        alert('Account successfully verified! Redirecting to login...');
        navigate('/login');
      } catch (err) {
        console.error(err);
        alert('Verification failed. The link might be invalid or expired.');
        navigate('/signup');
      }
    };

    confirm();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white">
      <h1 className="text-2xl font-black uppercase tracking-widest">Verifying your account...</h1>
    </div>
  );
};

export default VerifyPage;