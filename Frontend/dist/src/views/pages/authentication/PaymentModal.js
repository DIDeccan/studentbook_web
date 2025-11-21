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
