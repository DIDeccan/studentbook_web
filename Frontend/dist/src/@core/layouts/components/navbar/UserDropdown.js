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

  const profileData = useSelector((state) => state.studentProfile?.data);
  const authUser = useSelector((state) => state.auth?.user);

  const [avatarURL, setAvatarURL] = useState(null);
  const [localProfile, setLocalProfile] = useState(null);

  useEffect(() => {
    const storedProfile = localStorage.getItem("studentProfileData");
    if (storedProfile) {
      console.log("Loaded profile from localStorage:", JSON.parse(storedProfile));
      setLocalProfile(JSON.parse(storedProfile));
    }
  }, []);

  useEffect(() => {
    if (!profileData?.id && authUser?.student_id) {
      console.log(
        "No profile data in Redux. Fetching with studentId:",
        authUser.student_id,
        "classId:",
        authUser.course_id
      );
      dispatch(fetchStudentProfile({ studentId: authUser.student_id, classId: authUser.course_id }));
    }
  }, [profileData?.id, authUser, dispatch]);

  const activeProfile = profileData || localProfile;

  useEffect(() => {
    if (activeProfile?.profile_image) {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
      setAvatarURL(`${BASE_URL}${activeProfile.profile_image}?t=${Date.now()}`);
    } else {
      setAvatarURL(null);
    }
  }, [activeProfile?.profile_image]);

  const username =
    [activeProfile?.first_name, activeProfile?.last_name].filter(Boolean).join(" ") ||
    "User";

  const className =
    activeProfile?.student_packages?.[0]?.course?.name ||
    (activeProfile?.student_class ? `Class ${activeProfile.student_class}` : "No class selected");

  const avatarInitials = `${activeProfile?.first_name?.[0] ?? "U"}${activeProfile?.last_name?.[0] ?? ""}`;

  console.log("Redux studentProfile data:", profileData);
  console.log("LocalStorage studentProfile data:", localProfile);
  console.log("Active Profile being used:", activeProfile);
  console.log("Username:", username);
  console.log("Class Name:", className);

  const handleLogout = async () => {
    try {
      const resultAction = await dispatch(logoutUser()).unwrap();
      if (logoutUser.fulfilled.match(resultAction)) {
        localStorage.removeItem("studentProfileData");
        navigate("/login");
      }
    } catch (err) {
      console.error("Logout error:", err);
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






