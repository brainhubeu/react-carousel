import { useEffect, useState } from 'react';

import useEventListener from './useEventListener';

const useTransition = (ref, value) => {
  const [transitionEnabled, setTransitionEnabled] = useState(false);

  useEffect(() => {
    setTransitionEnabled(true);
  }, [value]);

  /**
   * Handler setting transitionEnabled value in state to false after transition animation ends
   */
  const onTransitionEnd = () => {
    setTransitionEnabled(true);
  };

  useEventListener('transitionend', onTransitionEnd, ref.current);

  return transitionEnabled;
};

export default useTransition;
