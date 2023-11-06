import { useEffect, useState } from 'react';
import { Table } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { loadTabs, removeTab } from '../redux/store.js'; 
import DefaultTemplate from '../components/DefaultTemplate';
import { DeleteOutlined, EuroOutlined, PrinterOutlined } from '@ant-design/icons';
import CloseTabOverlay from '../components/CloseTab.js'; 
import { Button } from 'antd';  
import { useNavigate } from 'react-router-dom'; 
import Receipt from '../components/Receipt';
import ReactDOM from 'react-dom';

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

  const handlePrintReceipt = (tab) => {
    const saleDetails = {
      ...tab,
      amountPaid: 0, // zero for printing from open tabs
      changeOwed: 0, // 0 since no payment is being processed
    };
  
  
    const printWindow = window.open('', '_blank', 'height=600,width=800');
    ReactDOM.render(<Receipt sale={saleDetails} />, printWindow.document.body, () => {
      printWindow.focus(); 
      printWindow.print(); 
      printWindow.onafterprint = printWindow.close; 
    });
  };
  

  

  

  const handleRemove = async (tabId) => {
    try {
      await dispatch(removeTab(tabId));
    } catch (error) {
      console.error('Failed to remove tab:', error);
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
           <PrinterOutlined style={{ cursor: "pointer" }} onClick={() => handlePrintReceipt(record)} />
         
            
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
        {/*wrap title and buttons*/}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h1 style={{ margin: 0 }}>Tab List</h1>
          <Button type="primary" onClick={goToTablePlan}>Tables</Button>
        </div>

        {/*  */}
        <Table columns={columns} dataSource={tabs} bordered expandable={{ expandedRowRender }} rowKey="_id" />
        {isCloseTabOverlayVisible && currentTab && 
          <CloseTabOverlay 
            tab={currentTab}
            closeModal={handleCloseCloseTabOverlay}
          />}
      </DefaultTemplate>
    </div>
  );
};

export default TabList
