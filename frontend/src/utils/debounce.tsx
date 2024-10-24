const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout | undefined;
  return (...args: any[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export default debounce;