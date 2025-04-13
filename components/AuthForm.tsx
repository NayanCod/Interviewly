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
import { googleSignIn, signIn, signUp } from "@/lib/actions/auth.action";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-up") {
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

        const res = await signIn({
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
            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Enter Your Email"
              type="email"
            />
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
                className="absolute right-3 top-1/2 text-sm text-gray-500"
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
