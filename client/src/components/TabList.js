import { useEffect, useState } from 'react';
import { Table } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { loadTabs, removeTab } from '../redux/store.js'; 
import DefaultTemplate from '../components/DefaultTemplate';
import { DeleteOutlined, EuroOutlined } from '@ant-design/icons';
import CloseTabOverlay from '../components/CloseTab.js'; 
import { Button } from 'antd';  
import { useNavigate } from 'react-router-dom'; 

const TabList = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isCloseTabOverlayVisible, setIsCloseTabOverlayVisible] = useState(false);
  const [currentTab, setCurrentTab] = useState(null);

  const tabs = useSelector(state => {
    console.log("Redux State: ", state);
    return state.rootReducer.tabs.tabs;
  });

  const handleOpenCloseTabOverlay = (tab) => {
    setCurrentTab(tab);
    setIsCloseTabOverlayVisible(true);
  };

  const handleCloseCloseTabOverlay = () => {
    setCurrentTab(null);
    setIsCloseTabOverlayVisible(false);
  };

  

  // const handleUpdate = async (tabId, newTabData) => {
  //   try {
  //     await dispatch(updateTab(tabId, newTabData));
  //     // Optionally, you can add a notification here to inform the user of the successful update.
  //   } catch (error) {
  //     console.error('Failed to update tab:', error);
  //     // Optionally, you can add a notification here to inform the user of the error.
  //   }
  // };
  

  const handleRemove = async (tabId) => {
    try {
      await dispatch(removeTab(tabId));
      // Optionally, you can add a notification here to inform the user of the successful removal.
    } catch (error) {
      console.error('Failed to remove tab:', error);
      // Optionally, you can add a notification here to inform the user of the error.
    }
  };
  

  useEffect(() => {
    async function fetchTabs() {
      setLoading(true);
      try {
        await dispatch(loadTabs());
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchTabs();
  }, [dispatch]);

  const expandedRowRender = (record) => {
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Price €', dataIndex: 'price', key: 'price', render: text => `${text} €` },
      { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
      
    ];

    return <Table columns={columns} dataSource={record.items} rowKey="name" pagination={false} />;
  };



  const columns = [
    { title: 'Date Created', dataIndex: 'dateCreated', key: 'dateCreated', render: text => new Date(text).toLocaleString() },
    { title: 'Table No', dataIndex: 'tableNo', key: 'tableNo' },  
    { title: 'Total of Tab €', dataIndex: 'totalAmountDue', key: 'totalAmountDue', render: text => `${text} €` },
    { 
      title: 'Amount Due €', 
      dataIndex: 'changeOwed', 
      key: 'changeOwed', 
      render: text => `${text} €`
    },
      { 
        title: 'Actions', 
        key: 'actions', 
        render: (text, record) => (
          <div>
             <EuroOutlined style={{cursor: "pointer"}} onClick={() => handleOpenCloseTabOverlay(record)} />
            <DeleteOutlined style={{ cursor: "pointer" }} onClick={() => handleRemove(record._id)} />
         
            
          </div>
        ),
      },
    ];

    const navigate = useNavigate();

const goToTablePlan = () => {
    navigate('/table-plan');  
}

  

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <DefaultTemplate>
        <h1>Tab List</h1>
        <Button type="primary" onClick={goToTablePlan}>Tables</Button>

        <Table columns={columns} dataSource={tabs} bordered expandable={{ expandedRowRender }} rowKey="_id" />
        {isCloseTabOverlayVisible && currentTab && 
          <CloseTabOverlay 
            tab={currentTab} // passed the current tab data to the overlay component
            closeModal={handleCloseCloseTabOverlay} // passed the close handler to the overlay component
          />}
      </DefaultTemplate>
    </div>
  );
};

export default TabList;
