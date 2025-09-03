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
import { fetchClasses } from "../../../redux/classSlice" // import your slice

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
    if (storedAuth) {
      setAuthData(JSON.parse(storedAuth));
    }
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
    if (token) {
      setIsPaymentOpen(true);
    } else {
      setIsRegisterOpen(true);
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <h4
        className="display-4 text-primary"
        style={{
          textAlign: "center",
          fontSize: "2.5rem",
          marginBottom: "24px",
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: "24px",
            padding: "24px",
          }}
        >
          {classData.map((cls) => {
            const isDifferentClass =
              registeredClassId && registeredClassId !== cls.id;

            return (
              <Card key={cls.id} style={{ width: "100%" }}>
                {cls.vedio_url ? (
                  <video controls style={{ width: "100%", borderRadius: "4px" }}>
                    <source src={cls.vedio_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div
                    style={{
                      height: "200px",
                      backgroundColor: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#888",
                    }}
                  >
                    No Demo Video
                  </div>
                )}

                <CardBody>
                  <CardTitle tag="h4">{cls.name}</CardTitle>
                  <CardText>
                    {cls.discription ||
                      "Explore engaging lessons with demo content."}
                  </CardText>
                  <CardText className="text-success fw-bold">₹{cls.cost}</CardText>

                  {isDifferentClass ? (
                    <Button color="secondary" block disabled>
                      Not Available
                    </Button>
                  ) : (
                    <Button
                      color="primary"
                      block
                      onClick={() => handleSubscribe(cls)}
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
