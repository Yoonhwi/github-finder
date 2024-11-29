export const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${year}년 ${month}월 ${day}일`;
};

export const removeElChild = (el) => {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
};

export const withWrapping = (fn, onStart, onEnd) => {
  return async (...args) => {
    onStart?.();
    const response = await fn(...args);
    onEnd?.();
    return response;
  };
};

export const withErrorHandle = (fn, onError) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      onError?.(error);
    }
  };
};
