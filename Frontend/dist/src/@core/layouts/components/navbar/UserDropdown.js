// import { Link, useNavigate } from "react-router-dom";
// import {useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from "reactstrap";
// import { Power, Settings } from "react-feather";
// import { logoutUser, fetchClasses } from "@store/authentication";
// import { fetchStudentProfile } from "../../../../redux/profileSlice";

// const UserDropdown = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const authUser = useSelector((state) => state.auth.userData) || {};
//  const classes = useSelector((state) => state.auth.classes) || []; 
// const profileData = useSelector((state) => state.studentProfile?.data) || 
//                       JSON.parse(localStorage.getItem("studentProfileData")) || {};

// const user = { ...authUser};
//   console.log("authUser:", authUser);
//   console.log("profileData:", profileData);
//    const [avatarURL, setAvatarURL] = useState(null);

// // const username = user.first_name || user.last_name 
// //   ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim()
// //   : "UserName";
// const username = [user.first_name, user.last_name].filter(Boolean).join(" ") || "UserName";

//  useEffect(() => {
//     if (!classes || classes.length === 0) {
//       dispatch(fetchClasses());
//     }
//   }, [classes, dispatch]);

//     useEffect(() => {
//     if (!profileData?.id) {
//       dispatch(fetchStudentProfile());
//     }
//   }, [profileData?.id, dispatch]);

//   // Update avatar URL whenever profileData or authUser changes
//   useEffect(() => {
//     const image = profileData?.profile_image || authUser?.profile_image;
//     if (image) {
//      const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
//       setAvatarURL(`${BASE_URL}${image}?t=${new Date().getTime()}`);
//     } else {
//       setAvatarURL(null);
//     }
//   }, [profileData?.profile_image, authUser?.profile_image]);


//   // Get the class ID (either student_class or course_id)
//   const classId = user?.student_class || user?.course_id;

//   // Find the class name from classes list
//   const classObj = classes.find((cls) => cls.id === classId); 
//    const className = classObj ? classObj.name : "No class selected";

//   // const userAvatar = profileData.profile_image
//   //   ? `${profileData.profile_image}?t=${new Date().getTime()}`
//   //   : null;



//   const avatarInitials = (user.first_name?.[0] || user.user_type?.[0] || "U") +
//                          (user.last_name?.[0] || "");

//   const handleLogout = async () => {
//     try {
//       const resultAction = await dispatch(logoutUser()).unwrap();
//       if (logoutUser.fulfilled.match(resultAction)) {
//         navigate("/login");
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
//       <DropdownToggle
//         href="/"
//         tag="a"
//         className="nav-link dropdown-user-link"
//         onClick={(e) => e.preventDefault()}
//       >
//         <div className="user-nav d-sm-flex d-none">
//           <span className="user-name fw-bold">{username}</span>
//           <span className="user-status">{className}</span>
//         </div>

//         {avatarURL ? (
//           <img
//             src={avatarURL}
//             alt="User Avatar"
//             style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "50%" }}
//           />
//         ) : (
//           <div
//             style={{
//               width: "40px",
//               height: "40px",
//               borderRadius: "50%",
//               backgroundColor: "#7367f0",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               color: "white",
//               fontWeight: "bold",
//               fontSize: "16px",
//             }}
//           >
//             {avatarInitials.toUpperCase()}
//           </div>
//         )}
//       </DropdownToggle>

//       <DropdownMenu end>
//         <DropdownItem tag={Link} to="pages/profile">
//           <Settings size={14} className="me-75" />
//           <span className="align-middle">Profile Settings</span>
//         </DropdownItem>

//         <DropdownItem tag="a" href="/login" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
//           <Power size={14} className="me-75" />
//           <span className="align-middle">Logout</span>
//         </DropdownItem>
//       </DropdownMenu>
//     </UncontrolledDropdown>
//   );
// };

// export default UserDropdown;


import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem
} from "reactstrap";
import { Power, Settings } from "react-feather";
import { logoutUser } from "@store/authentication";
import { fetchStudentProfile } from "../../../../redux/profileSlice";

const UserDropdown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // --- Redux States ---
  const profileData = useSelector((state) => state.studentProfile?.data) || {};

  const [avatarURL, setAvatarURL] = useState(null);

  console.log("Redux studentProfile data:", profileData);

  // --- Fetch profile if not already loaded ---
  useEffect(() => {
    if (!profileData?.id) {
      dispatch(fetchStudentProfile({})); // ✅ IDs auto-resolved in profileSlice
    }
  }, [profileData?.id, dispatch]);

  // --- Update avatar URL when profile changes ---
  useEffect(() => {
    if (profileData?.profile_image) {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
      setAvatarURL(
        `${BASE_URL}${profileData.profile_image}?t=${new Date().getTime()}`
      );
    } else {
      setAvatarURL(null);
    }
  }, [profileData?.profile_image]);

  // --- Username ---
  const username =
    [profileData.first_name, profileData.last_name].filter(Boolean).join(" ") ||
    "UserName";

  // --- Class name from student_packages ---
  const className =
    profileData.student_packages?.[0]?.course?.name || "No class selected";

  console.log("Username resolved from profile:", username);
  console.log("Class name resolved from profile:", className);

  // --- Avatar Initials ---
  const avatarInitials =
    (profileData.first_name?.[0] || "U") +
    (profileData.last_name?.[0] || "");

  // --- Logout Handler ---
  const handleLogout = async () => {
    try {
      const resultAction = await dispatch(logoutUser()).unwrap();
      if (logoutUser.fulfilled.match(resultAction)) {
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
      <DropdownToggle
        href="/"
        tag="a"
        className="nav-link dropdown-user-link"
        onClick={(e) => e.preventDefault()}
      >
        <div className="user-nav d-sm-flex d-none">
          <span className="user-name fw-bold">{username}</span>
          <span className="user-status">{className}</span>
        </div>

        {avatarURL ? (
          <img
            src={avatarURL}
            alt="User Avatar"
            style={{
              width: "40px",
              height: "40px",
              objectFit: "cover",
              borderRadius: "50%"
            }}
          />
        ) : (
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#7367f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: "16px"
            }}
          >
            {avatarInitials.toUpperCase()}
          </div>
        )}
      </DropdownToggle>

      <DropdownMenu end>
        <DropdownItem tag={Link} to="pages/profile">
          <Settings size={14} className="me-75" />
          <span className="align-middle">Profile Settings</span>
        </DropdownItem>

        <DropdownItem
          tag="a"
          href="/login"
          onClick={(e) => {
            e.preventDefault();
            handleLogout();
          }}
        >
          <Power size={14} className="me-75" />
          <span className="align-middle">Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default UserDropdown;




