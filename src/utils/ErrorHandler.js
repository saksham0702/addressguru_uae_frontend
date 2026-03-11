export const handleApiError = (error) => {
  if (error.response) {
    return error.response.data?.message || "Server error occurred";
  } else if (error.request) {
    return "Network error. Please check your connection.";
  } else {
    return error.message || "Unexpected error occurred";
  }
};
