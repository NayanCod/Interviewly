import React from "react";
import { Skeleton } from "./ui/skeleton";

const InterviewCardShimmer = () => {
  return (
    <>
      <div className="card-border w-[360px] max-sm:w-full min-h-96">
        <div className="card-interview">
          <div>
            <div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg">
              <Skeleton className="badge-text w-20 h-7" />
            </div>

            <Skeleton className="rounded-full object-fit size-[90px]" />
            <Skeleton className="mt-5 w-60 h-12" />
            <div className="flex flex-row gap-5 mt-3">
              <div className="flex flex-row gap-2">
                <Skeleton className="size-[22px] w-5 h-5 rounded-full" />
                <Skeleton className="w-20 h-5" />
              </div>
              <div className="flex flex-row gap-2 items-center">
              <Skeleton className="size-[22px] w-5 h-5 rounded-full" />
              <Skeleton className="w-20 h-5" />
              </div>
            </div>

            <div className="line-clamp-2 mt-5">
              <Skeleton className="w-full h-10" />
            </div>
          </div>

          <div className="flex flex-row">
            {Array.from({ length: 3 }, (_, index) => (
              <Skeleton
                key={index}
                className="w-8 h-8 rounded-full"
              />
            ))}

            <Skeleton className="w-32 h-10 rounded-full ml-auto" />
          </div>
        </div>
      </div>
    </>
  );
};

export default InterviewCardShimmer;
