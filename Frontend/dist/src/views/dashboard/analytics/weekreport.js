import React from "react";
import { Card } from "reactstrap";
import { PieChart, Pie, Cell } from "recharts";

const Weekreport = () => {
  const user = {
    totalTime: "231h 14m",
    weeklyChange: 18.4,
    progress: 23,
  };

  const data = [
    { name: "Completed", value: user.progress },
    { name: "Remaining", value: 100 - user.progress },
  ];
  const COLORS = ["#22c55e", "#e9ecef"];

  return (
    <Card className="p-4 d-flex flex-column align-items-center shadow-sm rounded-4">
      <div className="text-center mb-3">
        <p className="text-muted small mb-0">Time Spendings</p>
        <p className="text-secondary small mb-1">Weekly report</p>
        <h6 className="fw-semibold mb-0">{user.totalTime}</h6>
        <p className="text-success small fw-medium mb-0">
          +{user.weeklyChange}%
        </p>
      </div>

      {/* Chart */}
      <div
        className="position-relative"
        style={{ width: "120px", height: "120px" }}
      >
        <PieChart width={120} height={120}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={55}
            startAngle={90}
            endAngle={-270}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
        <div className="position-absolute top-50 start-50 translate-middle text-center">
          <p className="fw-bold mb-0">{user.progress}%</p>
          <p className="text-muted small mb-0">36h</p>
        </div>
      </div>
    </Card>
  );
};

export default Weekreport;
