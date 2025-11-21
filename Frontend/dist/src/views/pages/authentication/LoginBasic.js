import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState, useContext } from "react";
import { AbilityContext } from '@src/utility/context/Can';
import { useForm, Controller } from "react-hook-form";
import InputPasswordToggle from "@components/input-password-toggle";
import { loginUser, updateUserData } from "@store/authentication";
import { getHomeRouteForLoggedInUser } from '@utils';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, Input, Form, FormFeedback } from "reactstrap";

const LoginBasic = ({ isOpen, toggle, openRegister, openForgotPassword }) => {
  const ability = useContext(AbilityContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const { control, handleSubmit, formState: { errors }, setError } = useForm({
    defaultValues: { username: "", password: "" }
  });



  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>Login</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-2">
            <Label for="username">Phone Number</Label>
            <Controller
              name="username"
              control={control}
              rules={{ required: "Phone number is required" }}
              render={({ field }) => (
                <Input id="username" type="text" placeholder="Enter phone number" invalid={!!errors.username} {...field} />
              )}
            />
            {errors.username && <FormFeedback>{errors.username.message}</FormFeedback>}
          </div>

          <div className="mb-2">
            <Label for="password">Password</Label>
            <Controller
              name="password"
              control={control}
              rules={{ required: "Password is required" }}
              render={({ field }) => (
                <InputPasswordToggle id="password" placeholder="Enter password" invalid={!!errors.password} {...field} />
              )}
            />
            {errors.password && <FormFeedback>{errors.password.message}</FormFeedback>}
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <Input type="checkbox" id="rememberMe" className="form-check-input" />
              <Label className="form-check-label" for="rememberMe">Remember me</Label>
            </div>
            <a
              href="#"
              className="text-primary small"
              onClick={(e) => {
                e.preventDefault();
                console.log("Forgot Password clicked");
                openForgotPassword();
              }}
            >
              Forgot password?
            </a>

          </div>

          <Button color="primary" block type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </Form>
      </ModalBody>
      <ModalFooter>
        <span className="me-auto">
          Don’t have an account?{" "}
          <a href="#" onClick={(e) => { e.preventDefault(); toggle(); openRegister(); }}>Sign Up</a>
        </span>
      </ModalFooter>
    </Modal>
  );
};

export default LoginBasic;
