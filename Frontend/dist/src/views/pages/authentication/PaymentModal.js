import { useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalHeader, ModalBody, Button } from "reactstrap";
import { createOrder, updateUserData } from "../../../redux/authentication";
import api from "@src/apis/api";
import API_ENDPOINTS from "@src/apis/endpoints";
import { AbilityContext } from '@src/utility/context/Can';
import { useNavigate } from "react-router-dom";
import { getHomeRouteForLoggedInUser } from "@utils";
import { toast } from "react-toastify";

const PaymentModal = ({ isOpen, toggle, classInfo }) => {
  const ability = useContext(AbilityContext)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderData, accessToken, registrationData, userData } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isOpen && !orderData) {
      dispatch(createOrder());
    }
  }, [isOpen, orderData, dispatch]);

  const openRazorpay = (orderData) => {
    if (!orderData) return;

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
          // const existingUser = JSON.parse(localStorage.getItem("userData")) || userData || {};

          // const updatedUser = {
          //   ...existingUser,
          //   student_id: verifyData.student_id,
          //   student_package_id: verifyData.student_package_id,
          //   student_class: verifyData.course_id,
          // };
          // localStorage.setItem("userData", JSON.stringify(updatedUser));
          // dispatch(updateUserData(updatedUser));
   dispatch(
            updateUserData({
              is_paid: true,
              student_id: verifyData.student_id,
              student_package_id: verifyData.student_package_id,
              // Keep both for compatibility with createOrder and anywhere else:
              student_class: verifyData.course_id,
              course_id: verifyData.course_id,
            })
          );
          toast.success("Payment successful!");
          ability.update([{ action: "manage", subject: "all" }]);
          toggle();
          // Navigate user based on role
          // const role = verifyRes.data?.data?.user?.role || "student";
          // navigate(getHomeRouteForLoggedInUser(role));
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
        {orderData ? (
          <Button color="success" onClick={() => openRazorpay(orderData)}>
            Pay Now
          </Button>
        ) : (
          <p>Loading order...</p>
        )}
      </ModalBody>
    </Modal>
  );
};

export default PaymentModal;
