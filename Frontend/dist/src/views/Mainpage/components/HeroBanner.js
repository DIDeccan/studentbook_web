// HeroBanner.js
import React from 'react';
import { Container, Button } from 'reactstrap';
import bannerImage from '@src/assets/images/pages/coming-soon.svg'

const HeroBanner = () => {
  return (
    <Container
      fluid
      className="d-flex flex-column flex-lg-row align-items-center justify-content-between px-5 pb-5 pt-2 hero-content"
      style={{ backgroundColor: '#f6f6ff', borderRadius: '10px' }}
    >
      {/* Left Side Text */}
   <div className="text-start pt-5" style={{ maxWidth: '600px' }}>
  <h1 className="display-4 fw-bold">Online Education</h1>
  <h1 className="display-4 fw-bold text-primary">Learn on your Class Schedule</h1>
  <p className="text-muted mt-3">
    Access your lessons, track progress and complete assignments at your own pace.
  </p>
 <p className="text-muted d-flex gap-3 flex-wrap">
  <span>Quality Teachers</span>
  <span>Get Certificate</span>
  <span>Best Curriculum</span>
</p>

  <div className="mt-4">
    <Button color="primary" className="me-2">
      Ready to Get Started?
    </Button>
    <Button outline color="dark">
      Watch Demo Video
    </Button>
  </div>
  {/* <p className="text-muted mt-3">Trusted by 10,000+ Students Across India</p> */}
</div>


      {/* Right Side Image */}
      <div className="pt-4 pt-lg-0">
        <img
          src={bannerImage}
          alt="Student Learning Banner"
          className="img-fluid"
          style={{ maxHeight: '400px' }}
        />
      </div>
    </Container>
  );
};

export default HeroBanner;
