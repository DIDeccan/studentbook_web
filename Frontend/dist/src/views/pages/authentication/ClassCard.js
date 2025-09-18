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

  const registeredClassId = userData?.class_id ? String(userData.class_id) : null;
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
      class_id: selectedClass?.id,
    };
    dispatch(updateUserData(updatedProfile));
    localStorage.setItem("studentProfileData", JSON.stringify(updatedProfile));
    setIsPaymentOpen(false);
  };

  return (
    <div style={{ padding: "2rem", position: "relative" }}>
      <h4
        style={{
          background: "linear-gradient(90deg, #7db2ddff, #e52e71)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontSize: "2rem",
          letterSpacing: "1px",
          textAlign: "center",
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
        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          spaceBetween={20}
          slidesPerView={"auto"}
        >
          {classData.map((cls) => {
            const isDifferentClass = registeredClassId && !isUserClass && !isPaid && isLoggedIn;

            return (
            <SwiperSlide key={cls.id} style={{ width: "400px" }}>
              <Card
                style={{
                  width: "400px",
                  borderRadius: "15px",
                  boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                }}
              >
                {cls.vedio_url ? (
                  <video
                    controls
                    style={{
                      width: "100%",
                      height: "220px",
                      objectFit: "cover",
                    }}
                  >
                    <source src={cls.vedio_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "220px",
                      background: "linear-gradient(135deg, #a8edea, #fed6e3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: "600",
                      fontSize: "1.2rem",
                      textAlign: "center",
                    }}
                  >
                    No Demo Video
                  </div>
                )}

                <CardBody style={{ padding: "1rem" }}>
                  <CardTitle
                    tag="h5"
                    style={{
                      fontWeight: "700",
                      fontSize: "1.2rem",
                      marginBottom: "0.5rem",
                      textAlign: "center",
                    }}
                  >
                    {cls.name}
                  </CardTitle>
                  <CardText
                    style={{
                      color: "#555",
                      fontSize: "0.95rem",
                      marginBottom: "0.8rem",
                      textAlign: "center",
                    }}
                  >
                    {cls.discription || "Explore engaging lessons with demo content."}
                  </CardText>
                  <CardText
                    className="fw-bold"
                    style={{
                      color: "#1e7e34",
                      fontSize: "1.1rem",
                      marginBottom: "1rem",
                      textAlign: "center",
                    }}
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
                      borderRadius: "30px",
                      fontSize: "0.9rem",
                      padding: "0.6rem 0",
                      background: "linear-gradient(90deg, #4facfe, #00f2fe)",
                      border: "none",
                    }}
                        onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                        onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                      >
                        Subscribe
                      </Button>
                    )}
                </CardBody>
              </Card>
            </SwiperSlide>
            );
})}
        </Swiper>
      )}

      {/* Custom Navigation Arrows */}
      <div className="swiper-button-prev-custom" style={arrowStyle("60px")}>
        <ChevronLeft size={20} color="#333" />
      </div>
      <div className="swiper-button-next-custom" style={arrowStyle(undefined, "60px")}>
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
  width: "35px",
  height: "35px",
  borderRadius: "50%",
  background: "#fff",
  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  zIndex: 10,
});

export default Classcard;
 