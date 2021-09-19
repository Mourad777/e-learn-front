export const getTestRecources = (test, section) => {
  let index;
  if (section === "mc") index = 0;
  if (section === "essay") index = 1;
  if (section === "speaking") index = 2;
  if (section === "fillblanks") index = 3;
  if (section === "test") index = 4;
  const audioMaterials = ((test || {}).audioMaterials || [])[index] || {};
  const readingMaterials = ((test || {}).readingMaterials || [])[index] || {};
  const videoMaterials = ((test || {}).videoMaterials || [])[index] || {};
  return {
    audioMaterials,
    readingMaterials,
    videoMaterials,
  };
};
