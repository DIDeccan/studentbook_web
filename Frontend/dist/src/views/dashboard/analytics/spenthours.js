import React from "react";
import { Clock, Activity, BookOpen, Calendar, TrendingUp, TrendingDown } from "react-feather";
import Avatar from "@components/avatar"; // Assuming Avatar component handles user image

// Reusable Stat Item
const StatItem = ({ icon, color, label, value, unit = "" }) => (
  <div className="d-flex align-items-center gap-2">
    <Avatar color={`light-${color}`} icon={icon} />
    <div>
      {/* Label is now bold */}
      <p className="mb-0 fw-bold">{label}</p>
      <h6 className={`mb-0 text-${color}`}>
        {value}
        {unit}
      </h6>
    </div>
  </div>
);

const DashboardStats = () => {
  const userData = {
    name: "Sai",
    hoursSpent: 34,
    testResults: 82,
    coursesCompleted: 14,
    totalTime: "231h 14m",
    progress: 72,
    weeklyHours: 12,
    activeHours: 18,
    avatarUrl: "/path/to/felecia-avatar.jpg", // Placeholder
  };

  return (
    <div className="dashboard-container p-4">
      {/* Welcome Section */}
      <div className="welcome-section mb-4 d-flex align-items-center gap-3">
        <div>
          <h2 className="display-6 fw-bold mb-0">
            Welcome, {userData.name} 👋🏻
          </h2>
          <p className="text-muted lead-sm">
            Keep up the great work on your learning journey!
          </p>
        </div>
      </div>

      {/* Stats in horizontal row */}
      <div className="stats-grid d-flex flex-wrap gap-5 justify-content-start">
        <StatItem
          icon={<Clock size={25} />}
          color="primary"
          label="Total Hours Spent"
          value={userData.hoursSpent}
          unit="h"
        />
        <StatItem
          icon={<Activity size={25} />}
          color="info"
          label="Test Results"
          value={userData.testResults}
          unit="%"
        />
        <StatItem
          icon={<BookOpen size={25} />}
          color="warning"
          label="Videos Completed"
          value={userData.coursesCompleted}
        />
        <StatItem
          icon={<Calendar size={25} />}
          color="success"
          label="Weekly Hours"
          value={userData.weeklyHours}
          unit="h"
        />
        <StatItem
          icon={<TrendingUp size={25} />}
          color="info"
          label="Attend Assignments"
          value={userData.activeHours}
          unit="h"
        />
          <StatItem
          icon={<TrendingDown size={25} />}
          color="danger"
          label="Pending Assignments"
          value={userData.activeHours}
          unit="h"
        />
      </div>
    </div>
  );
};

export default DashboardStats;
