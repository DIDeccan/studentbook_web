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

const UserDropdown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

 

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


