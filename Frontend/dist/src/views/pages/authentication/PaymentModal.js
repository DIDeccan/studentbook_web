import { useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalHeader, ModalBody, Button } from "reactstrap";
import { createOrder } from "../../../redux/authentication";
import api from "@src/apis/api";
import API_ENDPOINTS from "@src/apis/endpoints";
import { AbilityContext } from '@src/utility/context/Can';
import { useNavigate } from "react-router-dom";  
import { getHomeRouteForLoggedInUser } from "@utils"; 
import { toast } from "react-toastify"; 

const PaymentModal = ({ isOpen, toggle }) => {
  const ability = useContext(AbilityContext)
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const { orderData, accessToken, registrationData, userData } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isOpen && !orderData) {
      dispatch(createOrder());
    }
  }, [isOpen]);

 const openRazorpay = (orderData) => {
  if (!orderData) return;

  const token = accessToken || localStorage.getItem("accessToken")?.replace(/^"|"$/g, "");
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
        console.log("Payment verification payload:", response); 
      try {
        console.log("Payment verification payload:", {
          order_id: response.razorpay_order_id,
          payment_id: response.razorpay_payment_id,
          signature: response.razorpay_signature,
        });

        const verifyRes = await api.post(
          API_ENDPOINTS.PAYMENT.VERIFY,
          {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("Payment verification response:", verifyRes.data);
        toast.success("Payment successful");
         ability.update([{ action: 'manage', subject: 'all' }]);
        toggle(); 
        const role = userData?.role || registrationData?.role || "student";
    navigate(getHomeRouteForLoggedInUser(role));
      } catch (err) {
        console.error("Payment verification error:", err.response?.data || err.message);
        toast.error("Payment verification failed. Please try again.");
      }
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};


  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>Complete Your Payment</ModalHeader>
      <ModalBody className="text-center">
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
