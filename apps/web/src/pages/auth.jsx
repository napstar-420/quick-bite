import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import config from "../config"
import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"

export default function Auth() {
  const location = useLocation();

  // eslint-disable-next-line no-unused-vars
  const from = location?.state?.from || config.ROUTES.HOME;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto">
          <Link to={config.ROUTES.HOME} className="text-xl">{config.APP_NAME}</Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md px-4">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-sm space-y-6">
              <form className="space-y-6">
                {/* Form Heading */}
                <h2 className="text-2xl font-medium text-center">What&apos;s your phone number or email?</h2>

                {/* Input Field */}
                <Input
                  type="text"
                  placeholder="Enter phone number or email"
                  className="h-14 rounded-md border-gray-300"
                />

                {/* Continue Button */}
                <Button className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md">Continue</Button>
              </form>

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
                <image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-11%20082859-nLSp26dxYxrWWuf7j5kBhVODqHAfTM.png"
                  alt="Google logo"
                  width={20}
                  height={20}
                  className="hidden"
                />
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
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                Continue with Apple
              </Button>

              {/* Second Divider */}
              <div className="relative flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-500">or</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              {/* Legal Text */}
              <p className="text-xs text-gray-600 mt-4">
                By proceeding, you consent to get calls, WhatsApp or SMS/RCS messages, including by automated means,
                from Uber and its affiliates to the number provided.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

