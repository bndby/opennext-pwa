'use client';

import { useAddToHomescreenPrompt } from '@/hooks/useAddToHomescreenPrompt';
import { useEffect, useState } from 'react';

export default function InstallPWAButton() {
  const [prompt, promptToInstall] = useAddToHomescreenPrompt();
  const [isVisible, setVisibleState] = useState(false);

  console.log('>>>>>>> prompt', prompt)

  const hide = () => setVisibleState(false);

  useEffect(
    () => {
      if (prompt) {
        setVisibleState(true);
      }
    },
    [prompt]
  );

  if (!isVisible) {
    return <div />;
  }

  return (
    <div onClick={hide}>
      <button onClick={hide}>Close</button>
      Hello! Wanna add to homescreen?
      <button onClick={promptToInstall}>Add to homescreen</button>
    </div>
  );
}