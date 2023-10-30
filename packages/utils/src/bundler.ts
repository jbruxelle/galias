export const isVite = () => {
  // @ts-ignore
  if (import.meta.env) {
    return true;
  }
  return false;
};
