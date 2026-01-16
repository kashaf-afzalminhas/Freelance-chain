const mongoose = require('mongoose');

const WorkSubmissionSchema = new mongoose.Schema({
    contract: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contract',
        required: true
    },
    freelancer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    workDescription: {
        type: String,
        required: true
    },
    fileHash: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['submitted', 'approved', 'rejected'],
        default: 'submitted'
    },
    approvedAt: {
        type: Date
    },
    feedback: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('WorkSubmission', WorkSubmissionSchema);