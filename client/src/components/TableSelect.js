import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTableNoInTab } from '../redux/store'; 

const TableSelect = () => {
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);


  const dispatch = useDispatch();
  const tables = useSelector(state => state.rootReducer.tables);
  const selectedTable = useSelector(state => state.rootReducer.selectedTable);



  console.log('Selected Table:', useSelector((state) => state.rootReducer.selectedTable));


  // Get the current tab ID from your Redux store
  const currentTabId = useSelector(state => state.rootReducer.selectedTable?.tabId);

  const handleTableSelect = async (table) => {
    setLoading(true);
    setError(null); // Resetting any previous error

    dispatch({ type: 'SELECT_TABLE', payload: table });

    try {
      const response = await updateTableNoInTab(currentTabId, table.id);
      console.log('Selected Table:', selectedTable);
      
      console.log(response); 
    } catch (error) {
      console.error('Error updating table number:', error);
      setError('Failed to update the table number. Please try again later.'); 
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div>
      <select value={selectedTable?._id || ''} onChange={(e) => handleTableSelect(tables.find(table => table._id === e.target.value))}>
    <option value="" disabled>Select a table</option>
    {tables.map(table => (
        <option key={table._id} value={table._id}>{table.tableNumber}</option>
    ))}
</select>

    </div>
  );
};

export default TableSelect;
