import React from 'react';

class ProfileErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h2>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ProfileErrorBoundary;
