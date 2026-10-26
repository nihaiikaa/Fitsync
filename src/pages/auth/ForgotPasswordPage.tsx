import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { authService } from '../../services/authService';
import { useToast } from '../../context/ToastContext';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
      showToast('Reset link sent to your email', 'success');
    } catch {
      showToast('Failed to send reset link', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#111318] border border-[#202530] rounded-2xl p-6 sm:p-8 shadow-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Reset Password</h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Enter your registered email to receive recovery instructions.
        </p>
      </div>

      {submitted ? (
        <div className="text-center py-6">
          <div className="w-12 h-12 rounded-full bg-[#10E567]/15 border border-[#10E567]/30 flex items-center justify-center text-[#10E567] mx-auto mb-4">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-white mb-2">Check Your Inbox</h4>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto mb-6">
            We sent instructions to <span className="text-white font-medium">{email}</span>. Click the link to set a new password.
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setSubmitted(false)}
          >
            Resend Email
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="your-email@fitsync.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <Button
            type="submit"
            variant="brand"
            className="w-full mt-2"
            isLoading={loading}
          >
            Send Password Reset Link
          </Button>
        </form>
      )}

      <div className="mt-6 pt-5 border-t border-[#202530] text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Login
        </Link>
      </div>
    </div>
  );
};
