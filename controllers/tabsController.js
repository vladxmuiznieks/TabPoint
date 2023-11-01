import tabModel from '../models/tabModel.js';
import SalesModel from '../models/salesModel.js'; // 

// Controller to add a new tab
// tabsController.js
// tabsController.js
export const addTabController = async (req, res) => {
  try {
    const { items, totalAmountDue, amountPaid, tableNo } = req.body;

    const existingTab = await tabModel.findOne({ tableNo });

    if (existingTab) {
      // If a tab for the table already exists, update it
      existingTab.items = [...existingTab.items, ...items];
      existingTab.totalAmountDue += totalAmountDue;
      existingTab.amountPaid += amountPaid;
      existingTab.changeOwed = existingTab.amountPaid - existingTab.totalAmountDue;

      await existingTab.save();
      res.status(200).json({ message: 'Tab updated successfully', tab: existingTab });
    } else {
      // If no tab for the table exists, create a new one
      const changeOwed = amountPaid - totalAmountDue;
      const newTab = new tabModel({
        items,
        totalAmountDue, 
        amountPaid,
        changeOwed,
        tableNo,
      });

      await newTab.save();
      res.status(201).json({ message: 'Tab added successfully', tab: newTab });
    }
  } catch (error) {
    console.error("Error in addTabController: ", error);
    res.status(500).json({ message: error.message });
  }
};



// Controller to get all tabs
export const getAllTabsController = async (req, res) => {
  try {
    const tabs = await tabModel.find();
    res.status(200).json({ message: "Tabs retrieved successfully", tabs });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

// Controller to get a tab by ID
export const getTabByIdController = async (req, res) => {
  try {
    const tab = await tabModel.findById(req.params.id);
    if (tab) {
      res.status(200).json({ message: "Tab retrieved successfully", tab });
    } else {
      res.status(404).json({ message: "Tab not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

export const updateTabController = async (req, res) => {
  try {
    const { items, amountPaid = 0 } = req.body;
    
    let updateData = { ...req.body };
    
    if (items) {
      const totalAmountDue = items.reduce((acc, item) => acc + (item.price * item.quantity), 0) - amountPaid;
      const changeDue = amountPaid > totalAmountDue ? amountPaid - totalAmountDue : 0;
      updateData = {
        ...updateData,
        totalAmountDue,
        changeDue,
      };
    }
    
    const updatedTab = await tabModel.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    
    if (updatedTab) {
      res.status(200).json({ message: "Tab updated successfully", tab: updatedTab });
    } else {
      res.status(404).json({ message: "Tab not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};


  export const deleteTabController = async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await tabModel.findByIdAndDelete(id);
        
        if (result) {
            res.status(200).send({ message: 'Tab deleted successfully', data: result });
        } else {
            res.status(404).send({ message: 'Tab not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error' });
    }
};
export const closeTabController = async (req, res) => {
  try {
    const { id } = req.params;
    
    const tab = await tabModel.findById(id);

    if (tab) {
      tab.dateClosed = new Date();
      await tab.save();

      // Calculate the total amount, amount paid, and change owed
      const items = tab.items.map(item => ({ 
        name: item.name, 
        category: item.category, 
        price: item.price, 
        quantity: item.quantity 
      }));
      const totalAmountDue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const amountPaid = tab.amountPaid || totalAmountDue; // Assuming amountPaid is stored in tab, update this as necessary
      const changeOwed = amountPaid - totalAmountDue;

      // Create a new sale record using the details from the closed tab
      const sale = new SalesModel({
        tabId: tab._id,
        tableNo: tab.tableNo, 
        items,
        totalAmountDue,
        amountPaid,
        changeOwed,
        saleDate: new Date(),
      });

      await sale.save();

      res.status(200).json({ message: 'Tab closed and sale logged successfully', tab });
    } else {
      res.status(404).json({ message: 'Tab not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

