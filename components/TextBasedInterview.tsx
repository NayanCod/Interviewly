"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import FormField from "./FormField";
import { Button } from "./ui/button";
import { Form } from "./ui/form";
import Link from "next/link";
import { createFeedback } from "@/lib/actions/general.action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const interviewSchema = () => {
  return z.object({
    introduction: z.string().min(1, { message: "This field is required" }),
    motivation: z.string().min(1, { message: "This field is required" }),
    experience: z.string().min(1, { message: "This field is required" }),
    questions: z.array(
      z.object({
        question: z.string(),
        answer: z.string().min(1, { message: "Answer is required" }),
      })
    ),
  });
};

const TextBasedInterview = ({
  interviewId,
  userId,
  username,
  questions,
  type,
}: TextBasedInterview) => {
  const [generatingFeedback, setGeneratingFeedback] = useState(false);
  const router = useRouter();

  const formSchema = interviewSchema();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      introduction: "",
      motivation: "",
      experience: "",
      questions: questions.map((q) => ({ question: q, answer: "" })),
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Form Submitted: ", values);
    setGeneratingFeedback(true);
    try {
      const { success, feedbackId: id } = await createFeedback({
        interviewId,
        userId,
        generalQuestions: {
          introduction: values.introduction,
          motivation: values.motivation,
          experience: values.experience,
        },
        actualQuestions: values.questions,
      });

      if (success && id) {
        setGeneratingFeedback(false);
        toast.success("Feedback generated successfully!");
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        console.log("Error saving feedback.");
        router.push("/");
        setGeneratingFeedback(false);
      }
    } catch (error) {
      console.error("Error submitting interview: ", error);
      toast.error("An error occured");
    }
  };

  return (
    <>
      <div className="section-feedback">
        <div className="flex flex-row justify-between items-center">
          <h4>Hi {username} 👋</h4>
          {/* <h4>Text Based Interview</h4> */}
        </div>
        <h3>Let&apos;s start you interview</h3>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6 mt-6 space-y-4"
          >
            <FormField
              control={form.control}
              name="introduction"
              label="Please introduce yourself and your background."
              placeholder="Write your introduction here..."
              type="textarea"
            />
            <FormField
              control={form.control}
              name="motivation"
              label="What motivates you to apply for this role?"
              placeholder="Write your motivation here..."
              type="textarea"
            />
            <FormField
              control={form.control}
              name="experience"
              label="Can you briefly describe your experience relevant to this role?"
              placeholder="Write your experience here..."
              type="textarea"
            />

            <div className="mt-8">
              <h3 className="text-lg font-semibold">{type} Questions</h3>
              <div className="flex flex-col gap-4 mt-4 space-y-4">
                {fields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`questions.${index}.answer`}
                    label={`${index + 1}. ${" "} ${field.question}`}
                    placeholder="Write your answer here..."
                    type="textarea"
                  />
                ))}
              </div>
            </div>

            <div className="flex md:flex-row flex-col-reverse gap-4">
        <Button className="btn-secondary flex-1 w-full">
          <Link href="/" className="flex w-full justify-center">
            <p className="text-sm font-semibold text-primary-200 text-center">
              Back to dashboard
            </p>
          </Link>
        </Button>


<Button type="submit" className="btn-primary flex-1 w-full">
                {generatingFeedback ? "Generating Feedback..." : "Submit"}
              </Button>
      </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default TextBasedInterview;
