import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Avatar from "@components/avatar";
import { isUserLoggedIn } from "@utils";
import { useDispatch } from "react-redux";
import { Power, Settings } from "react-feather";
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from "reactstrap";
import defaultAvatar from "@src/assets/images/portrait/small/avatar-s-11.jpg";
import { logoutUser } from "@store/authentication"; 

const UserDropdown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(JSON.parse(localStorage.getItem("userData")));
    }
  }, []);

  const userAvatar = userData?.avatar || defaultAvatar;

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
      <DropdownToggle href="/" tag="a" className="nav-link dropdown-user-link" onClick={(e) => e.preventDefault()}>
        <Avatar img={userAvatar} imgHeight="40" imgWidth="40" status="online" />
      </DropdownToggle>

      <DropdownMenu end>
        <DropdownItem tag={Link} to="/profile-settings">
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
