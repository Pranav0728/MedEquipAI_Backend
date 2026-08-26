import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema({
    equipment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Equipment',
        required: [true, 'Equipment is required'],
    },
    type: {
        type: String,
        enum: ['PREVENTIVE', 'CORRECTIVE'],
        required: [true, 'Maintenance type is required'],
    },
    scheduledDate: {
        type: Date,
        required: [true, 'Scheduled date is required'],
    },
    completedDate: {
        type: Date,
    },
    engineer: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE'],
        default: 'SCHEDULED',
    },
    notes: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});

maintenanceSchema.index({ equipment: 1 });
maintenanceSchema.index({ status: 1 });
maintenanceSchema.index({ scheduledDate: 1 });

export default mongoose.model('Maintenance', maintenanceSchema);