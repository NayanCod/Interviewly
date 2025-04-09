"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FormField from "./FormField";

const interViewFormSchema = () => {
  return z.object({
    type: z.string().min(1, { message: "Type is required" }),
    role: z.string().min(1, { message: "Role is required" }),
    level: z.string().min(1, { message: "Level is required" }),
    techstack: z.string().min(1, { message: "Techstack is required" }),
    amount: z.string().min(1, { message: "Amount must be at least 1" }),
  });
};

const TextInterviewForm = ({ userId, state }: TextInterviewFormProps) => {
  const router = useRouter();
  const formSchema = interViewFormSchema();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "Mixed",
      role: "",
      level: "",
      techstack: "",
      amount: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("values: ", values);
    
    try {
      if (state === "generate") {
        const { type, role, level, techstack, amount } = values;
        setLoading(true);

        const generateInterview = await fetch("/api/vapi/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type,
            role,
            level,
            techstack,
            amount: parseInt(amount),
            userid: userId,
          }),
        });

        const result = await generateInterview.json();

        console.log("generateInterview result: ", result);
        
        if (!result?.success) {
          toast.error(result?.message);
          setLoading(false);
          return;
        }

        setLoading(false);
        toast.success("Interview generated successfully!");
        router.push("/");
      } else {
        console.log("else", values);
        
      }
    } catch (error) {
      console.log("error", error);
      toast.error(`There was an error ${error}`);
      setLoading(false);
    }
  }

  return (
    <div className="card-border lg:min-w-[600px] justify-center">
      <div className="flex flex-col gap-6 card py-10 px-10">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            <div className="flex sm:flex-row flex-col justify-between gap-6">
              <FormField
                control={form.control}
                name="type"
                label="Interview Type"
                type="select"
                placeholder="Select interview type"
                options={[
                  { value: "Behavioural", label: "Behavioural" },
                  { value: "Technical", label: "Technical" },
                  { value: "Mixed", label: "Mixed" },
                ]}
              />
              <FormField
                control={form.control}
                name="role"
                label="Role"
                placeholder="e.g., Software Engineer"
                type="text"
              />
            </div>
            <div className="flex sm:flex-row flex-col justify-between gap-5">
              <FormField
                control={form.control}
                name="level"
                label="Level"
                placeholder="e.g., Fresher, Junior, Senior"
                type="text"
              />
              <FormField
                control={form.control}
                name="amount"
                label="Total Questions"
                placeholder="e.g., 3"
                type="text"
                
              />
            </div>

            <FormField
              control={form.control}
              name="techstack"
              label="Techstack (comma separated)"
              placeholder="e.g., React, Node.js"
              type="text"
            />

            <Button className="btn" type="submit" disabled={loading}>
                {loading ? "Generating..." : "Generate Interview"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default TextInterviewForm;
