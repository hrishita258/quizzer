import React from 'react'
import { Route, Routes as HHRoutes } from 'react-router-dom'
import ActiveSessions from '../Pages/ActiveSessions'
import Colleges from '../Pages/Colleges'
import Dashboard from '../Pages/Dashboard'
import Edx from '../Pages/Edx'
import Explore from '../Pages/Explore'
import Hackathons from '../Pages/Hackathons'
import LeaderBoard from '../Pages/LeaderBoard'
import Quiz from '../Pages/Quiz'
import QuizPanel from '../Pages/QuizPanel'
import QuizQuestionEdit from '../Pages/QuizQuestionsEdit'
import Quizzes from '../Pages/Quizzes'
import UnstopOpportunity from '../Pages/UnstopOpportunity'
import Users from '../Pages/Users'

export const Routes = ({ role }) => {
  console.log('Routes role', role)
  return (
    <HHRoutes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/colleges" element={<Colleges />} />
      <Route path="/users" element={<Users />} />
      <Route path="/quizzes" element={<Quizzes />} />
      <Route path="/quizzes/:quizId" element={<Quiz />}></Route>
      <Route
        path="/quizzes/:quizId/edit"
        element={<QuizQuestionEdit />}
      ></Route>
      <Route path="/quizzes/:quizId/quizpanel" element={<QuizPanel />}></Route>
      <Route
        path="/account/activeSessions"
        element={<ActiveSessions />}
      ></Route>
      <Route path="/opportunities" element={<Hackathons />}></Route>
      <Route
        path="/opportunities/unstop/:opportunityId"
        element={<UnstopOpportunity />}
      ></Route>
      <Route path="/leaderboard" element={<LeaderBoard />}></Route>
      <Route path="/explore" element={<Explore />}></Route>
      <Route path="/edx" element={<Edx />}></Route>
    </HHRoutes>
  )
}
