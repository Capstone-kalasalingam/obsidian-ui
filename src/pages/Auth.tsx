import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, AppRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, GraduationCap, Eye, EyeOff, UserCircle, Users, BookOpen, Shield } from 'lucide-react';
import { z } from 'zod';

const loginSchema = z.object({
  userId: z.string().min(1, 'Please enter your ID'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.string().min(1, 'Please select a role'),
});

type RoleOption = {
  value: string;
  label: string;
  icon: React.ReactNode;
  idPlaceholder: string;
  idLabel: string;
};

const roleOptions: RoleOption[] = [
  { value: 'school_admin', label: 'School Admin', icon: <Shield className="h-4 w-4" />, idPlaceholder: 'Enter your email', idLabel: 'Email' },
  { value: 'teacher', label: 'Teacher', icon: <BookOpen className="h-4 w-4" />, idPlaceholder: 'Enter your Teacher ID (e.g., TCH001)', idLabel: 'Teacher ID' },
  { value: 'student', label: 'Student', icon: <UserCircle className="h-4 w-4" />, idPlaceholder: 'Enter your Student ID', idLabel: 'Student ID' },
  { value: 'parent', label: 'Parent', icon: <Users className="h-4 w-4" />, idPlaceholder: 'Enter your Parent ID', idLabel: 'Parent ID' },
];

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, role, user } = useAuth();
  const [selectedRole, setSelectedRole] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ userId?: string; password?: string; role?: string }>({});
  const [loginSuccess, setLoginSuccess] = useState(false);

  const selectedRoleOption = roleOptions.find(r => r.value === selectedRole);

  const redirectByRole = (userRole: AppRole) => {
    const routes: Record<AppRole, string> = {
      school_admin: '/principal/dashboard',
      teacher: '/teacher/dashboard',
      student: '/student/dashboard',
      parent: '/parent/dashboard',
    };
    navigate(routes[userRole]);
  };

  // Redirect when role becomes available after successful login
  useEffect(() => {
    if (loginSuccess && role && user) {
      redirectByRole(role);
    }
  }, [loginSuccess, role, user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate input
    const result = loginSchema.safeParse({ userId, password, role: selectedRole });
    if (!result.success) {
      const fieldErrors: { userId?: string; password?: string; role?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === 'userId') fieldErrors.userId = err.message;
        if (err.path[0] === 'password') fieldErrors.password = err.message;
        if (err.path[0] === 'role') fieldErrors.role = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      // Convert ID to email format based on role
      let email = userId;
      if (selectedRole === 'teacher') {
        email = `${userId.toLowerCase()}@school.local`;
      } else if (selectedRole === 'student') {
        email = `${userId.toLowerCase()}@student.school.local`;
      } else if (selectedRole === 'parent') {
        email = `${userId.toLowerCase()}@parent.school.local`;
      }
      // school_admin uses actual email

      const { error } = await signIn(email, password);

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Invalid ID or password. Please try again.');
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Please verify your account before logging in.');
        } else {
          toast.error(error.message);
        }
        setLoading(false);
        return;
      }

      toast.success('Welcome back!');
      setLoginSuccess(true);
      // Loading state stays true until redirect happens via useEffect
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex flex-col">
      {/* Header */}
      <header className="p-4 md:p-6">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <GraduationCap className="h-6 w-6 md:h-8 md:w-8 text-primary" />
          <h1 className="text-xl md:text-2xl font-bold text-primary">Kalvion</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 pb-8">
        <Card className="w-full max-w-md shadow-xl border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-2 text-center pb-4">
            <CardTitle className="text-2xl md:text-3xl font-bold">Welcome Back</CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Role Selector */}
              <div className="space-y-2">
                <Label>I am a</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole} disabled={loading}>
                  <SelectTrigger className={errors.role ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          {option.icon}
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-sm text-destructive">{errors.role}</p>
                )}
              </div>

              {/* User ID Input */}
              <div className="space-y-2">
                <Label htmlFor="userId">{selectedRoleOption?.idLabel || 'ID'}</Label>
                <Input
                  id="userId"
                  type={selectedRole === 'school_admin' ? 'email' : 'text'}
                  placeholder={selectedRoleOption?.idPlaceholder || 'Enter your ID'}
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className={errors.userId ? 'border-destructive' : ''}
                  disabled={loading || !selectedRole}
                  autoComplete={selectedRole === 'school_admin' ? 'email' : 'username'}
                />
                {errors.userId && (
                  <p className="text-sm text-destructive">{errors.userId}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                    disabled={loading || !selectedRole}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              <Button type="submit" className="w-full h-12 text-base" disabled={loading || !selectedRole}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Contact your school administrator if you don't have an account.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Auth;
