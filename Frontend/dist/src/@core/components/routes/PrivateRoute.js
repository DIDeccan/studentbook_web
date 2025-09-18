import { Navigate } from 'react-router-dom'
import { useContext, Suspense } from 'react'
import { useSelector } from 'react-redux'
import { AbilityContext } from '@src/utility/context/Can'
import Spinner from '../spinner/Loading-spinner'
import { safeParseLocalStorage } from '../../../utils/storage'

const PrivateRoute = ({ children, route }) => {
  const ability = useContext(AbilityContext)
  let user = useSelector((state) => state.auth.userData)


  if (!user) {
    user = safeParseLocalStorage('authData')?.user || null

  }

  const restrictedRoute = route?.meta?.restricted || false


  // if (!user) {
  //   return <Navigate to='/login' />
  // }
  if (!user) {
    return <Navigate to='/login' />
  }

  if (user.is_paid === false) {
    return <Navigate to='/login' />
  }

  if (restrictedRoute && user.user_type === 'client') {
    return <Navigate to='/access-control' />
  }

  if (restrictedRoute) {
    return <Navigate to='/' />
  }

  return <Suspense fallback={<Spinner className='content-loader' />}>{children}</Suspense>
}

export default PrivateRoute


