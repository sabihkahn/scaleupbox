import React from 'react'
import BearWithEyes from '../components/BearWithEyes'
import { GalleryVerticalEnd } from "lucide-react"

import { SignupForm } from "@/components/signup-form"

const Auth = () => {
  return (
    <>
    {/* <AuthwithGoogle /> */}
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-2 md:p-2">
          <div className="flex justify-center gap-2 md:justify-start">
            <a href="#" className="flex items-center gap-2 font-medium">
              <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-4" />
              </div>
              Scaleupbox
            </a>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
              <SignupForm />
            </div>
          </div>
        </div>
        <div className="bg-muted relative hidden lg:flex items-center justify-center">
          <BearWithEyes />
        </div>

      </div>
    </>
  )
}

export default Auth