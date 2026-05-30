let shouldReconnect = false;

export const wsManager = {
  allowReconnect: () => (shouldReconnect = true),
  blockReconnect: () => (shouldReconnect = false),
  getShouldReconnect: () => shouldReconnect,
};
