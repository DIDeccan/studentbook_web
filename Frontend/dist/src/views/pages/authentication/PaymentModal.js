import { useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalHeader, ModalBody, Button, Spinner } from "reactstrap";
import { createOrder, updateUserData } from "../../../redux/authentication";
import api from "@src/apis/api";
import API_ENDPOINTS from "@src/apis/endpoints";
import { AbilityContext } from '@src/utility/context/Can';
import { useNavigate } from "react-router-dom";
import { getHomeRouteForLoggedInUser } from "@utils";
import toast from 'react-hot-toast';

const PaymentModal = ({ isOpen, toggle, classInfo, onSuccess }) => {
  const ability = useContext(AbilityContext)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderData, accessToken, registrationData, userData, loading, error } = useSelector((state) => state.auth);


  useEffect(() => {
    if (isOpen) {
      const token =
        accessToken ||
        JSON.parse(localStorage.getItem("authData"))?.accessToken;

      if (!token) {
        console.warn("No token found, not creating order yet");
        return;
      }
      dispatch(createOrder());
    }
  }, [isOpen, accessToken, dispatch]);
  
  const openRazorpay = (orderData) => {
    if (!orderData) return;
console.log("Selected class:", classInfo);
    const token =
      accessToken ||
      (JSON.parse(localStorage.getItem("authData"))?.accessToken ?? null);

    if (!token) {
      toast.error("Access token missing. Please complete OTP verification first.");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData?.amount,
      currency: orderData?.currency,
      order_id: orderData?.id,
      name: "StudentBook",
      description: "Course Enrollment",
      prefill: {
        name: `${registrationData?.first_name || ""} ${registrationData?.last_name || ""}`,
        email: registrationData?.email || "",
        contact: registrationData?.phone_number || "",
      },
      theme: { color: "#6366f1" },
      handler: async (response) => {
        try {
          const verifyRes = await api.post(
            API_ENDPOINTS.PAYMENT.VERIFY,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );




          const verifyData = verifyRes.data?.data;
          if (!verifyData) throw new Error("Payment verification returned no data");

          dispatch(
            updateUserData({
              is_paid: true,
              student_id: verifyData.student_id,
              student_package_id: verifyData.student_package_id,
              // student_class: verifyData.course_id,
              class_id: verifyData.class_id,
            })
          );

          if (typeof onSuccess === "function") {
            onSuccess();
          }

          toast.success("Payment successful!");
          ability.update([{ action: "manage", subject: "all" }]);
          toggle();

          const role = verifyData?.user_type || userData?.user_type || registrationData?.user_type || "student";
          navigate(getHomeRouteForLoggedInUser(role));
        } catch (err) {
          toast.error("Payment verification failed. Please try again.");
          dispatch(createOrder());
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", () => {
      toast.error("Payment failed. Please try again.");
      dispatch(createOrder());
    });
    rzp.open();
  };


  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>Complete Your Payment</ModalHeader>
      <ModalBody className="text-center">

        {classInfo && (
          <div style={{ marginBottom: "16px" }}>
            <h5>{classInfo.name}</h5>
            <p className="text-success fw-bold">₹{classInfo.cost}</p>
          </div>
        )}

        {loading && <Spinner color="primary" />}
        {error && (
          <div>
            <p className="text-danger">
              {typeof error === "string"
                ? error
                : error?.message || "Something went wrong. Please try again."}
            </p>
            <Button color="warning" onClick={() => dispatch(createOrder())}>
              Retry
            </Button>
          </div>
        )}
        {!loading && !error && orderData && (
          <Button color="success" onClick={() => openRazorpay(orderData)}>
            Pay Now
          </Button>
        )}

        {!loading && !error && !orderData && <p>Preparing your order...</p>}
      </ModalBody>
    </Modal>
  );
};

export default PaymentModal;
