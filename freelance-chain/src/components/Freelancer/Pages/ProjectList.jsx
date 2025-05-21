import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [isOwner, setIsOwner] = useState(false);

  const handleDelete = (projectId) => {
    // Implement the delete logic here
  };

  return (
    <div className="flex items-center space-x-4">
      <Link
        to={`/projects/${project._id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
      >
        View Project
      </Link>
      {isOwner && (
        <>
          <Link
            to={`/projects/${project._id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Edit
          </Link>
          <button
            onClick={() => handleDelete(project._id)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            Delete
          </button>
        </>
      )}
    </div>
  );
};

export default ProjectList; 