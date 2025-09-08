import { useState, useEffect, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getHomeRouteForLoggedInUser } from "@utils";
import { AbilityContext } from '@src/utility/context/Can'
import {
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  FormFeedback,
  Alert,
  Spinner,
} from "reactstrap";
import { Facebook, Twitter, Mail, GitHub } from "react-feather";
import "@styles/react/pages/page-authentication.scss";
import InputPasswordToggle from '@components/input-password-toggle'
import { fetchClasses, signupUser, verifyOtp, resendOtp } from "../../../redux/authentication";
import api from "@src/apis/api";
import API_ENDPOINTS from "@src/apis/endpoints";
import { toast } from "react-toastify";

const defaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  classLevel: "",
  password: "",
  confirmPassword: "",
  accepted: false,
};

const Register = ({ isOpen, toggle, openPayment, openLogin, selectedClass }) => {
  const ability = useContext(AbilityContext)
  const dispatch = useDispatch();
  const { registrationData, accessToken, orderData } = useSelector((state) => state.auth);
  const { loading, error, success, otpVerified } = useSelector((state) => state.auth);
  const [classes, setClasses] = useState([]);
  const [classLoading, setClassLoading] = useState(true);
  const [localLoading, setLocalLoading] = useState(false);
  const [classError, setClassError] = useState(null);
  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const { handleSubmit, control, formState: { errors, isSubmitSuccessful }, watch, setError, clearErrors, reset } = useForm({ defaultValues });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  useEffect(() => {
    if (confirmPassword && confirmPassword !== password) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
    } else {
      clearErrors("confirmPassword");
    }
  }, [confirmPassword, password, setError, clearErrors]);


  // useEffect(() => {
  //   const fetchClasses = async () => {
  //     try {
  //       const res = await api.get(API_ENDPOINTS.CLASSES);
  //       setClasses(res.data.data || []);
  //     } catch (err) {
  //       console.error("Error fetching classes:", err);
  //       setClassError("Failed to load classes");
  //     } finally {
  //       setClassLoading(false);
  //     }
  //   };
  //   fetchClasses();
  // }, []);

  // useEffect(() => {
  //   if (selectedClass) {
  //     reset({
  //       classLevel: selectedClass.id,
  //     });
  //   }
  // }, [selectedClass, reset]);

   // Fetch classes from Redux
  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  // Preselect class if passed
  useEffect(() => {
    if (selectedClass) {
      reset({ classLevel: selectedClass.id });
    }
  }, [selectedClass, reset]);

  const onSubmit = async (data) => {
    const payload = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      classLevel: data.classLevel,
      address: data.address,
      password: data.password,
      confirmPassword: data.confirmPassword,
    };

    setLocalLoading(true);
    try {
      const res = await dispatch(signupUser(payload)).unwrap();
      setOtpMode(true);
      setRegisteredEmail(data.email);
      toast.success(res.message || "OTP sent to your Phone. Enter it below.");
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLocalLoading(false);
    }
  };


  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }

    if (!registrationData) {
      toast.error("Registration data missing!");
      return;
    }

    const payload = { ...registrationData, otp };
    setLocalLoading(true);

    try {
      const res = await dispatch(verifyOtp(payload)).unwrap();
      toast.success("OTP Verified Successfully");

      toggle();
      openPayment();

    } catch (err) {
      console.error("OTP verification failed:", err);
      toast.error("OTP verification failed");
    } finally {
      console.log("OTP submission flow finished. Local loading reset.");
      setLocalLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!registrationData?.phone_number) {
      toast.error("Phone number missing. Please sign up again.");
      return;
    }

    setResendLoading(true);

    try {
      const res = await dispatch(resendOtp(registrationData.phone_number)).unwrap();
      toast.success(res?.message || "OTP resent successfully!");
    } catch (err) {
      console.error("Resend OTP error:", err);
      toast.error(err?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };


  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      centered
      scrollable
      className="w-100"
      style={{ maxWidth: "900px", width: "95%", maxHeight: "90vh" }}
    >
      <ModalHeader toggle={toggle} className="border-0 pb-0" />
      <ModalBody style={{ padding: 0 }}>
        <Row className="g-0 h-100">
          <Col
            md="6"
            className="d-none d-md-flex align-items-center justify-content-center p-4"
            style={{ backgroundColor: "#f8f8f8" }}
          >
            <div className="text-center">
              <h4 className="mt-2">Welcome to Student Book!</h4>
              <p className="text-muted">Start your journey with us</p>
            </div>
          </Col>

          <Col
            md="6"
            className="p-4"
            style={{
              maxHeight: "80vh",
              overflowY: "auto",
              WebkitOverflowScrolling: "touch",
              transform: "translateZ(0)",
            }}
          >
            <h4 className="mb-1">Create an Account</h4>
            <p className="text-muted mb-3">Let’s get you set up</p>

            <Form onSubmit={otpMode ? handleOtpSubmit : handleSubmit(onSubmit)}>
              {!otpMode ? (
                <>

                  {/* First Name */}
                  <FormGroup>
                    <Label>First Name</Label>
                    <Controller
                      name="firstName"
                      control={control}
                      defaultValue=""
                      rules={{ required: "First name is required" }}
                      render={({ field }) => (
                        <Input {...field} invalid={!!errors.firstName} />
                      )}
                    />
                    <FormFeedback>{errors.firstName?.message}</FormFeedback>
                  </FormGroup>

                  {/* Last Name */}
                  <FormGroup>
                    <Label>Last Name</Label>
                    <Controller
                      name="lastName"
                      control={control}
                      defaultValue=""
                      rules={{ required: "Last name is required" }}
                      render={({ field }) => (
                        <Input {...field} invalid={!!errors.lastName} />
                      )}
                    />
                    <FormFeedback>{errors.lastName?.message}</FormFeedback>
                  </FormGroup>

                  {/* Phone */}
                  <FormGroup>
                    <Label>Phone Number</Label>
                    <Controller
                      name="phone"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: "Phone number is required",
                        pattern: {
                          value: /^[0|6-9]\d{9}$/,
                          message: "Enter valid 10-digit phone number",
                        },
                      }}
                      render={({ field }) => (
                        <Input type="tel" {...field} invalid={!!errors.phone} />
                      )}
                    />
                    <FormFeedback>{errors.phone?.message}</FormFeedback>
                  </FormGroup>

                  {/* Email */}
                  <FormGroup>
                    <Label>Email</Label>
                    <Controller
                      name="email"
                      control={control}
                      defaultValue=""
                      rules={{ required: "Email is required" }}
                      render={({ field }) => (
                        <Input {...field} invalid={!!errors.email} />
                      )}
                    />
                    <FormFeedback>{errors.email?.message}</FormFeedback>
                  </FormGroup>

                  {/* Class */}
                  <FormGroup>
                    <Label>Class</Label>
                    <Controller
                      name="classLevel"
                      control={control}
                      defaultValue=""
                      rules={{ required: "Please select your class" }}
                      render={({ field }) => (
                        <Input type="select" {...field} invalid={!!errors.classLevel}>
                          <option value="">Select Class</option>
                          {classLoading && (
                            <option disabled>Loading classes...</option>
                          )}
                          {classError && (
                            <option disabled>{classError}</option>
                          )}
                          {!classLoading &&
                            !classError &&
                            classes.map((cls) => (
                              <option key={cls.id} value={cls.id}>
                                {cls.name}
                              </option>
                            ))}
                        </Input>
                      )}
                    />
                    <FormFeedback>{errors.classLevel?.message}</FormFeedback>
                  </FormGroup>

                  {/* Password */}
                  <FormGroup>
                    <Label>Password</Label>
                    <Controller
                      name="password"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: "Password is required",
                        pattern: {
                          value:
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/,
                          message:
                            "Password must be at least 6 characters, include upper, lower, digit & special char",
                        },
                      }}
                      render={({ field }) => (
                        <InputPasswordToggle
                          type="password"
                          {...field}
                          invalid={!!errors.password}
                        />
                      )}
                    />
                    <FormFeedback>{errors.password?.message}</FormFeedback>
                  </FormGroup>

                  {/* Confirm Password */}
                  <FormGroup>
                    <Label>Confirm Password</Label>
                    <Controller
                      name="confirmPassword"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: "Confirm your password",
                        validate: (val) =>
                          val === password || "Passwords do not match",
                      }}
                      render={({ field }) => (
                        <InputPasswordToggle
                          type="password"
                          {...field}
                          invalid={!!errors.confirmPassword}
                        />
                      )}
                    />
                    <FormFeedback>{errors.confirmPassword?.message}</FormFeedback>
                  </FormGroup>

                  {/* Terms */}
                  <FormGroup check className="mb-3">
                    <Controller
                      name="accepted"
                      control={control}
                      defaultValue={false}
                      rules={{
                        validate: (val) => val || "Accept terms to proceed",
                      }}
                      render={({ field }) => (
                        <Input
                          type="checkbox"
                          {...field}
                          checked={field.value || false}
                          invalid={!!errors.accepted}
                        />
                      )}
                    />
                    <Label check className="ms-2">
                      I accept the Terms and Privacy Policy
                    </Label>
                    {errors.accepted && (
                      <div className="text-danger">
                        {errors.accepted.message}
                      </div>
                    )}
                  </FormGroup>

                  <Button
                    color="primary"
                    type="submit"
                    block
                    className="mt-1"
                    disabled={localLoading}
                  >
                    {localLoading ? <Spinner size="sm" /> : "Register"}
                  </Button>
                </>
              ) : (
                // OTP Step
                <>
                  <h4 className="mb-1">Verify Your Account</h4>
                  <p className="text-muted mb-3">
                    Enter the OTP sent to {registeredEmail}
                  </p>
                  <FormGroup>
                    <Label>OTP</Label>
                    <Input
                      value={otp || ""}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                      required
                    />
                  </FormGroup>
                  <Button
                    color="primary"
                    type="submit"
                    block
                    disabled={localLoading}
                  >
                    {localLoading ? <Spinner size="sm" /> : "Verify OTP"}
                  </Button>

                  {/* Resend OTP */}
                  <div className="mt-3">
                    <Button
                      type="button"
                      color="link"
                      onClick={handleResendOtp}
                      disabled={resendLoading}
                    >
                      {resendLoading ? "Resending..." : "Resend OTP"}
                    </Button>
                  </div>
                </>
              )}
            </Form>

            <p className="text-center mt-2">
              <span>
                Already have an account?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    toggle();
                    openLogin();
                  }}
                >
                  Login Instead
                </a>
              </span>
            </p>

            <div className="divider my-2">
              <div className="divider-text">or</div>
            </div>

            <div className="auth-footer-btn d-flex justify-content-center gap-1">
              <Button color="facebook">
                <Facebook size={14} />
              </Button>
              <Button color="twitter">
                <Twitter size={14} />
              </Button>
              <Button color="google">
                <Mail size={14} />
              </Button>
              <Button color="github">
                <GitHub size={14} />
              </Button>
            </div>
          </Col>
        </Row>
      </ModalBody>
    </Modal>

  );
};

export default Register;
