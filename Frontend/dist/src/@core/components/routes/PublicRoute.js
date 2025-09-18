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
  
  if (user && user.is_paid === false) {
    return <Suspense fallback={null}>{children}</Suspense>
  }

  if (user && restrictedRoute) {
    const redirectPath = getHomeRouteForLoggedInUser(user?.user_type)
    console.log(
      `⚡ Redirect blocked! User with type "${user?.user_type}" tried to access a restricted public route → Redirecting to: ${redirectPath}`
    )
    return <Navigate to={redirectPath} replace />
  }

  return <Suspense fallback={null}>{children}</Suspense>
}

export default PublicRoute
