import Leaderboard from '@/components/Leaderboard';
import { getCurrentUser } from '@/lib/actions/auth.action'
import { getUserScores } from '@/lib/actions/general.action';
import React from 'react'

const page = async () => {
    const user = await getCurrentUser();
    const userScores = await getUserScores();
  return (
    <>
    {user && <Leaderboard currUser={user} userScores={userScores}/>}
    </>
  )
}

export default page
