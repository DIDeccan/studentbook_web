import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from "reactstrap";
import { Power, Settings } from "react-feather";
import { logoutUser } from "@store/authentication";

const UserDropdown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.userData) || {};
  console.log(user);

const username = user.first_name || user.last_name 
  ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim()
  : "UserName";

 const className = user.student_class
  ? `Class ${user.student_class}`
  : user.course_id
  ? `Class ${user.course_id}`  
  : "No class selected";


  const userAvatar = user.profile_image
    ? `${user.profile_image}?t=${new Date().getTime()}`
    : null;

  const avatarInitials = (user.first_name?.[0] || user.user_type?.[0] || "U") +
                         (user.last_name?.[0] || "");

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

        {userAvatar ? (
          <img
            src={userAvatar}
            alt="User Avatar"
            style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "50%" }}
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
              fontSize: "16px",
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

        <DropdownItem tag="a" href="/login" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
          <Power size={14} className="me-75" />
          <span className="align-middle">Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default UserDropdown;
