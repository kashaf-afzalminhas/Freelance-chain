import React, { useState } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { workService  } from '../../services/workService';

const WorkSubmission = ({ contract }) => {
    const { account } = useWeb3();
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!file) {
            setError('Please upload your work file');
            return;
        }

        try {
            setIsSubmitting(true);
            setError('');
            
            // Upload file to IPFS or similar
            const fileHash = await uploadToIPFS(file);
            
            // Submit to backend
            await workService.submitWork({
                contractId: contract._id,
                workDescription: description,
                fileHash
            });

            setSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (account !== contract.freelancer.walletAddress) {
        return (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-700">Only the freelancer can submit work for this contract</p>
            </div>
        );
    }

    if (contract.status === 'completed') {
        return (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700">This contract has been completed</p>
            </div>
        );
    }

    if (success) {
        return (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700">Work submitted successfully!</p>
            </div>
        );
    }

    return (
        <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Submit Your Work</h3>
            
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Work Description
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        rows={4}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload Work Files
                    </label>
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-primary file:text-white
                            hover:file:bg-opacity-90"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 disabled:opacity-70"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Work'}
                </button>
            </form>
        </div>
    );
};

export default WorkSubmission;