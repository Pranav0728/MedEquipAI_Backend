import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema({
    equipmentId: {
        type: String,
        required: [true, 'Equipment ID is required'],
        unique: true,
        trim: true,
    },
    name: {
        type: String,
        required: [true, 'Equipment name is required'],
        trim: true,
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true,
    },
    manufacturer: {
        type: String,
        required: [true, 'Manufacturer is required'],
        trim: true,
    },
    model: {
        type: String,
        required: [true, 'Model is required'],
        trim: true,
    },
    serialNumber: {
        type: String,
        required: [true, 'Serial number is required'],
        unique: true,
        trim: true,
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true,
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true,
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'MAINTENANCE', 'INACTIVE'],
        default: 'ACTIVE',
    },
    criticality: {
        type: String,
        enum: ['HIGH', 'MEDIUM', 'LOW'],
        required: [true, 'Criticality is required'],
    },
    purchaseDate: {
        type: Date,
        required: [true, 'Purchase date is required'],
    },
    lastMaintenanceDate: {
        type: Date,
    },
    nextMaintenanceDate: {
        type: Date,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

equipmentSchema.virtual('riskScore').get(function () {
    return null;
});

equipmentSchema.index({ department: 1 });
equipmentSchema.index({ status: 1 });

export default mongoose.model('Equipment', equipmentSchema);