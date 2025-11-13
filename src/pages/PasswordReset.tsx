import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import db from '@/lib/database';
import { validatePasswordResetToken } from '@/lib/passwordReset';

const PasswordReset = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [step, setStep] = useState<'validate' | 'reset' | 'success'>('validate');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const handleValidateToken = async () => {
    if (!token) {
      toast({
        title: 'Error',
        description: 'No reset token provided',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const result = await validatePasswordResetToken(token);
      if (result.valid && result.userId) {
        setUserId(result.userId);
        setStep('reset');
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Invalid or expired reset token',
          variant: 'destructive',
        });
        setTimeout(() => navigate('/auth'), 3000);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to validate reset token',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast({
        title: 'Error',
        description: 'Please fill in all password fields',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: 'Error',
        description: 'Password must be at least 8 characters',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      if (userId) {
        await db.profiles.upsert({
          user_id: userId,
          password_hash: btoa(newPassword),
        });

        if (token) {
          const resetToken = await db.passwordResetTokens.getByToken(token);
          if (resetToken) {
            await db.passwordResetTokens.markAsUsed(resetToken.id);
          }
        }

        toast({
          title: 'Success',
          description: 'Your password has been reset',
        });
        setStep('success');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reset password',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-md">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              {step === 'validate' && (
                <>
                  <CardHeader>
                    <CardTitle>Validate Reset Token</CardTitle>
                    <CardDescription>We're verifying your password reset request</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Checking if your password reset token is valid and not expired...
                    </p>
                    <Button
                      onClick={handleValidateToken}
                      disabled={loading || !token}
                      className="w-full"
                      size="lg"
                    >
                      {loading ? 'Validating...' : 'Validate Token'}
                    </Button>
                    {!token && (
                      <p className="text-sm text-red-600 text-center">
                        No reset token found. Check your reset link.
                      </p>
                    )}
                  </CardContent>
                </>
              )}

              {step === 'reset' && (
                <>
                  <CardHeader>
                    <CardTitle>Reset Password</CardTitle>
                    <CardDescription>Enter your new password</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password (min 8 characters)"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <Button
                      onClick={handleResetPassword}
                      disabled={loading}
                      className="w-full"
                      size="lg"
                    >
                      {loading ? 'Resetting...' : 'Reset Password'}
                    </Button>
                  </CardContent>
                </>
              )}

              {step === 'success' && (
                <>
                  <CardHeader>
                    <CardTitle className="text-green-600">Password Reset Successful</CardTitle>
                    <CardDescription>Your password has been updated</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 text-center">
                    <p className="text-sm text-gray-600">
                      You can now log in with your new password.
                    </p>
                    <Button
                      onClick={() => navigate('/auth')}
                      className="w-full"
                      size="lg"
                    >
                      Return to Login
                    </Button>
                  </CardContent>
                </>
              )}
            </Card>

            {step !== 'success' && (
              <button
                onClick={() => navigate('/auth')}
                className="mt-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </button>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PasswordReset;
