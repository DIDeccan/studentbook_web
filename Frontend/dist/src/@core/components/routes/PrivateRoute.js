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
    user = safeParseLocalStorage('authData')?.user
  }
const action = route?.meta?.action || null
const resource = route?.meta?.resource || null
const restrictedRoute = route?.meta?.restricted || false


    if (!user) {
      return <Navigate to='/login' />
    }

    if ( restrictedRoute && user.user_type === 'client') {
      return <Navigate to='/access-control' />
    }

      if (restrictedRoute) {
      return <Navigate to='/' />
    }
    
  return <Suspense fallback={<Spinner className='content-loader' />}>{children}</Suspense>
}

export default PrivateRoute


// import { Navigate } from 'react-router-dom'
// import { useContext, Suspense } from 'react'
// import { useSelector } from 'react-redux'
// import { AbilityContext } from '@src/utility/context/Can'
// import Spinner from '../spinner/Loading-spinner'
// import { safeParseLocalStorage } from '../../../utils/storage'

// const PrivateRoute = ({ children, route }) => {
//   const ability = useContext(AbilityContext)

//   // Try Redux first, fallback to localStorage
//   let user = useSelector((state) => state.auth.userData)
//   if (!user) {
//     user = safeParseLocalStorage('userData') || null
//   }

//   const action = route?.meta?.action || null
//   const resource = route?.meta?.resource || null
//   const restrictedRoute = route?.meta?.restricted || false

//   // No user -> redirect to login
//   if (!user) {
//     return <Navigate to="/login" />
//   }

//   // Restrict clients from restricted routes
//   if (restrictedRoute && user.user_type === 'client') {
//     return <Navigate to="/access-control" />
//   }

//   // Check payment completion (student_id and student_package_id must exist)
//   if (!user.student_id || !user.student_package_id) {
//     return <Navigate to="/payment" />
//   }

//   return <Suspense fallback={<Spinner className="content-loader" />}>{children}</Suspense>
// }

// export default PrivateRoute
