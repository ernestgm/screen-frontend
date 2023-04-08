import { createStore } from 'zustand';

const useApiHandlerStore = (apiHandlerClass) => {
  console.log(apiHandlerClass);
  return createStore(() => apiHandlerClass);
};

export default useApiHandlerStore;
