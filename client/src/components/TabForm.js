import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTab } from '../redux/store.js'; 


const TabForm = () => {
  const dispatch = useDispatch();
  const [tabData, setTabData] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addTab(tabData));
  };

  return (
    <form onSubmit={handleSubmit}>
    
      <button type="submit">Create Tab</button>
    </form>
  );
};

export default TabForm;
