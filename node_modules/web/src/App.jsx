import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext'; 
import { FilterProvider } from '@/contexts/FilterContext.jsx';
import Header from '@/components/Header';
import RegisterTypeModal from '@/components/RegisterTypeModal.jsx';
import { AppLayout } from '@/components/AppLayout.jsx'; 

import Home from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import ProviderSignup from './components/ProviderSignup'; 
import LocationPage from './pages/LocationPage.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import UserProfilePage from './pages/UserProfilePage.jsx';
import EditProfilePage from './pages/EditProfilePage.jsx';
import VerifyPage from './pages/VerifyPage.jsx';
import SubscriptionPage from './pages/SubscriptionPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import StatisticsPage from './pages/StatisticsPage.jsx';
import ProviderProfilePage from './pages/ProviderProfilePage.jsx';

// 🔐 IMPORTS FOR FORGOT PASSWORD
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';

function App() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  return (
    <Router>
      <AuthProvider>
        <AdminAuthProvider>
          <FilterProvider>
            <AppLayout>
              <div className="min-h-screen max-w-7xl mx-auto bg-[#0F0F0F]/80 backdrop-brightness-150 shadow-[0_0_60px_rgba(0,0,0,0.85)] border-x border-neutral-800/40 flex flex-col">
                <Header onOpenRegisterModal={() => setIsRegisterModalOpen(true)} />

                <main className="flex-grow bg-transparent text-foreground">
                  <Routes>
                    {/*  Main Pages */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/signup-provider" element={<ProviderSignup />} />
                    
                    {/* 📍 Browsing & Profiles */}
                    <Route path="/location/:cityName" element={<LocationPage />} />
                    <Route path="/category/:categoryName" element={<CategoryPage />} />
                    <Route path="/profile" element={<UserProfilePage />} />
                    <Route path="/edit-profile" element={<EditProfilePage />} />
                    <Route path="/provider/:id" element={<ProviderProfilePage />} />
                    
                    {/* ⚙️ User Settings & Account */}
                    <Route path="/verify" element={<VerifyPage />} />
                    <Route path="/subscription" element={<SubscriptionPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/statistics" element={<StatisticsPage />} />
                    
                    {/* 🔐 Forgot Password Routes */}
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password/*" element={<ResetPasswordPage />} />
                    
                    {/* 🔐 CATCH-ALL ROUTE - Must be LAST inside Routes */}
                    <Route path="*" element={<ResetPasswordPage />} />
                  </Routes>
                </main>

                <RegisterTypeModal 
                  isOpen={isRegisterModalOpen} 
                  onClose={() => setIsRegisterModalOpen(false)} 
                />
              </div>
            </AppLayout>
          </FilterProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;