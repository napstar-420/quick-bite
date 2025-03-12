import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import config from "../config";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  useSigninMutation,
  useSignupMutation,
} from "../features/auth/authApiSlice";
import { checkUserExists } from "../lib/helpers";

// TODO: Break up into smaller components

// Authentication steps
const STEPS = {
  EMAIL: 0,
  PASSWORD: 1,
  LOADING: 2,
  SUCCESS: 3,
};

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location?.state?.from || config.ROUTES.HOME;

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentStep, setCurrentStep] = useState(STEPS.EMAIL);
  const [userExists, setUserExists] = useState(null);
  const [checkingUser, setCheckingUser] = useState(false);

  // RTK Query hooks
  const [signin] = useSigninMutation();
  const [signup] = useSignupMutation();

  // Handle form submission for email step
  const handleEmailContinue = async () => {
    if (!email) {
      toast.error("Email required", {
        description: "Please enter your email address",
      });
      return;
    }

    if (!email.includes("@")) {
      toast.error("Invalid email", {
        description: "Please enter a valid email address",
      });
      return;
    }

    try {
      setCheckingUser(true);
      const result = await checkUserExists(email);
      setUserExists(result.data.exists);

      if (result.data.exists) {
        setPassword("");
        setName("");
      }

      // Move to password step
      setCurrentStep(STEPS.PASSWORD);
    } catch {
      toast.error("Error checking user", {
        description: "Please try again later",
      });
      return;
    } finally {
      setCheckingUser(false);
    }
  };

  // Handle form submission for password step
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!userExists) {
      if (!name) {
        toast.error("Name required", {
          description: "Please enter your name",
        });
        return;
      }

      if (
        name.length < config.NAME_MIN_LENGTH ||
        name.length > config.NAME_MAX_LENGTH
      ) {
        toast.error("Invalid name", {
          description: `Name must be between ${config.NAME_MIN_LENGTH} and ${config.NAME_MAX_LENGTH} characters`,
        });
        return;
      }
    }

    if (!password) {
      toast.error("Password required", {
        description: "Please enter your password",
      });
      return;
    }

    const {
      PASS_MIN_LENGTH,
      PASS_MAX_LENGTH,
      PASS_REGEX,
      PASS_ALLOWED_SPECIAL_CHARS,
    } = config;

    if (
      password.length < PASS_MIN_LENGTH ||
      password.length > PASS_MAX_LENGTH
    ) {
      toast.error("Invalid password", {
        description: `Password must be between ${PASS_MIN_LENGTH} and ${PASS_MAX_LENGTH} characters`,
      });
      return;
    }

    if (!PASS_REGEX.test(password)) {
      toast.error("Invalid password", {
        description: `Password must contain at least one uppercase letter, one lowercase letter, one number and one special character (allowed special characters are ${PASS_ALLOWED_SPECIAL_CHARS})`,
      });
      return;
    }

    setCurrentStep(STEPS.LOADING);

    try {
      if (userExists) {
        // User exists, attempt signin
        await signin({ email, password }).unwrap();
      } else {
        // New user, attempt signup
        await signup({ name, email, password }).unwrap();
      }

      setCurrentStep(STEPS.SUCCESS);
      toast.success(
        userExists ? "Signed in successfully" : "Account created successfully",
        {
          description: "Welcome to " + config.APP_NAME,
        },
      );

      // Navigate back to the original location
      navigate(from, { replace: true });
    } catch (error) {
      setCurrentStep(STEPS.PASSWORD);

      toast.error(userExists ? "Sign in failed" : "Sign up failed", {
        description: error.data?.message || "An unexpected error occurred",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto">
          <Link to={config.ROUTES.HOME} className="text-xl">
            {config.APP_NAME}
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md px-4">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-sm space-y-6">
              {currentStep === STEPS.EMAIL && (
                <form
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleEmailContinue();
                  }}
                >
                  {/* Form Heading */}
                  <h2 className="text-2xl font-medium text-center">
                    What&apos;s your email?
                  </h2>

                  {/* Input Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      disabled={checkingUser}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="h-14 rounded-md border-gray-300"
                    />
                  </div>

                  {/* Continue Button */}
                  <Button
                    type="submit"
                    className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md"
                    disabled={checkingUser}
                  >
                    {checkingUser ? "Please wait" : "Continue"}
                  </Button>
                </form>
              )}

              {currentStep === STEPS.PASSWORD && (
                <form className="space-y-6" onSubmit={handlePasswordSubmit}>
                  {/* Form Heading */}
                  <h2 className="text-2xl font-medium text-center">
                    {userExists ? "Welcome back" : "Create your account"}
                  </h2>

                  <div className="space-y-1">
                    <p className="text-center text-gray-500">
                      {userExists
                        ? "Enter your password to sign in"
                        : "Set a password for your new account"}
                    </p>
                    <p className="text-center font-medium">{email}</p>
                  </div>

                  {/* Name field for new users */}
                  {!userExists && (
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        type="text"
                        autoComplete="name"
                        minLength={config.NAME_MIN_LENGTH}
                        maxLength={config.NAME_MAX_LENGTH}
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="h-14 rounded-md border-gray-300"
                      />
                    </div>
                  )}

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      minLength={config.PASS_MIN_LENGTH}
                      maxLength={config.PASS_MAX_LENGTH}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={
                        userExists ? "Enter your password" : "Create a password"
                      }
                      className="h-14 rounded-md border-gray-300"
                    />
                  </div>

                  {/* Back Button */}
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-1/3 h-14"
                      onClick={() => setCurrentStep(STEPS.EMAIL)}
                    >
                      Back
                    </Button>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-2/3 h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md"
                    >
                      {userExists ? "Sign In" : "Sign Up"}
                    </Button>
                  </div>
                </form>
              )}

              {currentStep === STEPS.LOADING && (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="h-12 w-12 border-4 border-t-primary rounded-full animate-spin"></div>
                  <p className="text-gray-500">
                    {userExists ? "Signing in..." : "Creating your account..."}
                  </p>
                </div>
              )}

              {currentStep !== STEPS.LOADING && (
                <>
                  {/* Divider */}
                  <div className="relative flex items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-gray-500">or</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                  </div>

                  {/* Continue with Google */}
                  <Button
                    variant="outline"
                    className="w-full h-14 bg-gray-100 hover:bg-gray-200 text-black border-gray-300 rounded-md flex items-center justify-center gap-2"
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </Button>

                  {/* Continue with Apple */}
                  <Button
                    variant="outline"
                    className="w-full h-14 bg-gray-100 hover:bg-gray-200 text-black border-gray-300 rounded-md flex items-center justify-center gap-2"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="currentColor"
                    >
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    Continue with Apple
                  </Button>

                  {/* Legal Text */}
                  <p className="text-xs text-gray-600 mt-4">
                    By proceeding, you consent to get calls, WhatsApp or SMS/RCS
                    messages, including by automated means, from{" "}
                    {config.APP_NAME} and its affiliates to the number provided.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
