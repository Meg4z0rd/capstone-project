/**
 * UserAvatar — menampilkan foto profil Google atau inisial nama
 *
 * Props:
 *   user  : object { name, email, avatar }  — dari useAuth()
 *   size  : 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 *
 * Penggunaan:
 *   import UserAvatar from '../components/atoms/UserAvatar';
 *   <UserAvatar user={user} size="lg" />
 */

const SIZE = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-16 h-16 text-xl',
  xl: 'w-24 h-24 text-3xl',
};

const UserAvatar = ({ user, size = 'sm', className = '' }) => {
  const dim = SIZE[size] ?? SIZE.sm;

  const initials = (user?.name ?? user?.email ?? 'U')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user?.name ?? 'Foto Profil'}
        referrerPolicy="no-referrer"  // WAJIB — tanpa ini foto Google diblokir browser
        className={`${dim} rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0 ${className}`}
      />
    );
  }

  // Fallback: lingkaran dengan inisial nama
  return (
    <div className={`${dim} rounded-full bg-primary text-white font-semibold flex items-center justify-center flex-shrink-0 ${className}`}>
      {initials}
    </div>
  );
};

export default UserAvatar;
