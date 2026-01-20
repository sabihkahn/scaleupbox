import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import axios from "axios";
import.meta.env.VITE_CLIENT_ID;
import { GoogleLogin } from "@react-oauth/google";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function LoginForm({ className, ...props }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [messageerror, setmessageerror] = useState('')
  const navigate = useNavigate();

  // Google login handler
  const handleGoogleLogin = async (response) => {
    const googleToken = response.credential;
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/token/google`,
        { token: googleToken },
        { withCredentials: true }
      );
      localStorage.setItem("token", res.data.accessToken);
      navigate("/dashboard");
      setTimeout(() => { window.location.reload() }, 1000);
    } catch (err) {
      console.error(err);
      setmessageerror(err.response?.data?.message || "Google login failed");
      alert("Google login failed.");
    }
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please fill all the fields");
      return;
    }

    setIsSubmit(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/user/login`,
        { email, password },
        { withCredentials: true }
      );
      alert(res.data.message);
      localStorage.setItem("token", res.data.accessToken);
      navigate("/dashboard");
      setTimeout(() => { window.location.reload() }, 1000);
    } catch (err) {
      console.error(err);
      
      setmessageerror(err.response?.data?.message || "Login failed");
    } finally {
      setIsSubmit(false);
    }
  };

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
      setTimeout(() => { window.location.reload() }, 1000);
    }
  }, [navigate]);

  return (
    <form
      className={cn("flex flex-col gap-0", className)}
      {...props}
      onSubmit={handleSubmit}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email and password to continue
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {email.length > 0 && !email.includes("@") && (
            <FieldDescription className="text-red-500">
              Please enter a valid email address.
            </FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {password.length > 0 && password.length < 8 && (
            <FieldDescription className="text-red-500">
              Password must be at least 8 characters long.
            </FieldDescription>
          )}
        </Field>

        <Field>
          <Button
            disabled={isSubmit}
            type="submit"
            className="w-full"
          >
            Login
          </Button>
          {messageerror && (
            <FieldDescription className="text-red-500 text-center mt-2">
              {messageerror}
            </FieldDescription>
          )}
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        <Field>
          <GoogleLogin
            className="mt-5 h-6 w-20"
            onSuccess={handleGoogleLogin}
            onError={(e) => console.log("Google login error:", e)}
          />
          <FieldDescription className="px-6 text-center">
            Don&apos;t have an account?{" "}
            <Button
              type="button"
              variant="link"
              onClick={() => navigate("/auth")}
            >
              Sign up
            </Button>
          </FieldDescription>
            <p className="underline cursor-pointer " onClick={()=>{navigate('/forgetpassword')}}>Forget password</p>
        </Field>
      </FieldGroup>
    </form>
  );
}
