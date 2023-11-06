import DefaultTemplate from '../components/DefaultTemplate';
import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useEffect, useState, useCallback, useContext } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { loadCategories, addCategory, deleteCategory } from '../redux/store.js';
import { UserContext } from '../UserContext';

const MenuItemPage = () => {
  const {  checkPermission } = useContext(UserContext);
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [popupModal, setPopupModal] = useState(false);
  const [categoryManagementModal, setCategoryManagementModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
const [currentEditItem, setCurrentEditItem] = useState(null);
const [searchTerm, setSearchTerm] = useState("");


  
  const categories = useSelector(state => {
    console.log("Redux State: ", state); 
    return state.categories;
  });

  const getAllData = useCallback(async () => {
    try {
      dispatch({ type: 'LOADING_SHOW' });
      const response = await axios.get("/api/products/getproducts");
      if (response.status === 200) {
        setData(response.data);
      } else {
        console.error('Error fetching data:', response.status);
      }
      dispatch({ type: 'LOADING_HIDE' });
    } catch (error) {
      console.error(error);
      dispatch({ type: 'LOADING_HIDE' });
    }
  }, [dispatch]); 
  

useEffect(() => {
  getAllData();
  dispatch(loadCategories());
}, [dispatch, getAllData]); 

const getFilteredData = useCallback(() => {
  if (!searchTerm) {
    return data;
  }
  return data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
}, [data, searchTerm]);

const filteredData = getFilteredData();


  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Category',
      dataIndex: ['category', 'name'],
      key: 'category',
      filters: categories.map(category => ({ text: category.name, value: category._id })),
      onFilter: (value, record) => record.category?._id === value,
    },
    { title: 'Price €', dataIndex: 'price', key: 'price' },
    { title: '', dataIndex: 'image', render: (image, record) => <img src={image} alt={"record.name"} height="75" width="75" /> },
    {
      title: 'Action',
      dataIndex: '_id',
      render: (id, record) => (
        <div>
          {checkPermission('canEdit') && <EditOutlined style={{ cursor: "pointer", marginRight: "10px" }} onClick={() => handleEditButtonClick(record)}/>}
          {checkPermission('canDelete') && <DeleteOutlined style={{ cursor: "pointer" }} onClick={() => handleDeleteProduct(id)} />}
        </div>
      ),
    },
    
  ];

  const handleSubmit = async (value) => {
    try {
      dispatch({ type: 'LOADING_SHOW' });
      const response = await axios.post("/api/products/addproducts", value);
      if (response.status === 201) {
        message.success('Item added to menu');
        getAllData();
        setPopupModal(false);
      } else {
        console.error('Error adding item:', response.status);
        message.error('Error adding item to menu');
      }
      dispatch({ type: 'LOADING_HIDE' });
    } catch (error) {
      console.error(error);
      message.error('Error adding item to menu');
      dispatch({ type: 'LOADING_HIDE' });
    }
  };
  const handleDeleteProduct = async (id) => {
    try {
      dispatch({ type: 'LOADING_SHOW' });
      const response = await axios.delete(`/api/products/deleteproduct/${id}`);
      if (response.status === 200) {
        message.success('Item deleted successfully');
        getAllData();
      } else {
        message.error('Error deleting item');
      }
      dispatch({ type: 'LOADING_HIDE' });
    } catch (error) {
      console.error(error);
      message.error('Error deleting item');
      dispatch({ type: 'LOADING_HIDE' });
    }
  };

  useEffect(() => {
    if(currentEditItem) {
      setEditModalVisible(true);
    }
  }, [currentEditItem]);
  

  const handleEditButtonClick = (record) => {
    console.log("Edit button clicked, record:", record); 
    setCurrentEditItem(record);
    setEditModalVisible(true);
  };
  
  useEffect(() => {
    console.log("currentEditItem changed, new value:", currentEditItem); 
    if(currentEditItem) {
      setEditModalVisible(true);
    }
  }, [currentEditItem]);

  useEffect(() => {
  console.log("editModalVisible changed:", editModalVisible);
}, [editModalVisible]);

  

  const handleEditSubmit = async (values) => {
    try {
      const response = await axios.put(`/api/products/editproduct/${currentEditItem._id}`, values);
      if (response.status === 200) {
        message.success('Item updated successfully');
        getAllData();
        setEditModalVisible(false);
      } else {
        message.error('Error updating item');
      }
    } catch (error) {
      console.error(error);
      message.error('Error updating item');
    }
  };

  const handleAddCategory = async (category) => {
    dispatch(addCategory({ name: category }));
  };

  const handleAddCategoryButtonClick = async () => {
    if (newCategory) {
      await handleAddCategory(newCategory);
      setNewCategory("");
    } else {
      message.error('Category name cannot be empty');
    }
  };

  const handleDeleteCategory = async (id) => {
    dispatch(deleteCategory(id));
  };

  const openCategoryManagementModal = () => {
    if(checkPermission('canManageCategories')) {
      setCategoryManagementModal(true);
    } else {
      message.error('You do not have permission to manage categories.');
    }
  };
  

  const closeCategoryManagementModal = () => {
    setCategoryManagementModal(false);
  };

  return (
    <DefaultTemplate>

<Modal title="Edit Existing Menu Item" visible={editModalVisible} onCancel={() => setEditModalVisible(false)} footer={false}>
  <Form layout="vertical" onFinish={handleEditSubmit} initialValues={currentEditItem}>
    <Form.Item name="name" label="Name">
      <Input />
    </Form.Item>
    <Form.Item name="category" label="Category">
      <Select>
        {categories.map(category => (
          <Select.Option key={category._id} value={category._id}>
            {category.name}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
    <Form.Item name="price" label="Price">
      <Input />
    </Form.Item>
    <Form.Item name="image" label="Image URL">
      <Input />
    </Form.Item>
    <div className="d-flex justify-content-end">
      <Button type="primary" htmlType="submit" onClick={() => setEditModalVisible(false)}>Edit Item</Button>
    </div>
  </Form>
</Modal>
      <div className="d-flex justify-content-between">
        <h1>Menu Items</h1>
        <div className="search-bar">
  <Input
    placeholder="Search by name..."
    value={searchTerm}
    onChange={e => setSearchTerm(e.target.value)}
    style={{ width: 200, marginBottom: 16 }}
  />
</div>
        <div>
          {checkPermission('canAddItem') && 
          
  <Button 
    type="primary" 
    shape="round" 
    size="medium" 
    onClick={() => { setPopupModal(true) }}
  >
    + Add New Item
  </Button>
  
}

          <Button type="secondary" shape="round" size="medium" onClick={openCategoryManagementModal} style={{ marginLeft: '10px' }}>
            Manage Categories
          </Button>
        </div>
      </div>

      <Table columns={columns} dataSource={filteredData} bordered />

      {/* Add Item Modal */}
      <Modal title="+ Add New Item to Menu" visible={popupModal} onCancel={() => setPopupModal(false)} footer={false}>
        {}
        <Form layout="vertical"
         onFinish={handleSubmit}
          initialValues={currentEditItem}
          >
          <Form.Item name="name" label="Name">
            <Input />
          </Form.Item>
          <Form.Item name="category" label="Category">
            <Select>
              {categories.map(category => (
                <Select.Option key={category._id} value={category._id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="price" label="Price">
            <Input />
          </Form.Item>
          <Form.Item name="image" label="Image URL">
            <Input />
          </Form.Item>
          <div className="d-flex justify-content-end">
            <Button type="primary" htmlType="submit" onClick={() => setPopupModal(false)}>Add Item</Button>
          </div>
        </Form>
      </Modal>

      {/* Category Management Modal */}
      <Modal title="Manage Categories" visible={categoryManagementModal} onCancel={closeCategoryManagementModal} footer={false}>
        <Input 
          value={newCategory} 
          onChange={e => setNewCategory(e.target.value)} 
          placeholder="Enter new category" 
        />
        <Button onClick={handleAddCategoryButtonClick}>Add Category</Button>
        {categories.map(category => (
          <div key={category._id} style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}>
            {category.name}
            <Button onClick={() => handleDeleteCategory(category._id)}>Delete</Button>
          </div>
        ))}
      </Modal>
    </DefaultTemplate>
  );
};

export default MenuItemPage;
