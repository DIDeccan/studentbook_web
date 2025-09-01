// ** Reducers Imports
import navbar from './navbar'
import layout from './layout'
import auth from './authentication'
import profileSlice from './profileSlice'
const rootReducer = {
  auth,
  navbar,
  layout,
  profile: profileSlice
}

export default rootReducer
