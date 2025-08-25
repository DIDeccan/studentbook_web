import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Button, Spinner } from "reactstrap";
import { Mail, Phone, User, Calendar } from "react-feather";
import { fetchProfile, uploadProfileImage } from "../../../redux/profileSlice"; 

const ProfileHeader = () => {
  const dispatch = useDispatch();
const profileState = useSelector((state) => state.profile ?? { data: null, loading: false });
const profile = profileState.data;
const loading = profileState.loading;

  useEffect(() => {
    if (!profile) dispatch(fetchProfile());
  }, [dispatch, profile]);

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    dispatch(uploadProfileImage(file));
  };

    if (loading || !profile) {
    return (
      <Card className="p-3 text-center">
        <Spinner color="primary" />
        <p className="mb-0 mt-2 text-muted">Loading profile...</p>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      {/* Top Gradient Banner */}
      <div
        style={{
          background: "linear-gradient(90deg, #e14eca, #657bf3)",
          height: "120px",
          borderTopLeftRadius: "0.5rem",
          borderTopRightRadius: "0.5rem",
        }}
      ></div>

      <div className="d-flex align-items-center justify-content-between p-2">
        {/* Left Section - Avatar + Info */}
        <div className="d-flex align-items-center">
          {/* Avatar */}
          <div
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "12px",
              overflow: "hidden",
              border: "3px solid white",
              marginTop: "-70px",
              background: "#f8f9fa",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            {profile.profile_image ? (
              <img
                src={profile.profile_image}
                alt="User Avatar"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <User size={50} color="#6c757d" style={{ margin: "20px" }} />
            )}
          </div>

          {/* Info */}
          <div className="ms-3">
            <h4 className="mb-1">
              {profile.first_name} {profile.last_name}
            </h4>
            <div className="d-flex flex-wrap text-muted">
              <span className="me-3 d-flex align-items-center">
                <Mail size={15} className="me-1" /> {profile.email}
              </span>
              <span className="me-3 d-flex align-items-center">
                <Phone size={15} className="me-1" />{" "}
                {profile.phone_number || "N/A"}
              </span>
              <span className="d-flex align-items-center">
                <Calendar size={15} className="me-1" /> Joined{" "}
                {profile.student_packages?.[0]?.subscription_taken_from
                  ? new Date(
                      profile.student_packages[0].subscription_taken_from
                    ).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Section - Upload Button */}
        <div className="text-end">
          <div className="d-flex align-items-center gap-2">
            <Button
              color="primary"
              size="sm"
              onClick={() => document.getElementById("uploadInput").click()}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload New Photo"}
            </Button>
            <input
              type="file"
              id="uploadInput"
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleUpload}
            />
            <Button color="secondary" size="sm">
              Reset
            </Button>
          </div>
          <small className="text-muted d-block mt-1">
            Allowed JPG, GIF or PNG. Max size of 800K
          </small>
        </div>
      </div>
    </Card>
  );
};

export default ProfileHeader;

