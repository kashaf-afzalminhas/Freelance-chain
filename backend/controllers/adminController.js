const User = require('../models/User');
const Job = require('../models/Job');
const Contract = require('../models/Contract');
// const Project = require('../models/Project');
// const Proposal = require('../models/Proposal');
// const Payment = require('../models/Payment');
// const Review = require('../models/Review');
// const Report = require('../models/Report');
// const Message = require('../models/Message');
// const { createObjectCsvWriter } = require('csv-writer');
const path = require('path');
const notificationService = require('../services/notificationService');
const Notification = require('../models/Notification');

const adminController = {
  // Dashboard stats
  getDashboardStats: async (req, res) => {
    try {
      const [
        totalUsers,
        totalJobs,
        totalContracts,
        activeJobs,
        completedContracts
      ] = await Promise.all([
        User.countDocuments(),
        Job.countDocuments(),
        Contract.countDocuments(),
        Job.countDocuments({ status: 'active' }),
        Contract.countDocuments({ status: 'completed' })
      ]);

      res.json({
        success: true,
        data: {
          totalUsers,
          totalJobs,
          totalContracts,
          activeJobs,
          completedContracts
        }
      });
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error fetching dashboard statistics' 
      });
    }
  },

// User management
  getUsers: async (req, res) => {
    try {
      const { page = 1, limit = 10, status, role } = req.query;
      const query = {};

      if (status) query.status = status;
      if (role) query.role = role;

      const users = await User.find(query)
        .select('-nonce')
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

      const total = await User.countDocuments(query);

      res.json({
        success: true,
        data: {
          users,
          total,
          pages: Math.ceil(total / limit),
          currentPage: parseInt(page)
        }
      });
    } catch (error) {
      console.error('Error getting users:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error fetching users' 
      });
    }
  },

  updateUserStatus: async (req, res) => {
    try {
      const { userId } = req.params;
      const { status } = req.body;

      const user = await User.findByIdAndUpdate(
        userId,
        { status },
        { new: true }
      ).select('-nonce');

      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }

      res.json({ 
        success: true, 
        data: { user } 
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error updating user status' 
      });
    }
  },

// Job management
  getJobs: async (req, res) => {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const query = {};

      if (status) query.status = status;

      const jobs = await Job.find(query)
        .populate('clientId', 'name walletAddress')
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

      const total = await Job.countDocuments(query);

      res.json({
        success: true,
        data: {
          jobs,
          total,
          pages: Math.ceil(total / limit),
          currentPage: parseInt(page)
        }
      });
    } catch (error) {
      console.error('Error getting jobs:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error fetching jobs' 
      });
    }
  },

  updateJobStatus: async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status } = req.body;

    const job = await Job.findByIdAndUpdate(
      jobId,
      { status },
      { new: true }
      ).populate('clientId', 'name walletAddress');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

      res.json({ success: true, job });
  } catch (error) {
    console.error('Error updating job status:', error);
    res.status(500).json({ success: false, message: 'Error updating job status' });
  }
  },

// Contract management
  getContracts: async (req, res) => {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const query = {};

      if (status) query.status = status;

      const contracts = await Contract.find(query)
        .populate('client', 'name walletAddress')
        .populate('freelancer', 'name walletAddress')
        .populate('job', 'title description')
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

      const total = await Contract.countDocuments(query);

      res.json({
        success: true,
        data: {
          contracts,
          total,
          pages: Math.ceil(total / limit),
          currentPage: parseInt(page)
        }
      });
    } catch (error) {
      console.error('Error getting contracts:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error fetching contracts' 
      });
    }
  },

  getContractDetails: async (req, res) => {
    try {
      const { contractId } = req.params;

      const contract = await Contract.findById(contractId)
        .populate('client', 'name walletAddress')
        .populate('freelancer', 'name walletAddress')
        .populate('job', 'title description');

      if (!contract) {
        return res.status(404).json({
          success: false,
          message: 'Contract not found'
        });
      }

      res.json({
        success: true,
        contract
      });
    } catch (error) {
      console.error('Error getting contract details:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching contract details'
      });
    }
  },

  updateContractStatus: async (req, res) => {
    try {
      const { contractId } = req.params;
      const { status } = req.body;

      const contract = await Contract.findByIdAndUpdate(
        contractId,
        { status },
        { new: true }
      ).populate('client', 'name walletAddress')
       .populate('freelancer', 'name walletAddress');

      if (!contract) {
        return res.status(404).json({ success: false, message: 'Contract not found' });
      }

      res.json({ success: true, contract });
    } catch (error) {
      console.error('Error updating contract status:', error);
      res.status(500).json({ success: false, message: 'Error updating contract status' });
    }
  },

  // Dispute management
  getDisputes: async (req, res) => {
    try {
      const disputes = await Contract.find({
        status: { $in: ['disputed', 'work_rejected'] }
      })
      .populate('client', 'name walletAddress')
      .populate('freelancer', 'name walletAddress')
      .populate('job', 'title description')
      .sort({ updatedAt: -1 });

      // Transform the contracts into disputes format
      const formattedDisputes = disputes.map(contract => ({
        _id: contract._id,
        contractId: contract.contractId,
        job: contract.job,
        client: contract.client,
        freelancer: contract.freelancer,
        status: contract.status,
        disputeReason: contract.rejectionReason || 'Work rejected',
        disputeRaisedBy: 'Client',
        disputeRaisedAt: contract.updatedAt,
        bidAmount: contract.bidAmount,
        workHash: contract.workHash
      }));

      res.json({
        success: true,
        data: formattedDisputes
      });
    } catch (error) {
      console.error('Error getting disputes:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching disputes'
      });
    }
  },

  getDisputeDetails: async (req, res) => {
    try {
      const { contractId } = req.params;

      const contract = await Contract.findOne({
        _id: contractId,
        status: { $in: ['disputed', 'work_rejected'] }
      })
      .populate('client', 'name walletAddress')
      .populate('freelancer', 'name walletAddress')
      .populate('job', 'title description');

      if (!contract) {
        return res.status(404).json({
          success: false,
          message: 'Dispute not found'
        });
      }

      // Format the dispute details
      const disputeDetails = {
        _id: contract._id,
        contractId: contract.contractId,
        job: contract.job,
        client: contract.client,
        freelancer: contract.freelancer,
        status: contract.status,
        disputeReason: contract.rejectionReason || 'Work rejected',
        disputeRaisedBy: 'Client',
        disputeRaisedAt: contract.updatedAt,
        bidAmount: contract.bidAmount,
        workHash: contract.workHash,
        rejectionTransactionHash: contract.rejectionTransactionHash
      };

      res.json({
        success: true,
        data: disputeDetails
      });
    } catch (error) {
      console.error('Error getting dispute details:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching dispute details'
      });
    }
  },

  resolveDispute: async (req, res) => {
    try {
      const { contractId } = req.params;
      const { clientShare, freelancerShare, adminNote } = req.body;

      if (!clientShare || !freelancerShare || !adminNote) {
        return res.status(400).json({
          success: false,
          message: 'Client share, freelancer share, and admin note are required'
        });
      }

      const contract = await Contract.findById(contractId)
        .populate('client', 'name walletAddress')
        .populate('freelancer', 'name walletAddress');

      if (!contract) {
        return res.status(404).json({
          success: false,
          message: 'Contract not found'
        });
      }

      if (contract.status !== 'disputed') {
        return res.status(400).json({
          success: false,
          message: 'This contract is not in dispute'
        });
      }

      // Update contract status
      contract.status = 'completed';
      contract.disputeResolution = {
        clientShare,
        freelancerShare,
        adminNote,
        resolvedBy: req.adminUser._id,
        resolvedAt: new Date()
      };
      await contract.save();

      // Send notifications to both parties
      const notificationMessage = `Dispute resolved: ${adminNote}. Client receives ${clientShare}% and freelancer receives ${freelancerShare}% of the escrow amount.`;
      
      await notificationService.notify(
        contract.client._id,
        'dispute_resolved',
        notificationMessage,
        `/contracts/${contract._id}`,
        req.app.get('io'),
        req.adminUser._id
      );

      await notificationService.notify(
        contract.freelancer._id,
        'dispute_resolved',
        notificationMessage,
        `/contracts/${contract._id}`,
        req.app.get('io'),
        req.adminUser._id
      );

      res.json({
        success: true,
        message: 'Dispute resolved successfully',
        contract
      });
    } catch (error) {
      console.error('Error resolving dispute:', error);
      res.status(500).json({
        success: false,
        message: 'Error resolving dispute'
      });
    }
  },

  // Additional endpoints for frontend components
  getProposals: async (req, res) => {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const query = {};

      if (status) query.status = status;

      const proposals = await Proposal.find(query)
        .populate('freelancerId', 'name walletAddress')
        .populate('jobId', 'title')
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

      const total = await Proposal.countDocuments(query);

      res.json({
        success: true,
        data: {
          proposals,
          total,
          pages: Math.ceil(total / limit),
          currentPage: parseInt(page)
        }
      });
    } catch (error) {
      console.error('Error getting proposals:', error);
      res.status(500).json({ success: false, message: 'Error fetching proposals' });
    }
  },

  getPayments: async (req, res) => {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const query = {};

      if (status) query.status = status;

      const payments = await Payment.find(query)
        .populate('clientId', 'name walletAddress')
        .populate('freelancerId', 'name walletAddress')
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

      const total = await Payment.countDocuments(query);

      res.json({
        success: true,
        data: {
          payments,
          total,
          pages: Math.ceil(total / limit),
          currentPage: parseInt(page)
        }
      });
    } catch (error) {
      console.error('Error getting payments:', error);
      res.status(500).json({ success: false, message: 'Error fetching payments' });
    }
  },

  getReviews: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;

      const reviews = await Review.find()
        .populate('reviewerId', 'name walletAddress')
        .populate('revieweeId', 'name walletAddress')
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

      const total = await Review.countDocuments();

      res.json({
        success: true,
        data: {
          reviews,
          total,
          pages: Math.ceil(total / limit),
          currentPage: parseInt(page)
        }
      });
    } catch (error) {
      console.error('Error getting reviews:', error);
      res.status(500).json({ success: false, message: 'Error fetching reviews' });
    }
  },

  getReports: async (req, res) => {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const query = {};

      if (status) query.status = status;

      const reports = await Report.find(query)
        .populate('reporterId', 'name walletAddress')
        .populate('reportedId', 'name walletAddress')
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

      const total = await Report.countDocuments(query);

      res.json({
        success: true,
        data: {
          reports,
          total,
          pages: Math.ceil(total / limit),
          currentPage: parseInt(page)
        }
      });
    } catch (error) {
      console.error('Error getting reports:', error);
      res.status(500).json({ success: false, message: 'Error fetching reports' });
    }
  },

  getMessages: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;

      const messages = await Message.find()
        .populate('senderId', 'name walletAddress')
        .populate('receiverId', 'name walletAddress')
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

      const total = await Message.countDocuments();

      res.json({
        success: true,
        data: {
          messages,
          total,
          pages: Math.ceil(total / limit),
          currentPage: parseInt(page)
        }
      });
    } catch (error) {
      console.error('Error getting messages:', error);
      res.status(500).json({ success: false, message: 'Error fetching messages' });
    }
  },

  // Data export
  exportData: async (req, res) => {
    try {
      const { type } = req.params;
      let data;

      switch (type) {
        case 'users':
          data = await User.find().select('-nonce');
          break;
        case 'jobs':
          data = await Job.find().populate('clientId', 'name walletAddress');
          break;
        case 'contracts':
          data = await Contract.find()
            .populate('clientId', 'name walletAddress')
            .populate('freelancerId', 'name walletAddress');
          break;
        default:
          return res.status(400).json({ 
            success: false, 
            message: 'Invalid export type' 
          });
      }

      res.json({ 
        success: true, 
        data 
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error exporting data' 
      });
    }
  },

  // System notifications
  sendSystemNotification: async (req, res) => {
    try {
      const { message, type, targetUsers, title } = req.body;
      const io = req.app.get('io'); // get socket.io instance

      // Get users to notify
      let users;
      if (Array.isArray(targetUsers) && targetUsers.length > 0) {
        users = await User.find({ _id: { $in: targetUsers } });
      } else {
        users = await User.find({});
      }

      // Send notification to each user
      await Promise.all(users.map(user =>
        notificationService.notify(
          user._id,
          type || 'info',
          title ? `${title}: ${message}` : message,
          '/', // or a relevant link
          io,
          req.adminUser?._id // senderId (admin)
        )
      ));

      res.json({ 
        success: true, 
        message: 'Notification sent successfully' 
      });
    } catch (error) {
      console.error('Error sending system notification:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error sending system notification' 
      });
    }
  },

  // Add rejectWork function
  rejectWork: async (req, res) => {
    try {
      const { contractId } = req.params;
      const { rejectionReason, transactionHash } = req.body;

      if (!rejectionReason) {
        return res.status(400).json({
          success: false,
          message: 'Rejection reason is required'
        });
      }

      // Find the contract
      const contract = await Contract.findById(contractId)
        .populate('client', 'name email walletAddress')
        .populate('freelancer', 'name email walletAddress')
        .populate('job', 'title description');

      if (!contract) {
        return res.status(404).json({
          success: false,
          message: 'Contract not found'
        });
      }

      // Update contract status and add rejection details
      contract.status = 'WorkRejected';
      contract.rejectionDetails = {
        reason: rejectionReason,
        rejectedAt: new Date(),
        transactionHash
      };

      await contract.save();

      // Send notification to freelancer
      await Notification.create({
        recipient: contract.freelancer._id,
        sender: contract.client._id,
        type: 'work_rejected',
        content: `Your work for "${contract.job.title}" has been rejected. Reason: ${rejectionReason}`,
        link: `/contracts/${contract._id}`
      });

      res.json({
        success: true,
        message: 'Work rejected successfully',
        contract
      });
    } catch (error) {
      console.error('Error rejecting work:', error);
      res.status(500).json({
        success: false,
        message: 'Error rejecting work',
        error: error.message
      });
    }
  }
}; 

module.exports = adminController; 