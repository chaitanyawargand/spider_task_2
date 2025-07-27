import React, { createContext, useState, useContext } from "react";

const ActivityContext = createContext();

export const ActivityProvider = ({ children }) => {
  const [activities, setActivities] = useState([]);
  const addActivity = (text) => {
    const newActivity = {
      id: Date.now(),
      text,
      timestamp: new Date().toLocaleString(),
    };
    setActivities((prev) => [newActivity, ...prev]);
  };

  return (
    <ActivityContext.Provider value={{ activities, addActivity }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => useContext(ActivityContext);
