// import React, { useState, useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import { User, Settings, DollarSign, HelpCircle, LogOut } from 'react-feather';
// import { useNavigate } from 'react-router-dom';
// import {
//   Navbar,
//   NavbarToggler,
//   Collapse,
//   Nav,
//   NavItem,
//   NavLink,
// } from 'reactstrap';

// const Header = () => {
//    const navigate = useNavigate();

// // Logout logic
//    const handleLogout = () => {
//     localStorage.removeItem('isLoggedIn');
//     localStorage.removeItem('userData'); 

//     navigate('/login');
//   };

//   const [isOpen, setIsOpen] = useState(false);
//   const toggleNavbar = () => setIsOpen(!isOpen);

// //Replace this hardcoded user with real API data
//   const user = {
//     email: "johndoe@example.com",
//     name: "John Doe"
//   };
//    //  In actual usage, this user data should come from an API call or localStorage
//   // Example: const user = JSON.parse(localStorage.getItem('userData'));
//   // Or from an API: useEffect(() => { fetchUser().then(setUser); }, []);

//   const [firstLetter, setFirstLetter] = useState('');
//   const [showDropdown, setShowDropdown] = useState(false);
//   const dropdownRef = useRef();

//   useEffect(() => {
//     if (user.name) {
//       setFirstLetter(user.name.charAt(0).toUpperCase());
//     } else if (user.email) {
//       setFirstLetter(user.email.charAt(0).toUpperCase());
//     }
//   }, [user]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDropdown(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <Navbar expand="md" className="p-1" style={{ backgroundColor: '#f6f6ff' }}>
//       {/* Branding */}
//       <Link className="navbar-brand d-flex align-items-center text-decoration-none" to="/">
//      <svg viewBox="0 0 139 95" version="1.1" height="28">
//           <defs>
//             <linearGradient x1="100%" y1="10.5%" x2="50%" y2="89.5%" id="linearGradient-1">
//               <stop stopColor="#000" offset="0%" />
//               <stop stopColor="#fff" offset="100%" />
//             </linearGradient>
//             <linearGradient x1="64%" y1="46%" x2="37%" y2="100%" id="linearGradient-2">
//               <stop stopColor="#eee" stopOpacity="0" offset="0%" />
//               <stop stopColor="#fff" offset="100%" />
//             </linearGradient>
//           </defs>
//           <g fill="none" fillRule="evenodd">
//             <g transform="translate(-400, -178)">
//               <g transform="translate(400, 178)">
//                 <path
//                   d="M0,0 L39.18,0 L69.34,32.25 L101.42,0 L138.78,0 V29.8C137.95,37.35 135.78,42.55 132.26,45.41C128.73,48.28 112.33,64.52 83.06,94.14 H56.27 L6.71,44.41 C2.46,39.98 0.34,35.10 0.34,29.80 C0.34,24.49 0.23,14.56 0,0 Z"
//                   fill="currentColor"
//                   className="text-primary"
//                 />
//                 <path
//                   d="M69.34,32.25 L101.42,0 H138.78 V29.8 C137.95,37.35 135.78,42.55 132.26,45.41 C128.73,48.28 112.33,64.52 83.06,94.14 H56.27 L32.84,70.5 L69.34,32.25 Z"
//                   fill="url(#linearGradient-1)"
//                   opacity="0.2"
//                 />
//                 <polygon fill="#000" opacity="0.05" points="69.39 32.42 32.84 70.5 54.04 16.18" />
//                 <polygon fill="#000" opacity="0.1" points="69.39 32.42 32.84 70.5 58.36 20.74" />
//                 <polygon fill="url(#linearGradient-2)" opacity="0.1" points="101.42 0 83.06 94.14 130.37 47.07" />
//               </g>
//             </g>
//           </g>
//         </svg>
//         <h4 className="text-primary fw-bold mb-0 ms-2">StudentBook</h4>
//       </Link>

//       <NavbarToggler onClick={toggleNavbar} />

//       <Collapse isOpen={isOpen} navbar>
//         <Nav className="mx-auto" navbar>
//           <NavItem className="mx-3">
//             <NavLink tag={Link} to="/mainpage">Home</NavLink>
//           </NavItem>
//           <NavItem className="mx-3">
//             <NavLink tag={Link} to="/mysubjects">My Subjects</NavLink>
//           </NavItem>
//           <NavItem className="mx-3">
//             <NavLink tag={Link} to="/blogs">Blogs</NavLink>
//           </NavItem>
//           <NavItem className="mx-3">
//             <NavLink tag={Link} to="/contactus">Contact Us</NavLink>
//           </NavItem>
//         </Nav>

//         <Nav className="ms-auto" navbar>
//           <NavItem ref={dropdownRef} className="position-relative">
//             <div
//               onClick={() => setShowDropdown(prev => !prev)}
//               style={{
//                 width: '40px',
//                 height: '40px',
//                 backgroundColor: '#6c5ce7',
//                 borderRadius: '50%',
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 color: '#fff',
//                 fontSize: '18px',
//                 cursor: 'pointer'
//               }}
//             >
//               {firstLetter}
//             </div>

//          {showDropdown && (
//   <div
//     style={{
//       position: 'absolute',
//       top: '50px',
//       right: 0,
//       backgroundColor: 'white',
//       boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
//       borderRadius: '12px',
//       zIndex: 1000,
//       width: '220px',
//       padding: '10px 0',
//     }}
//   >
//     <Link to="/profile" className="dropdown-item d-flex align-items-center p-1 text-dark text-decoration-none">
//       <User size={18} className="me-2" /> My Profile
//     </Link>
//     <Link to="/settings" className="dropdown-item d-flex align-items-center p-1 text-dark text-decoration-none">
//       <Settings size={18} className="me-2" /> Settings
//     </Link>
//     {/* <Link to="/pricing" className="dropdown-item d-flex align-items-center p-1 text-dark text-decoration-none">
//       <DollarSign size={18} className="me-2" /> Pricing
//     </Link> */}
//     <Link to="/faq" className="dropdown-item d-flex align-items-center p-1 text-dark text-decoration-none">
//       <HelpCircle size={18} className="me-2" /> FAQ
//     </Link>

//     <div style={{ borderTop: '1px solid #eee', margin: '6px 0' }}></div>

//    <button
//       className="d-flex align-items-center justify-content-center w-100 p-1 text-white border-0 rounded"
//       style={{
//         backgroundColor: '#ff4d4f',
//         fontWeight: 'bold',
//         height: '35px',
//       }}
//       onClick={handleLogout}
//     >
//       Logout <LogOut size={18} className="ms-2" />
//     </button>
//   </div>
// )}
//           </NavItem>
//         </Nav>
//       </Collapse>
//     </Navbar>
//   );
// };

// export default Header;
