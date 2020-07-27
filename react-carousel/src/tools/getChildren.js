const getChildren = (children, slides) => {
  if (!children) {
    if (slides) {
      return slides;
    }
    return [];
  }
  if (Array.isArray(children)) {
    return children;
  }
  return [children];
};

export default getChildren;
