import React from 'react';
import { useSelector } from 'react-redux';

const TabDetail = ({ match }) => {
  const { tabs } = useSelector((state) => state.rootReducer);
  const tab = tabs.find((tab) => tab._id === match.params.id); 

  if (!tab) return <p>Tab not found</p>;

  return (
    <div>
      <h1>Tab Detail</h1>
      {}
    </div>
  );
};

export default TabDetail;
