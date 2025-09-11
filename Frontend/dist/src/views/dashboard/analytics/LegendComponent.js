import { Row, Col } from 'reactstrap';

const LegendComponent = ({ data }) => (
  <Row>
    {data.map((item, index) => (
      <Col xs="6" key={index} className="mb-3"> {/* Two columns layout */}
        <div className="d-flex align-items-start">
          {/* Circle Icon */}
          <span
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: item.color,
              marginRight: '8px',
              marginTop: '6px',
            }}
          ></span>

          {/* Text Block */}
          <div>
            <p className="mb-0 font-weight-bold text-primary">{item.name}</p>
            <p className="mb-0 font-weight-bold text-dark">{item.value}%</p>
          </div>

        </div>
      </Col>
    ))}
  </Row>
);

export default LegendComponent;
