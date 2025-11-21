import { Navigate } from 'react-router-dom'


const PrivateRoute = ({ children, route }) => {

  return <Suspense fallback={<Spinner className='content-loader' />}>{children}</Suspense>
}

export default PrivateRoute


