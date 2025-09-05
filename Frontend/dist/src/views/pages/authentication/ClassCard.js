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
    <div style={{ padding: "0 100px", position: "relative" }}>
      <h4
        style={{
          textAlign: "center",
          fontSize: "2.5rem",
          marginBottom: "24px",
          fontWeight: "700",
          color: "#1c1d1f",
        }}
      >
        Student Access
      </h4>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
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
          slidesPerView={4}
          breakpoints={{
            1200: { slidesPerView: 4 },
            992: { slidesPerView: 3 },
            768: { slidesPerView: 2 },
            480: { slidesPerView: 1 },
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
              <SwiperSlide key={cls.id}>
                <Card
                  style={{
                    maxWidth: "290px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    overflow: "hidden",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {cls.vedio_url ? (
                    <video
                      controls
                      style={{
                        width: "100%",
                        height: "160px",
                        objectFit: "cover",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <source src={cls.vedio_url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div
                      style={{
                        height: "160px",
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                      }}
                    >
                      No Demo Video
                    </div>
                  )}

                  <CardBody
                    style={{
                      padding: "16px",
                      flex: "1",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <CardTitle
                        tag="h5"
                        style={{
                          fontWeight: "600",
                          fontSize: "1rem",
                          marginBottom: "8px",
                          color: "#1c1d1f",
                          minHeight: "30px",
                        }}
                      >
                        {cls.name}
                      </CardTitle>

                      <CardText
                        style={{
                          fontSize: "0.9rem",
                          color: "#555",
                          minHeight: "40px",
                        }}
                      >
                        {cls.discription?.length > 70
                          ? cls.discription.slice(0, 70) + "..."
                          : cls.discription ||
                          "Explore engaging lessons with demo content."}
                      </CardText>
                    </div>

                    <div>
                      <CardText
                        style={{
                          fontWeight: "700",
                          color: "#1c1d1f",
                          fontSize: "1rem",
                          margin: "12px 0",
                        }}
                      >
                        ₹{cls.cost}
                      </CardText>
                      {buttonContent}
                    </div>
                  </CardBody>
                </Card>
              </SwiperSlide>
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
