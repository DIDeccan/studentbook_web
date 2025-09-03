import { Suspense } from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getHomeRouteForLoggedInUser } from '@utils'
import { safeParseLocalStorage } from '../../../utils/storage'

const PublicRoute = ({ children, route }) => {

   let user = useSelector((state) => state.auth.userData)

    if (!user) {
    user = safeParseLocalStorage('authData')?.user
  }
 
    const restrictedRoute = route?.meta?.restricted ?? false

    if (user && restrictedRoute) {
      const redirectPath = getHomeRouteForLoggedInUser(user?.user_type)
      console.log(
        `User exists with user_type "${user?.user_type}", restrictedRoute=${restrictedRoute} → Redirecting to: ${redirectPath}`
      )

      return <Navigate to={getHomeRouteForLoggedInUser(user?.user_type)} />
    }
    else {
    console.log('No route passed into PublicRoute')
  }
  

  return <Suspense fallback={null}>{children}</Suspense>
}

export default PublicRoute
