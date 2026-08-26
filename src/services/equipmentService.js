import Equipment from '../models/Equipment.js';

export const createEquipment = async (equipmentData) => {
    const equipment = await Equipment.create(equipmentData);
    return equipment;
};

export const getAllEquipment = async (query = {}) => {
    const { search, category, department, status, criticality } = query;

    let filter = {};

    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { equipmentId: { $regex: search, $options: 'i' } },
            { manufacturer: { $regex: search, $options: 'i' } },
            { model: { $regex: search, $options: 'i' } },
            { serialNumber: { $regex: search, $options: 'i' } },
        ];
    }

    if (category) filter.category = category;
    if (department) filter.department = department;
    if (status) filter.status = status;
    if (criticality) filter.criticality = criticality;

    const equipment = await Equipment.find(filter).sort({ createdAt: -1 });
    return equipment;
};

export const getEquipmentById = async (id) => {
    const equipment = await Equipment.findById(id);
    return equipment;
};

export const getEquipmentByEquipmentId = async (equipmentId) => {
    const equipment = await Equipment.findOne({ equipmentId });
    return equipment;
};

export const updateEquipment = async (id, updateData) => {
    const equipment = await Equipment.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });
    return equipment;
};

export const deleteEquipment = async (id) => {
    const equipment = await Equipment.findByIdAndDelete(id);
    return equipment;
};

export const getEquipmentStats = async () => {
    const stats = await Equipment.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
            },
        },
    ]);

    const result = {
        active: 0,
        maintenance: 0,
        inactive: 0,
    };

    stats.forEach((stat) => {
        if (stat._id === 'ACTIVE') result.active = stat.count;
        if (stat._id === 'MAINTENANCE') result.maintenance = stat.count;
        if (stat._id === 'INACTIVE') result.inactive = stat.count;
    });

    return result;
};