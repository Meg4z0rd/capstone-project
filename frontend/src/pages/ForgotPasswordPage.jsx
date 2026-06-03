import { useState } from 'react';
import ForgotPasswordForm from '../components/molecules/ForgotPasswordForm';
import ForgotPasswordSuccess from '../components/molecules/ForgotPasswordSuccess';
import AuthShell from '../components/organisms/AuthShell';

const ForgotPasswordPage = () => {
  const [isSent, setIsSent] = useState(false);
  const [email, setEmail] = useState('');

  const handleSuccess = (submittedEmail) => {
    setEmail(submittedEmail);
    setIsSent(true);
  };

  return (
    <AuthShell>
      <div className="w-full max-w-md bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 flex flex-col gap-6">{isSent ? <ForgotPasswordSuccess email={email} /> : <ForgotPasswordForm onSuccess={handleSuccess} />}</div>
    </AuthShell>
  );
};

export default ForgotPasswordPage;
