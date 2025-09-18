import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody, Button, Input, Form, FormGroup, Label } from "reactstrap";
import { User, CheckCircle, Award, Flag, Type, Phone, Mail } from "react-feather";
import {
  updateStudentProfile,
  sendPhoneOtp,
  verifyPhoneOtp,
  resendOtp
} from "../../../redux/profileSlice";

const ProfileAbout = () => {
  const dispatch = useDispatch();
  const profileData = useSelector((state) => state.profile?.data);
  const loading = useSelector((state) => state.profile?.loading);
  const authData = useSelector(
    (state) => state.auth?.userData || state.auth?.authData?.user
  );

  const studentId = authData?.student_id;
  // const classId = authData?.student_class || profileData?.student_class;
const classId =
  authData?.class_id || // from auth
  authData?.student_class || // fallback from auth
  profileData?.class_id || // from profile
  (profileData?.student_packages?.length > 0
    ? profileData.student_packages[0]?.class_id // first package class
    : null);
  const [editMode, setEditMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [formData, setFormData] = useState({
    full_name: "",
    status: "Active",
    role: "Student",
    country: "India",
    language: "English",
    contact: "",
    email: ""
  });

  useEffect(() => {
    if (profileData) {
      setFormData({
        full_name: `${profileData.first_name || ""} ${profileData.last_name || ""}`.trim(),
        status: profileData.status || "Active",
        role: profileData.role || "Student",
        country: profileData.country || "India",
        language: profileData.language || "English",
        contact: profileData.phone_number || "",
        email: profileData.email || ""
      });
    }
  }, [profileData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!studentId || !classId) return;

    const [firstName, ...rest] = formData.full_name.trim().split(" ");
    const lastName = rest.join(" ") || "";

    const payload = {
      first_name: firstName,
      last_name: lastName,
      status: formData.status,
      role: formData.role,
      country: formData.country,
      language: formData.language,
      phone_number: formData.contact,
      email: formData.email
    };

    if (formData.contact !== profileData.phone_number) {
      setNewPhone(formData.contact);
      setOtpSent(true); // Show OTP input
      dispatch(sendPhoneOtp({ studentId, classId, newPhone: formData.contact }));
      return;
    }

    const result = await dispatch(updateStudentProfile({ studentId, classId, payload }));
    if (result.meta.requestStatus === "fulfilled") setEditMode(false);
  };

  const handleVerifyOtp = async () => {

    if (!otp || !newPhone) return;

    const res = await dispatch(
      verifyPhoneOtp({ studentId, newPhone, otp, classId })
    );


    if (res.meta.requestStatus === "fulfilled") {
      setFormData((prev) => ({ ...prev, contact: newPhone }));
      setOtpSent(false);
      setOtp("");
      setEditMode(false);
    }
  };
  const handleResendOtp = () => {
    if (!newPhone) return;
    dispatch(resendOtp(newPhone));
  };


  const handleReset = () => {
    if (profileData) {
      setFormData({
        full_name: `${profileData.first_name || ""} ${profileData.last_name || ""}`.trim(),
        status: profileData.status || "Active",
        role: profileData.role || "Student",
        country: profileData.country || "India",
        language: profileData.language || "English",
        contact: profileData.phone_number || "",
        email: profileData.email || ""
      });
    }
    setOtpSent(false);
    setOtp("");
    setEditMode(false);
  };

  if (loading || !profileData) return <p>Loading profile...</p>;

  return (
    <Card style={{ width: "350px" }}>
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5>About</h5>
          {!editMode && (
            <Button color="primary" size="sm" onClick={() => setEditMode(true)}>
              Edit Profile
            </Button>
          )}
        </div>

        {!editMode ? (
          <>
            <div className="mb-1"><User size={16} className="me-1" /> <b>Full Name:</b> {formData.full_name}</div>
            <div className="mb-1"><CheckCircle size={16} className="me-1" /> <b>Status:</b> {formData.status}</div>
            <div className="mb-1"><Award size={16} className="me-1" /> <b>Role:</b> {formData.role}</div>
            <div className="mb-1"><Flag size={16} className="me-1" /> <b>Country:</b> {formData.country}</div>
            <div className="mb-1"><Type size={16} className="me-1" /> <b>Language:</b> {formData.language}</div>
            <hr />
            <h6>Contacts</h6>
            <div className="mb-1"><Phone size={16} className="me-1" /> <b>Contact:</b> {formData.contact}</div>
            <div className="mb-1"><Mail size={16} className="me-1" /> <b>Email:</b> {formData.email}</div>
          </>
        ) : (
          <Form>
            <FormGroup>
              <Label>Full Name</Label>
              <Input name="full_name" value={formData.full_name} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label>Status</Label>
              <Input name="status" value={formData.status} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label>Role</Label>
              <Input name="role" value={formData.role} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label>Country</Label>
              <Input name="country" value={formData.country} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label>Language</Label>
              <Input name="language" value={formData.language} onChange={handleChange} />
            </FormGroup>

            {/* Contact / OTP */}
            <FormGroup>
              <Label>Contact</Label>
              <Input
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                disabled={otpSent}
              />
            </FormGroup>

            {otpSent && (
              <FormGroup>
                <Label>Enter OTP</Label>
                <Input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP sent to phone"
                />
                <div className="d-flex gap-2 mt-1">
                  <Button color="success" size="sm" onClick={handleVerifyOtp}>
                    Verify OTP
                  </Button>
                  <Button color="warning" size="sm" onClick={handleResendOtp}>
                    Resend OTP
                  </Button>
                  <Button
                    color="secondary"
                    size="sm"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </FormGroup>
            )}


            <FormGroup>
              <Label>Email</Label>
              <Input type="email" name="email" value={formData.email} onChange={handleChange} />
            </FormGroup>

            <div className="d-flex gap-2 mt-2">
              <Button color="success" onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
              <Button color="secondary" onClick={handleReset}>Reset</Button>
            </div>
          </Form>
        )}
      </CardBody>
    </Card>
  );
};

export default ProfileAbout;
