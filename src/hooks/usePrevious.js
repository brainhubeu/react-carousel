import { useEffect, useRef } from '../../docs-www/node_modules/react/index';

const usePrevious = value => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};

export default usePrevious;
