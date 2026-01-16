import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { projectService } from '../../../services/api';

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectService.getMyProjects();
        setProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleDelete = (projectId) => {
    setProjectToDelete(projectId);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    
    setDeleteLoading(true);
    try {
      await projectService.deleteProject(projectToDelete);
      setProjects(prev => prev.filter(p => p._id !== projectToDelete));
      setProjectToDelete(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProjects = projects.filter(project => 
    filter === 'all' || project.status === filter
  );

  if (loading) {
    return <div className="text-center py-12">Loading your projects...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
            <p className="mt-2 text-sm text-gray-600">Manage and track your projects</p>
          </div>
          <Link
            to="/createproject"
            className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
          >
            Create New Project
          </Link>
        </div>

        <div className="mb-8">
          <div className="flex space-x-4">
            {['all', 'active', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-md ${
                  filter === status
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500 text-lg mb-4">No projects found</p>
              <Link
                to="/createproject"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
              >
                Create Your First Project
              </Link>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div key={project._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {project.media && project.media.length > 0 ? (
                  <div className="h-48 overflow-hidden">
                    {project.media[0].type === 'image' ? (
                      <img
                        src={`${import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000'}${project.media[0].url}`}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTQgMTZMMTAgMTBMMTYgMTZNMjAgMTZMMTYgMTJMMjAgOE0yMCAyMEg0VjRIMjBWMjBaIiBzdHJva2U9IiM5Q0E0QjkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+';
                        }}
                      />
                    ) : project.media[0].type === 'video' ? (
                      <video
                        src={`${import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000'}${project.media[0].url}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-48 bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-500">No Media</span>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">{project.title}</h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-medium mr-2">Price:</span>
                      <span>${project.price}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-medium mr-2">Created:</span>
                      <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <Link
                      to={`/projects/${project._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      View Project
                    </Link>
                    <div className="flex space-x-4">
                      <Link
                        to={`/editproject/${project._id}`}
                        className="text-green-600 hover:text-green-800 font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(project._id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Project</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this project? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setProjectToDelete(null)}
                disabled={deleteLoading}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProjects;