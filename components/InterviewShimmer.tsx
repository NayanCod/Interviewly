import React from 'react'
import { Skeleton } from './ui/skeleton'

const InterviewShimmer = () => {
  return (
   <>
         <div className="call-view">
           <div className="card-interviewer">
             <div className="avatar">
                <Skeleton className="rounded-full object-fit size-[120px]" />
             </div>
             <Skeleton className="mt-5 w-60 h-12" />
           </div>
           <div className="card-border">
             <div className="card-content">
                <Skeleton className="rounded-full object-fit size-[120px]" />
                <Skeleton className="mt-5 w-60 h-12" />
             </div>
           </div>
         </div>
   
         <div className="w-full flex justify-center">
            <Skeleton className="w-32 h-10 rounded-full" />
         </div>
       </>
  )
}

export default InterviewShimmer
