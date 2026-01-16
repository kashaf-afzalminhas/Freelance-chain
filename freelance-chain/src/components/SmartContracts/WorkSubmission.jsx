import React, { useState } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { workService } from '../../services/workService';
import { uploadToIPFS, downloadWorkSubmission } from '../../services/ipfsService';
import { toast } from 'react-hot-toast';
import { submitWorkOnChain } from '../../services/ContractOnChainService';
import { Upload, FileText, AlertCircle, Download } from 'lucide-react';

const getBackendFileUrl = (hash) => {
    const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000';
    return `${API_URL}/api/ipfs/download/${encodeURIComponent(hash)}`;
};

const WorkSubmission = ({ contract }) => {
    const { account, signer, provider } = useWeb3();
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
        }
    };

    const handleDownloadWork = () => {
        const hash = contract.blockchainState?.workSubmissionHash || contract.workHash;
        if (!hash) {
            toast.error('No work file available');
            return;
        }
        const url = getBackendFileUrl(hash);
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!file) {
            toast.error('Please select a file to submit.');
            return;
        }

        if (!description.trim()) {
            toast.error('Please provide a work description.');
            return;
        }

        if (!signer || !provider) {
            toast.error('Please connect your wallet first.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // 1. Upload the work file to IPFS
            console.log('Uploading file to IPFS...');
            const workHash = await uploadToIPFS(file);
            console.log('File uploaded to IPFS, received hash:', workHash);

            if (!workHash) {
                throw new Error('IPFS upload failed: No hash received.');
            }

            console.log('Attempting to submit work:', { contractId: contract.contractId, workHash });

            // 1. Submit work on chain using the frontend signer
            console.log('Submitting work on chain...');
            const onChainResult = await submitWorkOnChain(contract.contractId, workHash, signer, provider);
            console.log('On-chain submission result:', onChainResult);

            if (!onChainResult.success) {
                throw new Error(onChainResult.error || 'On-chain work submission failed.');
            }

            // 2. If on-chain submission is successful, update the backend database
            console.log('On-chain submission successful. Updating backend database...');
            const response = await workService.submitWork({
                contractId: contract._id,
                workHash: workHash,
                description: description
            });

            console.log('Backend update response:', response);

            if (response.success) {
                toast.success('Work submitted successfully!');
                setSuccess(true);
                setDescription('');
                setFile(null);
                setFileName('');
            } else {
                console.error('Backend update failed after successful on-chain submission:', response.error);
                toast.error('Work submitted on chain, but failed to update database: ' + (response.error || 'Unknown error'));
                setError('Work submitted on chain, but failed to update database: ' + (response.error || 'Unknown error'));
            }

        } catch (err) {
            console.error('Error submitting work:', err);
            let errorMessage = 'An unexpected error occurred.';
            
            if (err.message && err.message.includes('on chain')) {
                errorMessage = err.message;
            } else if (err.response && err.response.data && err.response.data.error) {
                errorMessage = err.response.data.error;
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            toast.error('Error submitting work: ' + errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!account || !signer) {
        return (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                    <p className="text-yellow-700">Please connect your wallet to submit work</p>
                </div>
            </div>
        );
    }

    if (account !== contract.freelancer.walletAddress) {
        return (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-blue-600 mr-2" />
                    <p className="text-blue-700">Only the freelancer can submit work for this contract</p>
                </div>
            </div>
        );
    }

    if (contract.status === 'completed') {
        return (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-green-600 mr-2" />
                    <p className="text-green-700">This contract has been completed</p>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-green-600 mr-2" />
                    <p className="text-green-700">Work submitted successfully!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Submit Your Work</h3>
            
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2" />
                        {error}
                    </div>
                </div>
            )}

            {contract.workHash && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <FileText className="w-5 h-5 text-blue-600 mr-2" />
                            <span className="text-blue-700">Work has been submitted</span>
                        </div>
                        <button
                            onClick={handleDownloadWork}
                            disabled={loading}
                            className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                        </button>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Work Description
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                        rows={4}
                        placeholder="Describe the work you've completed..."
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload Work Files
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                                <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                                >
                                    <span>Upload a file</span>
                                    <input
                                        id="file-upload"
                                        name="file-upload"
                                        type="file"
                                        className="sr-only"
                                        onChange={handleFileChange}
                                        required
                                    />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                                ZIP, PDF, DOC, DOCX up to 10MB
                            </p>
                            {fileName && (
                                <div className="flex items-center justify-center mt-2">
                                    <FileText className="w-4 h-4 text-gray-400 mr-2" />
                                    <span className="text-sm text-gray-600">{fileName}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 disabled:opacity-70"
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                            Submitting...
                        </>
                    ) : (
                        'Submit Work'
                    )}
                </button>
            </form>
        </div>
    );
};

export default WorkSubmission;