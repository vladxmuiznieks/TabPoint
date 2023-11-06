import tablePlanModel from '../models/tablePlanModel.js';


export const getTablePlanController = async (req, res) => {
    try {
        const tablePlan = await tablePlanModel.findOne().sort({ _id: -1 });  // Fetches the latest entry
        res.json(tablePlan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



export const createTablePlanController = async (req, res) => {
    const newTablePlan = new tablePlanModel({
        tables: req.body.tables
    });

    try {
        const savedTablePlan = await newTablePlan.save();
        res.json(savedTablePlan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const upsertTablePlanController = async (req, res) => {
    try {
        const existingPlan = await tablePlanModel.findOne();
        if (existingPlan) {
            const updatedTablePlan = await tablePlanModel.findOneAndUpdate({}, req.body, { new: true });
            return res.json(updatedTablePlan);
        }

        const newTablePlan = new tablePlanModel({
            tables: req.body.tables,
            barriers: req.body.barriers
        });

        const savedTablePlan = await newTablePlan.save();
        res.json(savedTablePlan);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



export const deleteTableController = async (req, res) => {
    const tableId = req.params.tableId;
    try {
        const tablePlan = await tablePlanModel.findOne();
        const updatedTables = tablePlan.tables.filter(table => table._id.toString() !== tableId);
        tablePlan.tables = updatedTables;
        await tablePlan.save();
        res.json({ message: "Table deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
