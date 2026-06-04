import { useState } from "react";
import ForgotPasswordForm from "../components/molecules/ForgotPasswordForm";
import ForgotPasswordSuccess from "../components/molecules/ForgotPasswordSuccess";
import AuthShell from "../components/organisms/AuthShell";
import { forgotPassword as forgotPasswordApi } from "../services/api";

const ForgotPasswordPage = () => {
  const [isSent, setIsSent] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setServerError("");

    if (!email) {
      setEmailError("Email wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      await forgotPasswordApi(email);
      setIsSent(true);
    } catch (err) {
      setServerError(
        err.response?.data?.message ||
          "Gagal mengirim email. Silakan coba lagi.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <div className="w-full max-w-md bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 flex flex-col gap-6">
        {isSent ? (
          <ForgotPasswordSuccess email={email} />
        ) : (
          <ForgotPasswordForm
            email={email}
            setEmail={setEmail}
            emailError={emailError}
            serverError={serverError}
            loading={loading}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </AuthShell>
  );
};

export default ForgotPasswordPage;
