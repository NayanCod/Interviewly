import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getUserInterviewCountByUserId } from "@/lib/actions/general.action";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const user = await getCurrentUser();

  const userInterview = await getUserInterviewCountByUserId(user?.id ?? "");

  if (!userInterview?.hasSubscription && userInterview?.count === 2) {
    redirect("/subscription");
  }

  return (
    <>
      <h3>Interview Generation</h3>

      <Agent
        userName={user?.name ?? "there"}
        userId={user?.id}
        type="generate"
      />
    </>
  );
};

export default page;
