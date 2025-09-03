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

const LoginBasic = ({ isOpen, toggle, openRegister }) => {
  const ability = useContext(AbilityContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const { control, handleSubmit, formState: { errors }, setError } = useForm({
    defaultValues: { username: "", password: "" }
  });

  const onSubmit = async (data) => {
    try {
      toast.loading("Logging in...");
      const resultAction = await dispatch(loginUser({
        phone_number: data.username,
        password: data.password
      }));
      toast.dismiss();

      if (loginUser.fulfilled.match(resultAction)) {
        const user = resultAction.payload;


        dispatch(updateUserData(user));
        localStorage.setItem("authData", JSON.stringify(user));

        ability.update([{ action: 'manage', subject: 'all' }]);
        toast.success("Login successful!");

        toggle();

        const role = user.user_type || "student";
        navigate(getHomeRouteForLoggedInUser(role));

      } else {
        const message = resultAction.payload?.message || "Login failed";

  if (message?.toLowerCase().includes("password")) {
    setError("password", { type: "manual", message });
  } else {
    setError("username", { type: "manual", message });
  }
   toast.error(message);
}
    } catch (err) {
      toast.dismiss();
      toast.error("Something went wrong");
    }
  };

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
                <InputPasswordToggle id="password" className="input-group-merge" placeholder="Enter password" invalid={!!errors.password} {...field} />
              )}
            />
            {errors.password && <FormFeedback>{errors.password.message}</FormFeedback>}
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <Input type="checkbox" id="rememberMe" className="form-check-input" />
              <Label className="form-check-label" for="rememberMe">Remember me</Label>
            </div>
            <a href="#" className="text-primary small" onClick={(e) => { e.preventDefault(); toggle(); /* open forgot password modal */ }}>Forgot password?</a>
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
