import TextInterviewForm from "@/components/TextInterviewForm";
import { getCurrentUser } from "@/lib/actions/auth.action";
import React from "react";

const page = async () => {
  const user = await getCurrentUser();
  return (
    <>
      <h3>Interview Generation</h3>
        <div className="flex justify-center items-center flex-col gap-4">
      <TextInterviewForm userId={user?.id} state="generate"/>
      </div>
    </>
  );
};

export default page;
