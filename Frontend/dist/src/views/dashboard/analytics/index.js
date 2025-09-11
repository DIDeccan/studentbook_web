import { Card, Col, Row } from "reactstrap";
import Spent from './spenthours'
import Weekreport from './weekreport'
import Studentprocess from './studentprocess'
import Dailylesrning from './Dailylearningtrends'
import { Fragment } from "react";

const Dashboard = () => {

  return (
    <Fragment>
      <Row className='match-height'>
        <Col sm='12'>
          <Spent />
        </Col>
        {/* <Col sm='4'>
        <Weekreport />
      </Col> */}
      </Row>
      <Row className='match-height'>
        <Col sm='6'>
          <Studentprocess />
        </Col>
         <Col sm='6'>
          <Dailylesrning />
        </Col>
      </Row>
    </Fragment>
  )

}

export default Dashboard