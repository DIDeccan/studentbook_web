import { useDispatch, useSelector } from "react-redux";
import { Card, Button, Spinner } from "reactstrap";
import { Mail, Phone, Calendar } from "react-feather";
import { uploadStudentProfileImage } from "../../../redux/profileSlice";

const ProfileHeader = () => {
  const dispatch = useDispatch();

  const profileData = useSelector((state) => state.profile?.data);
  const loading = useSelector((state) => state.profile?.loading);
  const userData = useSelector((state) => state.auth?.userData);

  const studentId = userData?.student_id;
  const classId =
    userData?.course_id ||
    userData?.student_class ||
    profileData?.student_packages?.[0]?.course_id;

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (!file || !studentId || !classId) return;
    dispatch(uploadStudentProfileImage({ studentId, classId, file }));
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
            {profile.profile_image ? (
              <img
                src={profile.profile_image}
                alt="User Avatar"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span>
                {profile.first_name?.charAt(0) || ""}
                {profile.last_name?.charAt(0) || ""}
              </span>
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



