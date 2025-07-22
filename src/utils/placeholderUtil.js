// Utility function to create placeholder images
export const createPlaceholderUrl = (width, height, text = null, bgColor = '0f172a', textColor = 'ffffff') => {
  const textParam = text ? `&text=${encodeURIComponent(text)}` : '';
  return `https://via.placeholder.com/${width}x${height}/${bgColor}/${textColor}${textParam}`;
};