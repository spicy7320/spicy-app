import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';
import { Helmet } from 'react-helmet';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError('Invalid admin credentials. Access denied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login - Spark</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
        <Card className="w-full max-w-md border-primary/50 bg-card shadow-[0_0_30px_rgba(255,0,0,0.15)]">
          <CardHeader className="text-center border-b border-primary/20 pb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/50">
              <ShieldAlert className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-primary uppercase tracking-widest">System Access</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-muted-foreground">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@spark.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-secondary border-primary/30 focus-visible:ring-primary text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-muted-foreground">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-secondary border-primary/30 focus-visible:ring-primary text-white"
                />
              </div>
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/50 rounded-md">
                  <p className="text-sm text-destructive text-center font-medium">{error}</p>
                </div>
              )}
              <Button type="submit" className="w-full bg-primary text-black hover:bg-primary/90 font-bold tracking-wide" disabled={loading}>
                {loading ? 'AUTHENTICATING...' : 'AUTHORIZE'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdminLoginPage;