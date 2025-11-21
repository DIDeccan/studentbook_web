import { Suspense } from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getHomeRouteForLoggedInUser } from '@utils'
import { safeParseLocalStorage } from '../../../utils/storage'

const PublicRoute = ({ children, route }) => {

 

  return <Suspense fallback={null}>{children}</Suspense>
}

export default PublicRoute
