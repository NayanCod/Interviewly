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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import React, { ReactNode } from "react";

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();

  if (!isUserAuthenticated) redirect("/sign-in");

  const user = await getCurrentUser();

  return (
    <div className="root-layout">
      <nav className="flex flex-row justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="logo" width={38} height={32} />
          <h2 className="text-primary-100">Interviewly</h2>
        </Link>
        <div className="flex flex-row gap-5 items-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-secondary px-2 md:px-4 py-2 rounded-full md:rounded-lg flex flex-row gap-2 items-center hover:bg-secondary/70 cursor-pointer">
                <Image src="/crown.png" alt="pro-pack" width={20} height={20} />
                <p className="text-primary-100 text-sm font-semibold md:block hidden">
                  Go Pro
                </p>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="mb-2">What&apos;s Inside Pro Pack </DialogTitle>
                <DialogDescription>
                  <div className="flex flex-col gap-4">
                    <p className="text-sm text-muted-foreground">
                      Pro pack is a one time paid subscription that gives you access to
                      premium features and benefits.
                    </p>
                    <div className="flex flex-row gap-2 items-center justify-between">
                      <p className="text-sm font-semibold">Unlimited Voice Interviews</p>
                      <p className="text-sm text-muted-foreground">✅</p>
                    </div>
                    <div className="flex flex-row gap-2 items-center justify-between">
                      <p className="text-sm font-semibold">Unlimited Feedback</p>
                      <p className="text-sm text-muted-foreground">✅</p>
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button className="btn-primary w-full">Buy Now ₹50</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Popover>
            <PopoverTrigger>
              <Avatar className="cursor-pointer">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>{user?.name}</AvatarFallback>
              </Avatar>
            </PopoverTrigger>
            <PopoverContent className="w-50">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">{user?.name}</h4>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
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
  );
};

export default RootLayout;
