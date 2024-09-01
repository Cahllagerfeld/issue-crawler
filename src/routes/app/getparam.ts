// getparam.ts
export function para(): string[] {
    if (typeof window !== 'undefined') {
      // Extract query parameters from the URL
      const urlParams = new URLSearchParams(window.location.search);
      const filter = urlParams.get('filter');
  
      if (filter) {
        // Decode URL-encoded string
        const decodedFilter = decodeURIComponent(filter);
        const arr = decodedFilter.split(',');
        console.log(arr);
        return arr;
      }
    }
  
    // Return an empty array if no valid parameters are found
    return [];
  }
  