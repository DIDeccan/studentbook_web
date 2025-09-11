import React from 'react';
import { Container, Card, CardBody, CardHeader, Row, Col } from 'reactstrap';
import ChartComponent from './barchart'; // Assuming you put the chart in its own file
import LegendComponent from './LegendComponent'; // Assuming you put the legend in its own file

// Make sure to register the Chart.js components if you're using it
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const topicsData = [
  { name: 'Engilsh', value: 35, color: '#6A5ACD' },
  { name: 'Maths', value: 20, color: '#00CED1' },
  { name: 'Science', value: 15, color: '#3CB371' },
  { name: 'Social', value: 12, color: '#696969' },
  { name: 'Telugu', value: 10, color: '#FF6347' },
  { name: 'Yoga', value: 9, color: '#81d1dbff' },
   { name: 'Sport', value: 9, color: '#d33c69ff' },
    { name: 'Health', value: 9, color: '#79e2a5ff' },
];

function App() {
  return (
   
      <Card>
        <CardHeader className="h5">Topic you are interested in</CardHeader>
        <CardBody>
          <Row>
            <Col md="6"> {/* This column for the chart */}
              <div style={{ height: '300px' }}> {/* Give the chart a height */}
                <ChartComponent data={topicsData} />
              </div>
            </Col>
            <Col md="6" className="d-flex align-items-center"> {/* This column for the legend */}
              <LegendComponent data={topicsData} />
            </Col>
          </Row>
        </CardBody>
      </Card>
  );
}

export default App;