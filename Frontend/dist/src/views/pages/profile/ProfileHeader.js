import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Card, Button, Spinner } from "reactstrap";
import { Mail, Phone, Calendar } from "react-feather";
import { uploadStudentProfileImage, removeStudentProfileImage } from "../../../redux/profileSlice";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ProfileHeader = () => {
  const dispatch = useDispatch();

  const profileData = useSelector((state) => state.profile?.data);
  const loading = useSelector((state) => state.profile?.loading);
  const uploading = useSelector((state) => state.profile?.uploading);
  const authData = useSelector((state) => state.auth?.userData || state.auth?.authData?.user);

  // const studentId = authData?.student_id;
  // const classId =
  //   authData?.course_id ||
  //   authData?.student_class ||
  //   (profileData?.student_packages && profileData.student_packages.length > 0
  //     ? profileData.student_packages[0].course_id
  //     : null);
const studentId = authData?.student_id || profileData?.student_id || profileData?.id;
const classId =
  authData?.student_class ||
  profileData?.class_id ||
  (profileData?.student_packages?.length > 0
    ? profileData.student_packages[0]?.class_id
    : null);


  const [previewFile, setPreviewFile] = useState(null);
  const [file, setFile] = useState(null);


  const handleFileSelect = (event) => {
    const selected = event.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreviewFile(URL.createObjectURL(selected));
  };

  const handleUpload = () => {
    if (!file) {
      console.warn("No file selected");
      return;
    }
    if (!studentId || !classId) {
      console.warn("Cannot upload - studentId or classId missing", { studentId, classId });
      return;
    }
    console.log("Dispatching uploadStudentProfileImage with:", { studentId, classId, file });
    dispatch(uploadStudentProfileImage({ studentId, classId, file }));

    setPreviewFile(null);
    setFile(null);
  };

  if (loading || !profileData) {
    return (
      <Card className="p-3 text-center">
        <Spinner color="primary" />
        <p className="mb-0 mt-2 text-muted">Loading student profile...</p>
      </Card>
    );
  }

  const profile = profileData;
  const subscription = profile.student_packages?.[0];
  const profileImageUrl = previewFile || (profile.profile_image ? `${BASE_URL}${profile.profile_image}` : null);

  return (
    <Card className="border-0 shadow-sm">
      <div
        style={{
          background: "linear-gradient(90deg, #e14eca, #657bf3)",
          height: "120px",
          borderTopLeftRadius: "0.5rem",
          borderTopRightRadius: "0.5rem",
        }}
      ></div>

      <div className="d-flex align-items-center justify-content-between p-2">
        <div className="d-flex align-items-center">
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              fontWeight: "bold",
              color: "#6c757d",
            }}
          >
            {profileImageUrl ? (
              <img src={profileImageUrl}
                alt="User Avatar"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />

            ) : (
              <span>
                {profile.first_name?.charAt(0) || ""}
                {profile.last_name?.charAt(0) || ""}
              </span>
            )}
            {uploading && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(255,255,255,0.6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Spinner size="sm" color="primary" />
              </div>
            )}
          </div>

          <div className="ms-3">
            <h4 className="mb-1">
              {profile.first_name} {profile.last_name}
            </h4>
            <div className="d-flex flex-wrap text-muted">
              <span className="me-3 d-flex align-items-center">
                <Mail size={15} className="me-1" /> {profile.email || "N/A"}
              </span>
              <span className="me-3 d-flex align-items-center">
                <Phone size={15} className="me-1" /> {profile.phone_number || "N/A"}
              </span>
              <span className="d-flex align-items-center">
                <Calendar size={15} className="me-1" /> Joined{" "}
                {subscription?.subscription_taken_from
                  ? new Date(subscription.subscription_taken_from).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div className="text-end">
          <div className="d-flex align-items-center gap-2">
            <Button tag="label" htmlFor="uploadInput" color="primary" size="sm">
              Upload New Photo
            </Button>
            <input
              type="file"
              id="uploadInput"
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleFileSelect}
            />
            {previewFile && (
              <Button color="success" size="sm" onClick={handleUpload}>
                Confirm
              </Button>
            )}
            <Button
              color="secondary"
              size="sm"
              onClick={() => {
                setPreviewFile(null);
                setFile(null);
                if (studentId && classId) {
                  dispatch(removeStudentProfileImage({ studentId, classId }));
                }
              }}
            >
              Remove
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
