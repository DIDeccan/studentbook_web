import { lazy } from 'react'
import YogaTips from '../../views/YogaTips'
import Sports from '../../views/Sports'
import Health from '../../views/Health'
import CourseDetails from '../../views/CourseDetails'

const DashboardAnalytics = lazy(() => import('../../views/dashboard/analytics'))
const DashboardEcommerce = lazy(() => import('../../views/dashboard/ecommerce'))
const MainPage = lazy(() => import('../../views/Mainpage'))
const MySubjects = lazy(() => import('../../views/MySubjects'))
const Blogs = lazy(() => import('../../views/Blogs'))

const DashboardRoutes = [
  {
    path: '/dashboard/analytics',
    element: <DashboardAnalytics />,
       meta: {
      // layout: 'vertical',   // or 'horizontal' if needed
      // publicRoute: true      // or false if login is required
    }
  },
  {
    path: '/dashboard/ecommerce',
    element: <DashboardEcommerce />
  },
  {
    path: '/mainpage',
    element: <MainPage />
  },
     {
    path: '/mysubjects',
    element: <MySubjects />
  },
      {
    path: '/yogatips',
    element: <YogaTips />
  },
      {
    path: '/sports',
    element: <Sports />
  },
       {
    path: '/health',
    element: <Health />
  },
  {
    path: '/blogs',
    element: <Blogs />
  },
  {
    path: 'coursedetails/:id',
    element: <CourseDetails/>
  }
]

export default DashboardRoutes
