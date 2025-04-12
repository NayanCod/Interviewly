import InterviewCardShimmer from '@/components/InterviewCardShimmer'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const loading = () => {
  return (
    <>
    <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <Skeleton className='h-10 w-60 md:w-80 md:text-start text-center' />
          <Skeleton className='h-10 w-70 md:w-100 md:text-start text-center' />
          <Skeleton className="h-10 w-40 md:w-40 md:text-start text-center" />
        </div>
        <Skeleton className='h-50 w-100 rounded-3xl md:block hidden' />
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <Skeleton className='h-10 w-40' />

        <div className="interviews-section">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="flex flex-row gap-6 flex-wrap">
              <InterviewCardShimmer />
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default loading
