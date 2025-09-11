import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody, CardTitle, CardText, Button, Spinner } from "reactstrap";
import Register from "./Register";
import PaymentModal from "./PaymentModal";
import { updateUserData } from "../../../redux/authentication";
import { fetchClasses } from "../../../redux/classSlice";
import { ChevronLeft, ChevronRight } from "react-feather";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";

const Classcard = () => {
  const dispatch = useDispatch();
  const { data: classData, loading, error } = useSelector((state) => state.classes);
  const { userData, accessToken } = useSelector((state) => state.auth);

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {

    if (!userData) {
      const storedProfile = localStorage.getItem("studentProfileData");
      if (storedProfile) {
        dispatch(updateUserData(JSON.parse(storedProfile)));
      }
    }
  }, [dispatch, userData]);

  const registeredClassId = userData?.student_class ? String(userData.student_class) : null;
  const isPaid = userData?.is_paid || false;


  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  const handleSubscribe = (cls) => {
    setSelectedClass(cls);

    if (accessToken) {
      setIsPaymentOpen(true);
    } else {
      setIsRegisterOpen(true);
    }

  };

  const handlePaymentSuccess = () => {
    const updatedProfile = {
      ...userData,
      is_paid: true,
      student_class: selectedClass?.id,
    };

    dispatch(updateUserData(updatedProfile));
    localStorage.setItem("studentProfileData", JSON.stringify(updatedProfile));

    setIsPaymentOpen(false);
  };

  return (

    <div style={{ padding: "2rem" }}>

      <h4
        style={{

              background: "linear-gradient(90deg, #7db2ddff, #e52e71)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: '3rem', 
              letterSpacing: '2px',
              textAlign: "center"
            }}
      >
        Student Access
      </h4>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: "5rem" }}>
          <Spinner color="primary" />
        </div>
      ) : error ? (
        <div style={{ textAlign: "center", color: "red" }}>
          Error loading classes: {error}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: "1.5rem",
            padding: "1rem",
          }}
        >
          {classData.map((cls) => {
            const classId = String(cls.id);
            const isUserClass = registeredClassId === classId;
            const isLoggedIn = !!accessToken;

            let buttonContent;

            if (isUserClass && isPaid) {
              buttonContent = (
                <Button color="success" block disabled>
                  Subscribed
                </Button>
              );

            } else if (isUserClass && !isPaid) {
              if (isLoggedIn) {
                buttonContent = (
                  <Button
                    block
                    color=""
                    style={{ backgroundColor: "#a435f0", color: "white" }}
                    onClick={() => handleSubscribe(cls)}
                  >
                    Subscribe
                  </Button>
                );
              } else {
                buttonContent = (
                  <Button color="secondary" block disabled>
                    Done Subscription
                  </Button>
                );
              }

            } else if (registeredClassId && !isUserClass && !isPaid && isLoggedIn) {
              buttonContent = (
                <Button color="secondary" block disabled>
                  Not Available
                </Button>
              );

            } else {
              buttonContent = (
                <Button
                  block
                  color=""
                  style={{ backgroundColor: "#a435f0", color: "white" }}
                  onClick={() => handleSubscribe(cls)}
                >
                  Subscribe
                </Button>
              );
            }

            return (

              <Card
                key={cls.id}
                style={{
                  width: "100%",
                  borderRadius: "20px",
                  boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                  transition: "transform 0.3s, box-shadow 0.3s",
                }}
                className="class-card"
              >
                {cls.vedio_url ? (
                  <video
                    controls
                    style={{ width: "100%", height: "220px", borderRadius: "20px 20px 0 0", objectFit: "cover" }}
                  >
                    <source src={cls.vedio_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div
                    style={{
                      height: "220px",
                      background: "linear-gradient(135deg, #a8edea, #fed6e3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: "600",
                      fontSize: "1.2rem",
                    }}
                  >
                    No Demo Video
                  </div>
                )}

                <CardBody style={{ padding: "1.5rem" }}>
                  <CardTitle
                    tag="h5"
                    style={{ fontWeight: "700", fontSize: "1.3rem", marginBottom: "0.5rem" }}
                  >
                    {cls.name}
                  </CardTitle>
                  <CardText style={{ color: "#555", marginBottom: "1rem" }}>
                    {cls.discription || "Explore engaging lessons with demo content."}
                  </CardText>
                  <CardText
                    className="fw-bold"
                    style={{ color: "#1e7e34", fontSize: "1.1rem", marginBottom: "1rem" }}
                  >
                    ₹{cls.cost}
                  </CardText>

                  {isDifferentClass ? (
                    <Button
                      color="secondary"
                      block
                      disabled
                      style={{
                        borderRadius: "50px",
                        padding: "0.6rem 0",
                        fontWeight: "600",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Not Available
                    </Button>
                  ) : (
                    <Button
                      color="primary"
                      block
                      onClick={() => handleSubscribe(cls)}
                      style={{
                        borderRadius: "50px",
                        padding: "0.6rem 0",
                        fontWeight: "600",
                        letterSpacing: "0.5px",
                        background: "linear-gradient(90deg, #4facfe, #00f2fe)",
                        border: "none",
                        transition: "transform 0.2s",
                      }}
                      onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                      onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                    >
                      Subscribe
                    </Button>
                  )}
                </CardBody>
              </Card>
            );
          })}
        </Swiper>
      )}

      <div className="swiper-button-prev-custom" style={arrowStyle("75px")}>
        <ChevronLeft size={20} color="#333" />
      </div>
      <div className="swiper-button-next-custom" style={arrowStyle(undefined, "100px")}>
        <ChevronRight size={20} color="#333" />
      </div>

      <Register
        isOpen={isRegisterOpen}
        toggle={() => setIsRegisterOpen(!isRegisterOpen)}
        openPayment={() => {
          setIsRegisterOpen(false);
          setIsPaymentOpen(true);
        }}
        selectedClass={selectedClass}
      />

      <PaymentModal
        isOpen={isPaymentOpen}
        toggle={() => setIsPaymentOpen(!isPaymentOpen)}
        classInfo={selectedClass}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

const arrowStyle = (left, right) => ({
  position: "absolute",
  top: "50%",
  left,
  right,
  transform: "translateY(-50%)",
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  background: "#fff",
  boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  zIndex: 10,
});

export default Classcard;
