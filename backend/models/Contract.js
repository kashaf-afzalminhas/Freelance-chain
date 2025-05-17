const mongoose = require('mongoose');

const ContractSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  bid: { type: mongoose.Schema.Types.ObjectId, ref: 'Bid', required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contractAddress: { type: String },
  transactionHash: { type: String },
  bidAmount: { type: Number, required: true },
  jobTitle: { type: String, required: true },
  jobDescription: { type: String, required: true },
  deadline: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['created', 'client_signed', 'freelancer_signed', 'work_submitted', 'completed', 'disputed'],
    default: 'created'
  },
  clientSigned: { type: Boolean, default: false },
  freelancerSigned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contract', ContractSchema);