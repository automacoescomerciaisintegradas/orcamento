export const getApiUrl = (path: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  // Ensure we don't have double slashes if baseUrl ends with /
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  const separator = baseUrl.endsWith('/') ? '' : '/';
  
  // If no baseUrl is provided, return the path as is (relative)
  if (!baseUrl) return path;
  
  return `${baseUrl}${separator}${cleanPath}`;
};
