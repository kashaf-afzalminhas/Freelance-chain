const Job = require('../models/Job');

exports.getJobById = async (jobId) => {
    try {
        const job = await Job.findById(jobId);
        if (!job) {
            throw new Error('Job not found');
        }
        return job;
    } catch (error) {
        throw error;
    }
};

exports.createJob = async (jobData) => {
    try {
        const job = new Job(jobData);
        await job.save();
        return job;
    } catch (error) {
        throw error;
    }
};

exports.updateJob = async (jobId, updateData) => {
    try {
        const job = await Job.findByIdAndUpdate(
            jobId,
            updateData,
            { new: true, runValidators: true }
        );
        if (!job) {
            throw new Error('Job not found');
        }
        return job;
    } catch (error) {
        throw error;
    }
};

exports.deleteJob = async (jobId) => {
    try {
        const job = await Job.findByIdAndDelete(jobId);
        if (!job) {
            throw new Error('Job not found');
        }
        return job;
    } catch (error) {
        throw error;
    }
};

exports.getAllJobs = async (filters = {}) => {
    try {
        const jobs = await Job.find(filters)
            .populate('client', 'name email')
            .sort({ createdAt: -1 });
        return jobs;
    } catch (error) {
        throw error;
    }
}; 