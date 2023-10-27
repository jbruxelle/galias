export const isVite = () => {
  if (process.env["npm_package_devDependencies_vite"]) {
    return true;
  }
  if (process.env["npm_package_dependencies_vite"]) {
    return true;
  }
  return false;
};
