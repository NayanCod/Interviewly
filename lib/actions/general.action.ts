"use server";

import { feedbackSchema } from "@/constants";
import { db } from "@/firebase/admin";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";

export async function getInterviewByUserId(
  userId: string | undefined
): Promise<Interview[] | null> {
  const interviews = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;

  const interviews = await db
    .collection("interviews")
    .orderBy("createdAt", "desc")
    .where("finalized", "==", true)
    .where("userId", "!=", userId)
    .limit(limit)
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  const interview = await db.collection("interviews").doc(id).get();

  return interview.data() as Interview | null;
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  const feedback = await db
    .collection("feedback")
    .where("interviewId", "==", interviewId)
    .where("userId", "==", userId)
    .limit(1)
    .get();

  if (feedback.empty) return null;

  const feedbackDoc = feedback.docs[0];

  // console.log("feedback by userId", feedbackDoc.data());

  return {
    id: feedbackDoc.id,
    ...feedbackDoc.data(),
  } as Feedback;
}

export async function getUserInterviewCountByUserId(userId: string) {
  const user = await db.collection("users").doc(userId).get();
  const hasSubscription = user.data()?.subscription || false;
  const count = (await db.collection("feedback")
    .where("userId", "==", userId)
    .where("type", "==", "voice")
    .count()
    .get()).data().count;

  return { hasSubscription, count };
}

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, generalQuestions, actualQuestions, type } =
    params;

  try {
    let formattedTranscript = "";
    if (transcript) {
      formattedTranscript = transcript
        .map(
          (sentence: { role: string; content: string }) =>
            `- ${sentence.role}: ${sentence.content}\n`
        )
        .join("");
    }

    let formattedGeneralQuestions = "";
    if (generalQuestions) {
      formattedGeneralQuestions = `
        General Questions:
        - Introduction: ${generalQuestions.introduction}
        - Motivation: ${generalQuestions.motivation}
        - Experience: ${generalQuestions.experience}
      `;
    }

    let formattedActualQuestions = "";
    if (actualQuestions) {
      formattedActualQuestions = `
        Actual Questions and Answers:
        ${actualQuestions
          .map(
            (qa: { question: string; answer: string }) =>
              `- Question: ${qa.question}\n  Answer: ${qa.answer}\n`
          )
          .join("")}
      `;
    }

    const prompt = `
      You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.

      ${formattedTranscript ? `Transcript:\n${formattedTranscript}` : ""}
      ${formattedGeneralQuestions ? formattedGeneralQuestions : ""}
      ${formattedActualQuestions ? formattedActualQuestions : ""}

      Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
      - **Communication Skills**: Clarity, articulation, structured responses.
      - **Technical Knowledge**: Understanding of key concepts for the role.
      - **Problem-Solving**: Ability to analyze problems and propose solutions.
      - **Cultural & Role Fit**: Alignment with company values and job role.
      - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
    `;

    const {
      object: {
        totalScore,
        categoryScores,
        strengths,
        areasForImprovement,
        finalAssessment,
      },
    } = await generateObject({
      model: google("gemini-2.0-flash-001", {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: prompt,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    });

    const feedback = await db.collection("feedback").add({
      interviewId,
      userId,
      totalScore,
      categoryScores,
      strengths,
      areasForImprovement,
      finalAssessment,
      type: type,
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      feedbackId: feedback.id,
    };
  } catch (error) {
    console.log("Error saving feedback", error);
    return { success: false };
  }
}

export async function userPurchasedSubscription(userId: string) {
  try {
    const subscription = await db.collection("users").doc(userId).update({
      subscription: true,
    });

    if (!subscription) return null;
    console.log("subscription", subscription);

    return {
      success: true,
      message: "Subscription updated successfully",
    };
  } catch (error) {
    console.log("Error updating subscription", error);
    return { success: false };
  }
}
