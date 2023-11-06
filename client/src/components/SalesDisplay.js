import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DatePicker, Table, Modal, notification } from 'antd';
import { fetchAllSales, clearSales } from '../redux/store'; 
import DefaultTemplate from './DefaultTemplate';
import { PrinterOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import ReactDOM from 'react-dom';
import Receipt from './Receipt';
import { Button } from 'antd'; 


const { confirm } = Modal;

const SalesDisplay = () => {
  const dispatch = useDispatch();
  const sales = useSelector((state) => state.rootReducer.sales.sales);
  const [dateRange, setDateRange] = useState([null, null]);
  const { RangePicker } = DatePicker;
  const [totalSalesValue, setTotalSalesValue] = useState(0);
  const [firstSaleDate, setFirstSaleDate] = useState(null);
  const [lastSaleDate, setLastSaleDate] = useState(null);
  const [aggregatedItems, setAggregatedItems] = useState([]);
  

  useEffect(() => {
    dispatch(fetchAllSales()).catch((error) => {
      console.error('Error fetching sales:', error);
    });
  }, [dispatch]);
  

  

  const filteredSales = sales.filter(sale => {
    const saleDate = new Date(sale.saleDate).setHours(0, 0, 0, 0);
    const startDate = dateRange[0] ? new Date(dateRange[0]).setHours(0, 0, 0, 0) : null;
    const endDate = dateRange[1] ? new Date(dateRange[1]).setHours(23, 59, 59, 999) : null;

    if (startDate && endDate) {
      return saleDate >= startDate && saleDate <= endDate;
    }
    return true; 
  });


  const calculateTotalsAndExtremes = (salesData) => {
    if (!salesData.length) return;

    const sortedSales = [...salesData].sort(
      (a, b) => new Date(a.saleDate) - new Date(b.saleDate)
    );
    const firstSale = sortedSales[0];
    const lastSale = sortedSales[sortedSales.length - 1];
    const totalValue = sortedSales.reduce((acc, sale) => acc + sale.totalAmountDue, 0);

    setTotalSalesValue(totalValue);
    setFirstSaleDate(firstSale.saleDate);
    setLastSaleDate(lastSale.saleDate);
  };

  
  useEffect(() => {
    calculateTotalsAndExtremes(filteredSales);
  }, [filteredSales]);
  
  const aggregateItemsForXReport = () => {
    const itemsMap = {};

    filteredSales.forEach(sale => {
      sale.items.forEach(item => {
        if (itemsMap[item._id]) {
          itemsMap[item._id].quantity += item.quantity;
          itemsMap[item._id].totalPrice += item.quantity * item.price;
        } else {
          itemsMap[item._id] = {
            name: item.name,
            quantity: item.quantity,
            totalPrice: item.quantity * item.price,
          };
        }
      });
    });

    setAggregatedItems(Object.values(itemsMap));
  };

  const handlePrintReceipt = (sale, isXReport = false) => {
    if (isXReport) {
      aggregateItemsForXReport();
    }

    const receiptProps = isXReport
      ? { items: aggregatedItems, totalSalesValue, firstSaleDate, lastSaleDate }
      : { sale, totalSalesValue, firstSaleDate, lastSaleDate };
    
    const printWindow = window.open('', '_blank', 'height=600,width=800');
    ReactDOM.render(<Receipt {...receiptProps} />, printWindow.document.body, () => {
      printWindow.focus(); 
      printWindow.print(); 
      printWindow.onafterprint = printWindow.close; 
    });
  };

  const handlePrintZReport = () => {
    aggregateItemsForXReport(); 

    const receiptProps = {
      items: aggregatedItems,
      totalSalesValue,
      firstSaleDate,
      lastSaleDate,
      isZReport: true 
    };

   
    const printWindow = window.open('', '_blank', 'height=600,width=800');
    ReactDOM.render(<Receipt {...receiptProps} />, printWindow.document.body, () => {
      printWindow.focus(); // Focus on the window
      printWindow.print(); // Print the receipt
      printWindow.onafterprint = () => {
        clearSalesFromDatabase();
        printWindow.close(); 
      };
    });
  };

  const clearSalesFromDatabase = () => {
    // Show confirmation before clearing sales
    confirm({
      title: 'Are you sure you want to clear all sales?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone. All sales within the selected range will be permanently deleted.',
      onOk() {
        // clear sales
        dispatch(clearSales(dateRange[0], dateRange[1])).then(() => {
          notification.success({
            message: 'Sales Cleared',
            description: 'All sales have been cleared from the database.',
          });
        }).catch((error) => {
          console.error('Error clearing sales:', error);
          notification.error({
            message: 'Error',
            description: 'There was an error clearing sales from the database.',
          });
        });
      },
    });
  };

  

  

  const columns = [
    { 
      title: 'Date',
      dataIndex: 'saleDate',
      key: 'saleDate',
      render: text => new Date(text).toLocaleDateString()
    },
    { 
      title: 'Table No.',
      dataIndex: 'tableNo',
      key: 'tableNo',
      render: text => text || 'N/A'
    },
    { 
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      render: items => (
        <div>
          {items.map((item, index) => (
            <div key={index}>
              {item.quantity}x {item.name} @ ${item.price.toFixed(2)}
            </div>
          ))}
        </div>
      )
    },
    { 
      title: 'Total Amount Due',
      dataIndex: 'totalAmountDue',
      key: 'totalAmountDue',
      render: text => `€${text.toFixed(2)}`
    },
    { 
      title: 'Amount Paid',
      dataIndex: 'amountPaid',
      key: 'amountPaid',
      render: text => `€${text.toFixed(2)}`
    },
    { 
      title: 'Change Owed',
      dataIndex: 'changeOwed',
      key: 'changeOwed',
      render: text => `€${text.toFixed(2)}`
    },
    {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          <PrinterOutlined
            style={{ cursor: 'pointer' }}
            onClick={() => handlePrintReceipt(record)}
          />
        ),
      },
    ];

    

  return (
    <DefaultTemplate>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Sales History</h2>
          <RangePicker onChange={(dates, dateStrings) => setDateRange(dateStrings)} />
        </div>
        <Table 
          columns={columns} 
          dataSource={filteredSales} 
          rowKey="_id" 
          loading={!sales || sales.length === 0}
          pagination={{ pageSize: 10 }}
          bordered
        />
      </div>
      <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Button
        type="primary"
        onClick={() => handlePrintReceipt(null, true)}
        disabled={!dateRange[0] || !dateRange[1]}
      >
        Print X Report
      </Button>
      <div style={{ width: '100px' }} /> {/* */}
      <Button
        type="primary"
        onClick={handlePrintZReport}
        disabled={!dateRange[0] || !dateRange[1]}
      >
        Print Z Report and Clear Sales
      </Button>
    </div>
    </DefaultTemplate>
  );
};

export default SalesDisplay;


