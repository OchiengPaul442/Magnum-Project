export const slugifyStudentName = (name: string = ''): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '');
};

// Helper function to handle API errors
export const handleApiError = (error: any): never => {
  if (error.response && error.response.data) {
    throw new Error(error.response.data.message || 'An error occurred.');
  } else {
    throw new Error('An unexpected error occurred.');
  }
};
