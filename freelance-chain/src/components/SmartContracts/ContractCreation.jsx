import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { initWeb3, createContract } from '../services/web3Service';
import api from '../services/api';

const ContractCreation = ({ job, bid, onContractCreated }) => {
  const [web3, setWeb3] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const initialize = async () => {
      try {
        const web3 = await initWeb3();
        setWeb3(web3);
      } catch (err) {
        setError('Failed to connect to MetaMask');
      }
    };
    
    initialize();
  }, []);
  
  const formik = useFormik({
    initialValues: {
      milestones: job.milestones || []
    },
    validationSchema: Yup.object({
      milestones: Yup.array().of(
        Yup.object().shape({
          description: Yup.string().required('Required'),
          amount: Yup.number().positive('Must be positive').required('Required'),
          deadline: Yup.date().min(new Date(), 'Must be in the future').required('Required')
        })
      )
    }),
    onSubmit: async (values) => {
      try {
        const totalAmount = values.milestones.reduce((sum, m) => sum + m.amount, 0);
        
        // Create contract on blockchain
        const contractAddress = await createContract(
          bid.freelancer.walletAddress,
          values.milestones,
          totalAmount,
          web3.signer
        );
        
        // Save reference in backend
        const response = await api.post('/contracts', {
          jobId: job._id,
          bidId: bid._id,
          contractAddress,
          milestones: values.milestones
        });
        
        onContractCreated(response.data);
        
      } catch (err) {
        console.error('Contract creation failed:', err);
        setError('Failed to create contract');
      }
    }
  });
  
  return (
    <div className="contract-creation">
      <h2>Create Smart Contract</h2>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={formik.handleSubmit}>
        <div className="milestones">
          {formik.values.milestones.map((milestone, index) => (
            <div key={index} className="milestone">
              <h3>Milestone {index + 1}</h3>
              
              <div>
                <label>Description</label>
                <input
                  name={`milestones[${index}].description`}
                  value={milestone.description}
                  onChange={formik.handleChange}
                />
                {formik.errors.milestones?.[index]?.description && (
                  <div>{formik.errors.milestones[index].description}</div>
                )}
              </div>
              
              {/* Similar fields for amount, deadline */}
            </div>
          ))}
        </div>
        
        <button type="submit" disabled={!web3 || formik.isSubmitting}>
          {formik.isSubmitting ? 'Creating...' : 'Create Contract'}
        </button>
      </form>
    </div>
  );
};

export default ContractCreation;