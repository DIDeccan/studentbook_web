import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
  Spinner,
} from "reactstrap";
import Register from "./Register";
import PaymentModal from "./PaymentModal";
import { fetchClasses } from "../../../redux/classSlice";

const Classcard = () => {
  const dispatch = useDispatch();

  const { data: classData, loading, error } = useSelector(
    (state) => state.classes
  );

  const [columns, setColumns] = useState(5);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [authData, setAuthData] = useState(null);

  const toggleRegister = () => setIsRegisterOpen(!isRegisterOpen);
  const togglePayment = () => setIsPaymentOpen(!isPaymentOpen);

  useEffect(() => {
    const storedAuth = localStorage.getItem("authData");
    if (storedAuth) setAuthData(JSON.parse(storedAuth));
  }, []);

  const registeredClassId =
    authData?.registrationData?.classLevel || authData?.user?.student_class;

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 480) setColumns(1);
      else if (width < 768) setColumns(2);
      else if (width < 992) setColumns(3);
      else if (width < 1200) setColumns(4);
      else setColumns(5);
    };
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  const handleSubscribe = (cls) => {
    setSelectedClass(cls);
    const token = authData?.accessToken;
    if (token) setIsPaymentOpen(true);
    else setIsRegisterOpen(true);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h4
        className="display-4 text-primary"
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
            const isDifferentClass =
              registeredClassId && registeredClassId !== cls.id;

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
        </div>
      )}

      {/* Signup Modal */}
      <Register
        isOpen={isRegisterOpen}
        toggle={toggleRegister}
        openPayment={() => {
          setIsRegisterOpen(false);
          setIsPaymentOpen(true);
        }}
        selectedClass={selectedClass}
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        toggle={togglePayment}
        classInfo={selectedClass}
      />
    </div>
  );
};

export default Classcard;
