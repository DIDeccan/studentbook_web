import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Button } from "reactstrap";
import { forgotPassword, resendOtp } from "../../../redux/authentication";
import InputPasswordToggle from '@components/input-password-toggle'
import { bottom } from "@popperjs/core";

const ForgotPassword = ({ isOpen, toggle }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (step === 1) {
        const result = await dispatch(forgotPassword({ phone })).unwrap();
        toast.success(result);
        setStep(2);
      }

      else if (step === 2 && !otpVerified) {
        const result = await dispatch(forgotPassword({ phone, otp })).unwrap();
        toast.success(result);
        setOtpVerified(true);
      }

      else if (step === 2 && otpVerified) {
        if (newPassword !== confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }
        const result = await dispatch(
          forgotPassword({ phone, otp, newPassword, confirmPassword })
        ).unwrap();
        toast.success(result);

        toggle();
        setStep(1);
        setPhone("");
        setOtp("");
        setOtpVerified(false);
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      toast.error(err?.message || err);
    }
  };

  const handleResendOtp = async () => {
    if (!phone) {
      toast.error("Enter your phone number first");
      return;
    }
    setResendLoading(true);
    try {
      const res = await dispatch(resendOtp(phone)).unwrap();
      toast.success(res?.message || "OTP resent successfully!");
    } catch (err) {
      toast.error(err?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>Forgot Password</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          {step === 1 && (
            <FormGroup>
              <Label>Phone Number</Label>
              <Input
                type="text"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ marginBottom: "10px" }}
                required
              />
              <Button color="primary" block type="submit" disabled={loading}>
                {loading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </FormGroup>
          )}

          {step === 2 && (
            <>
              <FormGroup>
                <Label>Phone Number</Label>
                <Input type="text" value={phone} disabled />
              </FormGroup>

              {!otpVerified && (
                <FormGroup>
                  <Label>OTP</Label>
                  <Input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </FormGroup>
              )}

              {otpVerified && (
                <>
                  <FormGroup>
                    <Label>New Password</Label>
                    <InputPasswordToggle
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Confirm Password</Label>
                    <InputPasswordToggle
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </FormGroup>
                </>
              )}

              <Button
                color="link"
                type="button"
                onClick={handleResendOtp}
                disabled={resendLoading}
              >
                {resendLoading ? "Resending..." : "Resend OTP"}
              </Button>

              <Button color="success" block type="submit" disabled={loading}>
                {loading
                  ? otpVerified
                    ? "Resetting..."
                    : "Verifying OTP..."
                  : otpVerified
                    ? "Reset Password"
                    : "Verify OTP"}
              </Button>
            </>
          )}
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default ForgotPassword;

