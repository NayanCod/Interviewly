import AlertSub from "@/components/AlertSub";
import Subscription from "@/components/Subscription";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  getCurrentUser,
  isAuthenticated,
  logout,
} from "@/lib/actions/auth.action";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import Script from "next/script";
import React, { ReactNode } from "react";

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();

  if (!isUserAuthenticated) redirect("/sign-in");

  const user = await getCurrentUser();

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      {!user?.subscription && <AlertSub />}
      <div className="root-layout">
        <nav className="flex flex-row justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="logo" width={38} height={32} />
            <h2 className="text-primary-100">Interviewly</h2>
          </Link>
          <div className="flex flex-row gap-5 items-center">
            {user && <Subscription user={user} />}
            <Popover>
              <PopoverTrigger>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user?.photoURL} />
                  <AvatarFallback>
                    {user?.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <div className="font-medium leading-none flex flex-row gap-2 items-center">
                      <Avatar className="cursor-pointer">
                        <AvatarImage src={user?.photoURL} />
                        <AvatarFallback>
                          {user?.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {user?.name}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {user?.email}
                    </p>
                    {user?.subscription && (
                      <Button className="bg-secondary w-full px-2 md:px-4 py-2 rounded-full md:rounded-lg flex flex-row md:hidden gap-2 items-center hover:bg-secondary">
                        <Image
                          src="/crown.png"
                          alt="pro-pack"
                          width={20}
                          height={20}
                        />
                        <p className="text-primary-100 text-sm font-semibold">
                          Active
                        </p>
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-col gap-4 items-start justify-center">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="btn-primary max-sm:w-full w-[100%]">
                          Start an Interview
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Choose the type of interview you want to take.
                          </AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction asChild>
                            <Link href="/interview">Voice-Based Interview</Link>
                          </AlertDialogAction>
                          <AlertDialogAction asChild>
                            <Link href="/text-interview">
                              Text-Based Interview
                            </Link>
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <AlertDialog>
                      <AlertDialogTrigger className="w-[100%] !bg-destructive-200 !text-primary-100 hover:!bg-destructive-200/80 !rounded-full !font-bold px-5 cursor-pointer min-h-10">
                        Logout
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={logout}>
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </nav>
        {children}
      </div>
    </>
  );
};

export default RootLayout;
