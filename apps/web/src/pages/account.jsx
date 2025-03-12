import React from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { InfoIcon, Facebook, Check, X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

// TODO: Add logic to update profile

const AccountPage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-md w-full mx-auto p-6">
      {/* Profile Section */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <h2 className="text-2xl font-medium">My profile</h2>
          <InfoIcon className="w-4 h-4 ml-2 text-gray-400" />
        </div>

        <form className="space-y-4">
          <div className="w-full">
            <label
              htmlFor="firstName"
              className="block text-sm text-gray-600 mb-1"
            >
              Name
            </label>
            <Input id="firstName" defaultValue={user.name} className="w-full" />
          </div>

          <div>
            <label
              htmlFor="mobile"
              className="block text-sm text-gray-600 mb-1"
            >
              Mobile number
            </label>
            <Input id="mobile" defaultValue={user.phone} />
          </div>

          <Button
            variant="outline"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            Save
          </Button>
        </form>
      </div>

      <Separator className="my-6" />

      {/* Email Section */}
      <div className="mb-8">
        <h2 className="text-xl font-medium mb-4">Email</h2>

        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-gray-600 mb-1">
              Email
            </label>
            <Input id="email" defaultValue={user.email} />
          </div>

          <div className="flex items-center">
            <div className="flex items-center">
              <Check className="w-4 h-4 text-blue-500 mr-1" />
              <span className="text-sm text-blue-500">Verified</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            Save
          </Button>
        </form>
      </div>

      <Separator className="my-6" />

      {/* Password Section */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4">Password</h2>

        <form className="space-y-4">
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm text-gray-600 mb-1"
            >
              Current password
            </label>
            <Input id="currentPassword" type="password" />
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm text-gray-600 mb-1"
            >
              New password
            </label>
            <Input id="newPassword" type="password" />
          </div>

          <Button
            variant="outline"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            Save
          </Button>
        </form>
      </div>

      <Separator className="my-6" />

      {/* Payments Section */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4">My payments</h2>

        <div className="flex items-center justify-between py-3">
          <div className="flex items-center">
            <span className="font-medium text-blue-600 uppercase mr-2">
              Cash on delivery
            </span>
          </div>
          <div className="flex items-center">
            <Check className="w-4 h-4" />
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Connected Accounts Section */}
      <div>
        <h2 className="text-lg font-medium mb-4">Connected accounts</h2>

        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-6 h-6 mr-2 text-blue-600">
                <Facebook />
              </div>
              <span className="font-medium">Facebook</span>
            </div>
            <Button variant="link" className="text-blue-500 p-0 h-auto">
              Connect
            </Button>
          </Card>

          <Card className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="w-6 h-6"
                >
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
              </div>
              <div>
                <div className="font-medium">Google</div>
                <div className="text-xs text-gray-500">Connected</div>
              </div>
            </div>
            <Button variant="ghost" className="p-1 h-auto">
              <X className="w-4 h-4" />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
