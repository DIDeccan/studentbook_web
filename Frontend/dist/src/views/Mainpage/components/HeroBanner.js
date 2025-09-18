// // HeroBanner.js
// import React from "react";
// import { Container, Button } from "reactstrap";
// import { useSkin } from "@hooks/useSkin";
// import bannerImage from "@src/assets/images/pages/coming-soon.svg";

// const HeroBanner = () => {
//   const { skin } = useSkin();
//   return (
//     <Container
//       fluid
//       className="d-flex flex-column flex-lg-row align-items-center justify-content-between px-5 py-5 hero-content"
//       style={{
//         background: "linear-gradient(135deg, #eef2ff, #f8faff)",
//         borderRadius: "20px",
//         boxShadow: "0px 8px 20px rgba(0,0,0,0.05)",
//       }}
//     >
//       {/* Left Side Text */}
//       <div className="text-start" style={{ maxWidth: "600px" }}>
//         <h1 className="display-4 fw-bold text-dark">
//           <span style={{ color: "#0d6efd" }}>Transform</span> Your Learning
//         </h1>
//         <h2 className="fw-semibold mt-2 text-primary">
//           Study Anytime, Anywhere 🚀
//         </h2>

//         <p className="bold mt-3 fs-5">
//           Access lessons, track progress, and achieve your academic goals with
//           expert educators and structured courses.
//         </p>

//         <div className="d-flex flex-wrap gap-4 mt-4">
//           <div
//             style={{
//               background: "#ffffff",
//               borderRadius: "12px",
//               padding: "12px 20px",
//               boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
//               textAlign: "center",
//               flex: "1 1 150px",
//             }}
//           >
//             <h5 className="mb-1 text-primary">⭐</h5>
//             <p className="mb-0 fw-semibold">Quality Teachers</p>
//           </div>

//           <div
//             style={{
//               background: "#ffffff",
//               borderRadius: "12px",
//               padding: "12px 20px",
//               boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
//               textAlign: "center",
//               flex: "1 1 150px",
//             }}
//           >
//             <h5 className="mb-1 text-success">🎓</h5>
//             <p className="mb-0 fw-semibold">Get Certificate</p>
//           </div>

//           <div
//             style={{
//               background: "#ffffff",
//               borderRadius: "12px",
//               padding: "12px 20px",
//               boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
//               textAlign: "center",
//               flex: "1 1 150px",
//             }}
//           >
//             <h5 className="mb-1 text-warning">📘</h5>
//             <p className="mb-0 fw-semibold">Best Curriculum</p>
//           </div>
//         </div>


//         <div className="mt-4 d-flex gap-3">
//           <Button color="primary" size="lg" className="shadow-sm rounded-pill">
//             Get Started
//           </Button>
//           <Button
//             outline
//             color="dark"
//             size="lg"
//             className="rounded-pill border-2"
//           >
//             ▶ Watch Demo
//           </Button>
//         </div>
//       </div>

//       {/* Right Side Image */}
//       <div className="pt-4 pt-lg-0 text-center">
//         <img
//           src={bannerImage}
//           alt="Student Learning Banner"
//           className="img-fluid"
//           style={{
//             maxHeight: "420px",
//             borderRadius: "15px",
//             boxShadow: "0px 6px 15px rgba(0,0,0,0.08)",
//           }}
//         />
//       </div>
//     </Container>
//   );
// };

// export default HeroBanner;

// HeroBanner.js
import React from "react";
import { Container, Button } from "reactstrap";
import { useSkin } from "@hooks/useSkin";
import bannerImage from "@src/assets/images/pages/coming-soon.svg";
import classnames from "classnames";
import '../../../@core/scss/base/pages/hero-banner.scss'

const HeroBanner = () => {
  const { skin } = useSkin(); 

  return (
    <Container
      fluid
      className={classnames(
        "d-flex flex-column flex-lg-row align-items-center justify-content-between px-5 py-5 hero-content",
        { "dark-layout": skin === "dark" } 
      )}
    >
      {/* Left Side Text */}
      <div className="text-start hero-text">
        <h1 className="display-4 fw-bold">
          <span className="highlight">Transform</span> Your Learning
        </h1>
        <h2 className="fw-semibold mt-2 sub-heading">
          Study Anytime, Anywhere 🚀
        </h2>

        <p className="bold mt-3 fs-5 description">
          Access lessons, track progress, and achieve your academic goals with
          expert educators and structured courses.
        </p>

        <div className="d-flex flex-wrap gap-4 mt-4 features">
          <div className="feature-box text-center">
            <h5 className="mb-1">⭐</h5>
            <p className="mb-0 fw-semibold">Quality Teachers</p>
          </div>

          <div className="feature-box text-center">
            <h5 className="mb-1">🎓</h5>
            <p className="mb-0 fw-semibold">Get Certificate</p>
          </div>

          <div className="feature-box text-center">
            <h5 className="mb-1">📘</h5>
            <p className="mb-0 fw-semibold">Best Curriculum</p>
          </div>
        </div>

        <div className="mt-4 d-flex gap-3">
          <Button color="primary" size="lg" className="shadow-sm rounded-pill">
            Get Started
          </Button>
          <Button outline color="dark" size="lg" className="rounded-pill border-2">
            ▶ Watch Demo
          </Button>
        </div>
      </div>

      {/* Right Side Image */}
      <div className="pt-4 pt-lg-0 text-center hero-image">
        <img
          src={bannerImage}
          alt="Student Learning Banner"
          className="img-fluid"
        />
      </div>
    </Container>
  );
};

export default HeroBanner;
