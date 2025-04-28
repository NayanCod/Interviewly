"use client";

import { useState } from "react";
import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";

type InterviewListProps = {
  interviews: Interview[];
  emptyMessage: string;
  title: string;
  initialDisplayCount?: number;
};

export default function InterviewList({ 
  interviews = [], 
  emptyMessage, 
  title,
  initialDisplayCount = 6 
}: InterviewListProps) {
  const [showAll, setShowAll] = useState(false);
  
  const hasInterviews = interviews.length > 0;
  const hasMoreToShow = interviews.length > initialDisplayCount;
  
  const displayedInterviews = showAll 
    ? interviews 
    : interviews.slice(0, initialDisplayCount);

  return (
    <section className="flex flex-col gap-6 mt-8">
      <h2>{title}</h2>

      <div className="interviews-section">
        {hasInterviews ? (
          displayedInterviews.map((interview) => (
            <InterviewCard key={interview.id} {...interview} />
          ))
        ) : (
          <p>{emptyMessage}</p>
        )}
      </div>
      
      {hasMoreToShow && !showAll && (
        <Button 
          className="btn-secondary self-center mt-4" 
          onClick={() => setShowAll(true)}
        >
          See More
        </Button>
      )}
    </section>
  );
}