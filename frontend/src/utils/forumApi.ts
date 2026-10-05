import axios from 'axios';

// Base API URL
const getApiBaseUrl = () => import.meta.env.VITE_API_URL;

// Helper to build URLs with appropriate query parameters
export const buildApiUrl = (endpoint: string, queryParams: Record<string, string | number | undefined> = {}) => {
  const baseUrl = new URL(endpoint, getApiBaseUrl()).toString();
  
  // Filter out undefined values
  const filteredParams = Object.entries(queryParams)
    .filter(([_, value]) => value !== undefined)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  
  // If no params, return the base URL
  if (Object.keys(filteredParams).length === 0) {
    return baseUrl;
  }
  
  // Otherwise, append the params
  const queryString = new URLSearchParams(
    Object.entries(filteredParams).map(([key, value]) => [key, String(value)])
  ).toString();
  
  return `${baseUrl}?${queryString}`;
};

interface ApiResponse<T> {
  items?: T[];
  total?: number;
  page?: number;
  size?: number;
  pages?: number;
}

// Comments API functions
export const fetchComments = async <T>(
  postId: string, 
  page: number, 
  size: number = 10
): Promise<ApiResponse<T>> => {
  const apiUrl = buildApiUrl(`/forum/posts/${postId}/comments`, { page, size });
  
  const response = await axios.get(apiUrl, {
    headers: { 'Content-Type': 'application/json' }
  });
  
  return response.data;
};

export const createComment = async (
  postId: string, 
  content: string, 
  userId: string
) => {
  const apiUrl = buildApiUrl(`/forum/posts/${postId}/comments`, { user_id: userId });
  
  const response = await axios.post(
    apiUrl,
    { content },
    { headers: { 'Content-Type': 'application/json' } }
  );
  
  return response.data;
};

export const deleteComment = async (commentId: string, userId: string) => {
  const apiUrl = buildApiUrl(`/forum/comments/${commentId}`, { user_id: userId });
  
  const response = await axios.delete(apiUrl, {
    headers: { 'Content-Type': 'application/json' }
  });
  
  return response.data;
};

// Format date helper
export const formatDate = (dateString: string, includeTime: boolean = false) => {
  const date = new Date(dateString);
  
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return date.toLocaleDateString('en-US', options);
};
