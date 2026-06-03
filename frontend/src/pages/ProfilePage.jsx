import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Mail, LogOut } from 'lucide-react';
import Navbar from '../components/organisms/Navbar';
import UserAvatar from '../components/atoms/UserAvatar';
import ProfileCard from '../components/atoms/ProfileCard';
import ProfileInfoRow from '../components/atoms/ProfileInfoRow';
import UpdateNameForm from '../components/molecules/UpdateNameForm';
import ChangePasswordForm from '../components/molecules/ChangePasswordForm';
import { useAuth } from '../context/AuthContext';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ProfilePage = () => {
  const { user, token, login, logout } = useAuth();
  const navigate = useNavigate();

  const isGoogleUser = !!user?.avatar && !user?.hasPassword;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-10 flex flex-col gap-6">
        <div>
          <p className="text-xs font-medium tracking-widest text-primary uppercase">Akun</p>
          <h1 className="text-2xl font-medium text-neutral-900 mt-0.5">Profil Saya</h1>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 px-6 py-6 flex items-center gap-5">
          <div className="relative flex-shrink-0">
            <UserAvatar user={user} size="xl" />

            {user?.avatar && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border border-neutral-200 flex items-center justify-center shadow-sm" title="Foto dari Google">
                <svg width="14" height="14" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
              </div>
            )}

            {!user?.avatar && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full border-2 border-white flex items-center justify-center cursor-pointer hover:bg-primary-dark transition-colors">
                <Camera size={11} className="text-white" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1 min-w-0">
            <p className="text-lg font-medium text-neutral-900 truncate">{user?.name ?? 'Pengguna LumiSkin'}</p>
            <p className="text-sm text-neutral-400 truncate">{user?.email}</p>
            <div className="flex items-center gap-1.5 mt-1">
              {user?.avatar ? (
                <span className="inline-flex items-center gap-1 text-xs bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full">
                  <svg width="10" height="10" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  Masuk via Google
                </span>
              ) : (
                <span className="text-xs bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full">Email & Password</span>
              )}
            </div>
          </div>
        </div>

        <ProfileCard title="Informasi Akun" icon={Mail}>
          <ProfileInfoRow label="Nama Lengkap" value={user?.name} />
          <ProfileInfoRow label="Email" value={user?.email} badge="Terverifikasi" />
          <ProfileInfoRow label="Metode Login" value={user?.avatar ? 'Google OAuth' : 'Email & Password'} />
        </ProfileCard>

        <UpdateNameForm user={user} token={token} login={login} baseUrl={BASE_URL} />

        {!isGoogleUser ? (
          <ChangePasswordForm token={token} baseUrl={BASE_URL} />
        ) : (
          <ProfileCard title="Keamanan Akun" icon={ChangePasswordForm.Icon || Mail}>
            <div className="flex items-start gap-3 text-sm text-neutral-500 bg-neutral-50 rounded-xl p-4">
              <svg className="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <p className="leading-relaxed">
                Akun kamu terhubung dengan Google. Password dikelola langsung oleh Google — ubah di{' '}
                <a href="https://myaccount.google.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                  myaccount.google.com
                </a>
                .
              </p>
            </div>
          </ProfileCard>
        )}

        <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium px-4 py-2.5 rounded-xl border border-red-200 hover:bg-red-50 transition-all w-fit cursor-pointer">
          <LogOut size={15} />
          Keluar dari Akun
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
