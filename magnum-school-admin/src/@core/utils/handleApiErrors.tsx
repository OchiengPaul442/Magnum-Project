// Helper function to handle API errors
export const handleApiError = (error: any): never => {
  if (error.response && error.response.data) {
    throw new Error(error.response.data.message || 'An error occurred.');
  } else {
    throw new Error('An unexpected error occurred.');
  }
};
