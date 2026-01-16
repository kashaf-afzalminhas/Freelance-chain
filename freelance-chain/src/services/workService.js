// src/services/workService.js
import { api } from './api';

export const submitWork = async (data) => {
  const response = await api.post('/work', data);
  return response.data;
};

export const approveWork = async (submissionId) => {
  const response = await api.post(`/work/${submissionId}/approve`);
  return response.data;
};

export const rejectWork = async (submissionId) => {
  const response = await api.post(`/work/${submissionId}/reject`);
  return response.data;
};

// Export as a single object (optional)
export const workService = {
  submitWork,
  approveWork,
  rejectWork,
};