import mongoose from 'mongoose';

const breakdownSchema = new mongoose.Schema({
    equipment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Equipment',
        required: [true, 'Equipment is required'],
    },
    severity: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
        required: [true, 'Severity is required'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
    },
    reportedDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED'],
        default: 'OPEN',
    },
    rootCause: {
        type: String,
        trim: true,
    },
    resolution: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});

breakdownSchema.index({ equipment: 1 });
breakdownSchema.index({ severity: 1 });
breakdownSchema.index({ status: 1 });

export default mongoose.model('Breakdown', breakdownSchema);