"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./FormField";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/firebase/client";
import {
  googleSignIn,
  sendOtp,
  signIn,
  signUp,
  verifyOtp,
} from "@/lib/actions/auth.action";
import { useEffect, useState } from "react";
import { CircleCheckBig, Eye, EyeClosed, LockKeyholeOpen } from "lucide-react";
import { removeUserData } from "@/lib/actions/general.action";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

const authFormSchema = (type: FormType) => {
  return z.object({
    name:
      type === "sign-up" ? z.string().min(2).max(50) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(4).max(50),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [loadingSendOtp, setLoadingSendOtp] = useState(false);
  const [loadingVerifyOtp, setLoadingVerifyOtp] = useState(false);

  const [resendTimer, setResendTimer] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (resendTimer > 0) {
      setResendDisabled(true);
      interval = setInterval(() => {
        setResendTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else if (resendTimer === 0 && resendDisabled) {
      setResendDisabled(false);
    }
    
    return () => clearInterval(interval);
  }, [resendTimer, resendDisabled]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleSendOtp = async () => {
    if (!form.getValues("email")) {
      toast.error("Please enter your email first!");
      return;
    }
    try {
      setLoadingSendOtp(true);
      const res = await sendOtp(form.getValues("email"));
      if (res?.success) {
        setIsOtpSent(true);
        toast.success("OTP sent to your email!\nPlease check your spam folder in case.");
        setResendTimer(120);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to send OTP");
    } finally {
      setLoadingSendOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter the OTP first!");
      return;
    }
    try {
      setLoadingVerifyOtp(true);
      const res = await verifyOtp(form.getValues("email"), otp);
      if (res?.success) {
        setIsEmailVerified(true);
        toast.success("Email verified successfully!");
      }else{
        toast.error(res?.message || "Failed to verify OTP");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to verify OTP");
    }finally{
      setLoadingVerifyOtp(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-up") {
        if (!isEmailVerified || !isOtpSent) {
          toast.error("Please verify your email first!");
          return;
        }
        const { name, email, password } = values;
        setLoading(true);

        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password,
          subscription: false,
        });

        if (!result?.success) {
          toast.error(result?.message);
          setLoading(false);
          return;
        }

        toast.success("Account created successfully. Please sign in!");
        setLoading(false);
        router.push("/sign-in");
      } else {
        const { email, password } = values;
        console.log("email", email, "password", password);

        setLoading(true);
        const userCredentials = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const idToken = await userCredentials.user.getIdToken();

        if (!idToken) {
          toast.error("Sign in failed");
          setLoading(false);
          return;
        }

        await signIn({
          email,
          idToken,
        });

        // console.log("signin res: ", res);

        toast.success("Sign in successfully!");
        router.push("/");
        setLoading(false);
      }
    } catch (error) {
      console.log("error", error);
      toast.error(`There was an error ${error}`);
      setLoading(false);
    }
  }

  const isSignIn = type === "sign-in";

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result?.user;

      // Get the ID token for backend verification
      const idToken = await user.getIdToken();

      // Send the token to your backend for further processing
      const res = await googleSignIn({
        email: user.email!,
        name: user.displayName!,
        photoURL: user.photoURL!,
        idToken,
      });

      if (res?.success) {
        toast.success("Signed in with Google successfully!");
        router.push("/");
      } else {
        toast.error(res?.message || "Google Sign-In failed");
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      toast.error("There was an error signing in with Google.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    try {
      const demoEmail = "demo@dev.com";
      const demoPassword = "Demo@123";
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        demoEmail,
        demoPassword
      );
      const idToken = await userCredentials.user.getIdToken();

      if (!idToken) {
        toast.error("Sign in failed");
        setLoading(false);
        return;
      }

      await removeUserData(userCredentials?.user?.uid);

      await signIn({
        email: demoEmail,
        idToken,
      });

      toast.success("Sign in successfully!");
      router.push("/");
      setDemoLoading(false);
    } catch (error) {
      console.log("error", error);
      toast.error(`There was an error ${error}`);
      setDemoLoading(false);
    }
  };

  return (
    <div className="card-border lg:min-w-[556px]">
      <div className="flex flex-col gap-6 card md:py-14 py-12 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" width={38} height={32} />
          <h2 className="text-primary-100">Interviewly</h2>
        </div>

        <h3>Practice job interview with AI</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your Name"
              />
            )}
            <div className="relative">
            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Enter Your Email"
              type="email"
            />
            {isEmailVerified && <CircleCheckBig color="#00f004" className="absolute right-3 top-[45%]" />}
            </div>
            <Button
              type="button"
              className={`btn-secondary text-sm ${isOtpSent ? "hidden" : ""} ${
                isSignIn ? "hidden" : ""
              }`}
              onClick={handleSendOtp}
              disabled={isOtpSent || loadingSendOtp}
            >
              { loadingSendOtp ? "Sending OTP..." : "Send OTP"}
            </Button>

            {isOtpSent && !isEmailVerified && (
              <div className="flex flex-col justify-center items-center gap-4">
                <div>
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(val) => setOtp(val)}
                    pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <div className="flex flex-row justify-center gap-4 items-center w-full">
                  <Button className="btn-secondary" onClick={handleSendOtp} disabled={resendDisabled}>
                  {resendDisabled 
    ? `Resend (${Math.floor(resendTimer / 60)}:${(resendTimer % 60).toString().padStart(2, '0')})` 
    : "Resend"}
                  </Button>
                  <Button className="btn-primary" onClick={handleVerifyOtp} disabled={otp.length < 6}>
                    {loadingVerifyOtp ? "Verifying..." : "Verify Otp"}
                  </Button>
                </div>
              </div>
            )}
            <div className="relative">
              <FormField
                control={form.control}
                name="password"
                label="Password"
                placeholder="Enter Your Password"
                type={showPassword ? "text" : "password"}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 text-sm text-gray-500 cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <Button className="btn" type="submit" disabled={loading}>
              {isSignIn && !loading && "Sign in"}
              {!isSignIn && !loading && "Create an account"}
              {!isSignIn && loading && "Creating an account..."}
              {isSignIn && loading && "Signing in..."}
            </Button>
          </form>
        </Form>

        <div className="flex flex-col gap-4">
          <Button
            className="btn-google w-full cursor-pointer"
            onClick={handleDemoLogin}
            disabled={demoLoading}
          >
            <LockKeyholeOpen />
            {demoLoading ? "Signing in..." : "Continue with Demo"}
          </Button>
        </div>

        <div className="flex flex-row items-center justify-center gap-2">
          <hr className="bg-white w-full" />
          <p className="text-sm text-gray-400">OR</p>
          <hr className="bg-white w-full" />
        </div>

        <div className="flex flex-col gap-4">
          <Button
            className="btn-google w-full cursor-pointer"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <Image alt="google" src="/google.png" width={20} height={20} />
            Continue with Google
          </Button>
        </div>

        <p className="text-center">
          {isSignIn ? "No account yet?" : "Have an account already?"}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="font-bold text-user-pimary ml-1"
          >
            {!isSignIn ? "Sign in" : "Sign up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
