import express from 'express';
import { addTabController, getAllTabsController, getTabByIdController, updateTabController, closeTabController } from '../controllers/tabsController.js';
import mongoose from 'mongoose';
import { deleteTabController } from '../controllers/tabsController.js';
const router = express.Router();

function validateId(req, res, next) {
    const id = req.params.id;
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ObjectId' });
    }
    next();
  }

  router.post('/add', addTabController);
  router.get('/gettabs', getAllTabsController);
  router.get('/:id', validateId, getTabByIdController);
  router.put('/:id', validateId, updateTabController);
  router.delete('/:id', validateId, deleteTabController);
  router.put('/closetab/:tabId', validateId, closeTabController);
  router.put('/closetab/:id', closeTabController);


export default router;