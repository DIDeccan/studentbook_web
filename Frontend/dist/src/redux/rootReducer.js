// ** Reducers Imports
import navbar from './navbar'
import layout from './layout'
import auth from './authentication'
import profileSlice from './profileSlice'
import classSlice from './classSlice'
import contentSlice from './contentSlice'
const rootReducer = {
  auth,
  navbar,
  layout,
  profile: profileSlice,
  classes: classSlice ,
  content: contentSlice
}

export default rootReducer
