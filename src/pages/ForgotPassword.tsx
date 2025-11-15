import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import db from '@/lib/database';
import { generatePasswordResetToken } from '@/lib/passwordReset';
import { getSupabase } from '@/lib/supabase';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const supabase = (() => {
    try {
      return getSupabase();
    } catch {
      return null;
    }
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: 'Error',
        description: 'Please enter your email address',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const profiles = await db.profiles.list();
      const userProfile = profiles.find((p: any) => p.email === email);

      if (!userProfile) {
        toast({
          title: 'Email not found',
          description: 'No account found with this email address',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      const resetToken = await generatePasswordResetToken(userProfile.user_id);
      const resetUrl = `${window.location.origin}/password-reset?token=${resetToken}`;

      if (supabase) {
        await supabase.functions.invoke('send-password-reset', {
          body: { email, resetUrl },
        }).catch(() => {
          console.log('Email service not available, showing reset link directly');
        });
      }

      toast({
        title: 'Success',
        description: 'If an account with this email exists, you will receive a password reset link.',
      });

      setSubmitted(true);

      if (process.env.NODE_ENV === 'development') {
        setTimeout(() => {
          toast({
            title: 'Development Mode',
            description: `Reset link: ${resetUrl}`,
          });
        }, 1000);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process password reset request',
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
              <CardHeader>
                <CardTitle>Reset Your Password</CardTitle>
                <CardDescription>
                  {submitted
                    ? 'Check your email for a password reset link'
                    : 'Enter your email address to receive a password reset link'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        disabled={loading}
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full"
                      size="lg"
                    >
                      {loading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-4 text-center">
                    <p className="text-sm text-gray-600">
                      We've sent a password reset link to <strong>{email}</strong>
                    </p>
                    <p className="text-xs text-gray-500">
                      The link will expire in 24 hours.
                    </p>
                    <p className="text-xs text-gray-500">
                      Didn't receive an email? Check your spam folder.
                    </p>
                    <Button
                      onClick={() => navigate('/auth')}
                      className="w-full"
                      size="lg"
                    >
                      Back to Login
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <button
              onClick={() => navigate('/auth')}
              className="mt-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ForgotPassword;
