import { useMachine } from '@xstate/react';
import * as React from 'react';
import { createMachine } from 'xstate';
import { Button } from '../components/button';

export const TooltipExample = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="prose mb-12">
        <h1>Tooltip</h1>
        <h2>Instructions</h2>
        <p>Enhance the tooltip as specified:</p>
        <ol>
          <li>When button is clicked, the tooltip should be hidden.</li>
          <li>
            When mouse hover the button, wait for 0.5s before show the tooltip.
          </li>
          <li>
            When mouse leave the button or tooltip, wait for 1s before hide the
            tooltip.
          </li>
          <li>When mouse hover the tooltip, keep it visible.</li>
        </ol>
      </div>
      <div className="flex items-end gap-3">
        <Tooltip />
        <TooltipAlt />
      </div>
    </div>
  );
};

const Tooltip = () => {
  const [isShown, setIsShown] = React.useState(false);

  return (
    <div className="relative inline-block">
      <Button
        onMouseEnter={() => setIsShown(true)}
        onMouseLeave={() => setIsShown(false)}
      >
        button
      </Button>
      {isShown && (
        <div className="absolute top-full left-0 p-3 shadow mt-px bg-white">
          <p>Some tooltip content that is not essential</p>
        </div>
      )}
    </div>
  );
};

const TooltipAlt = () => {
  return (
    <div className="relative inline-block">
      <Button>button</Button>
      {false && (
        <div className="absolute top-full left-0 p-3 shadow mt-px bg-white">
          <p>Some tooltip content that is not essential</p>
        </div>
      )}
    </div>
  );
};
