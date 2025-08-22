import { useState } from 'react'
import toast from 'react-hot-toast'
import api from '@src/apis/api'
import API_ENDPOINTS from '@src/apis/endpoints'

import {
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button
} from 'reactstrap'

const ForgotPassword = ({ isOpen, toggle }) => {
  const [step, setStep] = useState(1)
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (step === 2 && password !== confirmPassword) {
      toast.error("Passwords don't match")
      return
    }

    try {
      if (step === 1) {
        // Step 1: Send only phone number
        await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
          user: phone
        })
        toast.success('OTP sent to your phone!')
        setStep(2)
      } else {
        // Step 2: Send phone + otp + new passwords
        await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
          user: phone,
          otp,
          new_password: password,
          confirm_new_password: confirmPassword
        })
        toast.success('Password reset successfully!')
        toggle()
        setStep(1)
        setPhone('')
        setOtp('')
        setPassword('')
        setConfirmPassword('')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    }
  }

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>Forgot Password</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          {step === 1 ? (
            <>
              <p className="mb-2">
                Enter your phone number and we&apos;ll send you an OTP to reset your password
              </p>
              <FormGroup>
                <Label for="forgot-phone">Phone Number</Label>
                <Input
                  type="text"
                  id="forgot-phone"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </FormGroup>
              <Button color="primary" block type="submit">
                Send OTP
              </Button>
            </>
          ) : (
            <>
              <FormGroup>
                <Label>Phone Number</Label>
                <Input type="text" value={phone} disabled />
              </FormGroup>
              <FormGroup>
                <Label for="otp">OTP</Label>
                <Input
                  type="text"
                  id="otp"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="new-password">New Password</Label>
                <Input
                  type="password"
                  id="new-password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="confirm-password">Confirm Password</Label>
                <Input
                  type="password"
                  id="confirm-password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </FormGroup>
              <Button color="success" block type="submit">
                Reset Password
              </Button>
            </>
          )}
        </Form>
      </ModalBody>
    </Modal>
  )
}

export default ForgotPassword
