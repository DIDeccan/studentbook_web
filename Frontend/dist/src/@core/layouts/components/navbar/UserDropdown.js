import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem
} from "reactstrap";
import toast from "react-hot-toast";
import { Power, Settings } from "react-feather";
import { logoutUser } from "@store/authentication";
import { fetchStudentProfile } from "../../../../redux/profileSlice";

const UserDropdown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
const authData = useSelector((state) => state.auth.userData); // strictly Redux

//  const authData = useSelector(
//     (state) => state.auth?.userData || state.auth?.authData?.user || state.auth?.user
//   );
  const profileData = useSelector((state) => state.profile?.data);
  const profileLoading = useSelector((state) => state.profile?.loading);

//   console.log("UserDropdown -> authData:", authData);
//   console.log("UserDropdown -> profileData:", profileData);

// console.log("LocalStorage studentProfileData:", localStorage.getItem("studentProfileData"));


  const [avatarURL, setAvatarURL] = useState(null);
  // ✅ Resolve studentId/classId like in ProfileHeader
  const studentId = authData?.student_id || profileData?.student_id || authData?.id;
 const classId =
  authData?.class_id || // <- authData directly
  profileData?.class_id || // <- profileData directly
  (profileData?.student_packages?.length > 0
    ? profileData.student_packages[0]?.class_id // <- package fallback
    : null);

  // console.log("Resolved IDs:", { studentId, classId });

  useEffect(() => {
    if (!profileData && studentId && classId) {
      dispatch(fetchStudentProfile({ studentId, classId }));
    }
  }, [studentId, classId, profileData, dispatch]);

  // 🔹 Update avatar when profile image changes
  useEffect(() => {
    if (profileData?.profile_image) {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
      setAvatarURL(`${BASE_URL}${profileData.profile_image}?t=${Date.now()}`);
    } else {
      setAvatarURL(null);
    }
  }, [profileData?.profile_image]);

   const username =
    profileData?.first_name || profileData?.last_name
      ? [profileData.first_name, profileData.last_name].filter(Boolean).join(" ")
      : authData?.name || "User";

// 🔹 Class display
// const className =
//   profileData?.student_packages?.[0]?.class_name || // if class name is available in package
//   (profileData?.class_id ? `Class ${profileData.class_id}` : "No class selected");

const className =
  profileData?.class_name ||      // directly from profileData
  authData?.class_name ||         // fallback from Redux authData
  "No class selected";

  // 🔹 Avatar initials fallback
  const avatarInitials = `${
    profileData?.first_name?.[0] ??
    authData?.first_name?.[0] ??
    authData?.name?.[0] ??
    "U"
  }${profileData?.last_name?.[0] ?? authData?.last_name?.[0] ?? ""}`;

  // const handleLogout = async () => {
  //   try {
  //     const resultAction = await dispatch(logoutUser()).unwrap();
  //     if (logoutUser.fulfilled.match(resultAction)) {
  //       navigate("/login");
  //     }
  //   } catch (err) {
  //     console.error("Logout error:", err);
  //   }
  // };
const handleLogout = async () => {
  try {
    const resultAction = await dispatch(logoutUser());

    if (logoutUser.fulfilled.match(resultAction)) {
      
      toast.success("Logout successful");
      navigate("/login", { replace: true }); // Only navigate if logout succeeded
    } else {
      // console.error("Logout failed", resultAction.payload || resultAction.error);
      toast.error(resultAction.payload || "Logout failed. Please try again.");
      // Do NOT navigate, stay on the current page
    }
  } catch (err) {
    // console.error("Logout error (thrown):", err);
    toast.error("Logout failed. Please check network or try again.");
    // Do NOT navigate, stay on the current page
  }
};

  if (profileLoading) {
    return (
      <div className="nav-item" style={{ padding: "0.5rem 1rem" }}>
        Loading...
      </div>
    );
  }

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


