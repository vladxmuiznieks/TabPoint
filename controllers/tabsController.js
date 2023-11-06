import tabModel from '../models/tabModel.js';
import SalesModel from '../models/salesModel.js'; // 

export const addTabController = async (req, res) => {
  try {
    const { items, totalAmountDue, amountPaid, tableNo } = req.body;

    const existingTab = await tabModel.findOne({ tableNo });

    if (existingTab) {
      // If a tab for the table already exists update it
      existingTab.items = [...existingTab.items, ...items];
      existingTab.totalAmountDue += totalAmountDue;
      existingTab.amountPaid += amountPaid;
      existingTab.changeOwed = existingTab.amountPaid - existingTab.totalAmountDue;

      await existingTab.save();
      res.status(200).json({ message: 'Tab updated successfully', tab: existingTab });
    } else {
 
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




export const getAllTabsController = async (req, res) => {
  try {
    const tabs = await tabModel.find();
    res.status(200).json({ message: "Tabs retrieved successfully", tabs });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};


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

const calculateTotalCost = (items) => {
  return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
};


export const closeTabController = async (req, res) => {
  try {
    const tabId = req.params.tabId;
    // Find the tab
    const tab = await tabModel.findById(tabId);

    if (!tab) {
      return res.status(404).json({ message: "Tab not found" });
    }

    // Calculate the total cost
    const totalCost = calculateTotalCost(tab.items);

    // Create a sale 
    const sale = new SalesModel({
      tabId: tab._id,
      tableNo: tab.tableNo,
      items: tab.items,
      totalAmountDue: totalCost,
      amountPaid: req.body.amountPaid,
      changeOwed: req.body.amountPaid - totalCost,
      saleDate: new Date(),
    });

    const savedSale = await sale.save();

    // Sale is saved, delete the tab
    await tabModel.findByIdAndDelete(tabId);

    res.status(200).json({ message: "Sale completed and tab closed", sale: savedSale });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


