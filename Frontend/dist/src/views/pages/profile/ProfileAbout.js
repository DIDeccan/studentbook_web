import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody, Button, Input, Form, FormGroup, Label } from "reactstrap";
import { User, CheckCircle, Award, Flag, Type, Phone, Mail } from "react-feather";
import { updateStudentProfile } from "../../../redux/profileSlice";

const ProfileAbout = () => {
  const dispatch = useDispatch();
  const profileData = useSelector((state) => state.profile?.data);
  const loading = useSelector((state) => state.profile?.loading);
  const userData = useSelector((state) => state.auth?.userData);

  const studentId = userData?.student_id;
  const classId = userData?.student_class || profileData?.student_class; // fallback

  const [editMode, setEditMode] = useState(false);
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
    console.log("ProfileAbout useEffect profile:", profileData, "studentId:", studentId, "classId:", classId);
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

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = () => {
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

    dispatch(updateStudentProfile({ studentId, classId, payload })).then((res) => {
      if (res.meta.requestStatus === "fulfilled") setEditMode(false);
    });
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
    setEditMode(false);
  };

  if (loading || !profileData) return <p>Loading profile...</p>;

  return (
    <Card style={{ width: "350px" }}>
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5>About</h5>
          {!editMode && <Button color="primary" size="sm" onClick={() => setEditMode(true)}>Edit Profile</Button>}
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
            <FormGroup><Label>Full Name</Label><Input name="full_name" value={formData.full_name} onChange={handleChange} /></FormGroup>
            <FormGroup><Label>Status</Label><Input name="status" value={formData.status} onChange={handleChange} /></FormGroup>
            <FormGroup><Label>Role</Label><Input name="role" value={formData.role} onChange={handleChange} /></FormGroup>
            <FormGroup><Label>Country</Label><Input name="country" value={formData.country} onChange={handleChange} /></FormGroup>
            <FormGroup><Label>Language</Label><Input name="language" value={formData.language} onChange={handleChange} /></FormGroup>
            <FormGroup><Label>Contact</Label><Input name="contact" value={formData.contact} onChange={handleChange} /></FormGroup>
            <FormGroup><Label>Email</Label><Input type="email" name="email" value={formData.email} onChange={handleChange} /></FormGroup>

            <div className="d-flex gap-2 mt-2">
              <Button color="success" onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
              <Button color="secondary" onClick={handleReset}>Reset</Button>
            </div>
          </Form>
        )}
      </CardBody>
    </Card>
  );
};

export default ProfileAbout;
