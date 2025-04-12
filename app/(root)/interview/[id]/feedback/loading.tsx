import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const loading = () => {
  return (
    <>
     <section className="section-feedback">
      <div className="flex flex-row justify-center">
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="flex flex-row justify-center ">
        <div className="flex flex-row gap-5">
          <div className="flex flex-row gap-2 items-center">
            <Skeleton className="size-[22px] w-5 h-5 rounded-full" />
            <Skeleton className="w-20 h-5" />
          </div>

          <div className="flex flex-row gap-2">
          <Skeleton className="size-[22px] w-5 h-5 rounded-full" />
          <Skeleton className="w-20 h-5" />
          </div>
        </div>
      </div>

      <hr />

    <Skeleton className="h-10 w-40" />

      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-40" />
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="flex flex-col gap-2 items-start">
            <Skeleton className="w-20 h-5" />
            <Skeleton className="w-70 h-5" />
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Skeleton className="h-6 w-full" />

        <Skeleton className="h-6 w-full" />
      </div>
    </section>
    </>
  )
}

export default loading
