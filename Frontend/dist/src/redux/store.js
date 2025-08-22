// ** Redux Imports
import rootReducer from './rootReducer'
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware({
      serializableCheck: false
    })
  }
})

export { store }

//  new code starts here 
// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './slices/authSlice';

// const savedUser = JSON.parse(localStorage.getItem('user'));

// const preloadedState = {
//   auth: {
//     user: savedUser || null,
//     isLoggedIn: !!savedUser
//   }
// };

// const store = configureStore({
//   reducer: {
//     auth: authReducer
//   },
//   preloadedState
// });

// // Sync Redux with localStorage
// store.subscribe(() => {
//   const { user, isLoggedIn } = store.getState().auth;
//   if (isLoggedIn && user) {
//     localStorage.setItem('user', JSON.stringify(user));
//   }
// });

// export default store;
