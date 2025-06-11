const Bid = require('../models/Bid');

exports.getBidDetails = async (bidId) => {
    try {
        const bid = await Bid.findById(bidId)
            .populate('freelancer', 'name walletAddress')
            .populate('job', 'title description');
        if (!bid) {
            throw new Error('Bid not found');
        }
        return bid;
    } catch (error) {
        throw error;
    }
};

exports.createBid = async (bidData) => {
    try {
        const bid = new Bid(bidData);
        await bid.save();
        return bid;
    } catch (error) {
        throw error;
    }
};

exports.updateBidStatus = async (bidId, updateData) => {
    try {
        const bid = await Bid.findByIdAndUpdate(
            bidId,
            updateData,
            { new: true, runValidators: true }
        );
        if (!bid) {
            throw new Error('Bid not found');
        }
        return bid;
    } catch (error) {
        throw error;
    }
};

exports.getBidsByJob = async (jobId) => {
    try {
        const bids = await Bid.find({ job: jobId })
            .populate('freelancer', 'name walletAddress')
            .sort({ createdAt: -1 });
        return bids;
    } catch (error) {
        throw error;
    }
};

exports.getBidsByFreelancer = async (freelancerId) => {
    try {
        const bids = await Bid.find({ freelancer: freelancerId })
            .populate('job', 'title description')
            .sort({ createdAt: -1 });
        return bids;
    } catch (error) {
        throw error;
    }
}; 