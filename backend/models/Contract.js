const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    bid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bid',
        required: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    freelancer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    contractAddress: {
        type: String,
        required: true
    },
    contractId: {
        type: Number,
        required: true
    },
    bidAmount: {
        type: Number,
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: [
            'created',
            'client_signed',
            'both_signed',
            'work_submitted',
            'completed',
            'disputed',
            'refunded'
        ],
        default: 'created'
    },
    clientSigned: {
        type: Boolean,
        default: false
    },
    freelancerSigned: {
        type: Boolean,
        default: false
    },
    transactionHash: {
        type: String,
        required: true
    },
    workHash: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Add indexes for better query performance
contractSchema.index({ client: 1, status: 1 });
contractSchema.index({ freelancer: 1, status: 1 });
contractSchema.index({ job: 1 });
contractSchema.index({ contractAddress: 1 });
contractSchema.index({ contractId: 1 }, { unique: true });

const Contract = mongoose.model('Contract', contractSchema);

module.exports = Contract;