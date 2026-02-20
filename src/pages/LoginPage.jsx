import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { LockKeyhole, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/context/AppContext';
import { appEnv } from '@/lib/env';

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, loginUser, isLoggingIn, setBlur, hidePicker } = useApp();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    hidePicker();
    setBlur(true);
    return () => {
      setBlur(false);
    };
  }, [hidePicker, setBlur]);

  if (user.sessionToken) {
    return <Navigate to="/" replace />;
  }

  const submit = async (event) => {
    event.preventDefault();
    try {
      await loginUser({ name, password });
      navigate('/', { replace: true });
    } catch {
      // errors are surfaced through global alert state
    }
  };

  const loginWithDev = async () => {
    if (!appEnv.devUsername || !appEnv.devPassword) {
      return;
    }

    setName(appEnv.devUsername);
    setPassword(appEnv.devPassword);
    try {
      await loginUser({ name: appEnv.devUsername, password: appEnv.devPassword });
      navigate('/', { replace: true });
    } catch {
      // errors are surfaced through global alert state
    }
  };

  return (
    <div className="grid h-full w-full place-items-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Authenticate with LeanCloud user credentials to load GPS tracks.</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="login-form" className="space-y-4" onSubmit={submit}>
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-1">
                <UserRound className="h-3.5 w-3.5" />
                Name
              </Label>
              <Input id="name" name="name" autoComplete="username" value={name} onChange={(event) => setName(event.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-1">
                <LockKeyhole className="h-3.5 w-3.5" />
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button
            variant="secondary"
            type="button"
            onClick={loginWithDev}
            disabled={isLoggingIn || !appEnv.devUsername || !appEnv.devPassword}
          >
            Use Dev Credentials
          </Button>
          <Button type="submit" form="login-form" disabled={isLoggingIn}>
            {isLoggingIn ? 'Logging in...' : 'Login'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
