import React from "react";
import { useActivity } from "../context/activityContext";
import "./styles/ActivityPage.css"; // Optional for styling

const ActivityPage = () => {
  const { activities } = useActivity();

  return (
    <div className="activity-page">
      <h2>Activity Log</h2>
      {activities.length === 0 ? (
        <p>No activity yet.</p>
      ) : (
        <ul>
          {activities.map((activity) => (
            <li key={activity.id}>
              <div>{activity.text}</div>
              <small>{activity.timestamp}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivityPage;
