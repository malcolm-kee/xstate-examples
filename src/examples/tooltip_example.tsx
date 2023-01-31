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

type TooltipState = 'hidden' | 'showing' | 'shown' | 'hiding';

const Tooltip = () => {
  const [tooltipState, setTooltipState] =
    React.useState<TooltipState>('hidden');

  React.useEffect(() => {
    if (tooltipState === 'showing') {
      const timer = window.setTimeout(() => setTooltipState('shown'), 500);

      return () => window.clearTimeout(timer);
    }
  }, [tooltipState]);

  React.useEffect(() => {
    if (tooltipState === 'hiding') {
      const timer = window.setTimeout(() => setTooltipState('hidden'), 1000);

      return () => window.clearTimeout(timer);
    }
  }, [tooltipState]);

  return (
    <div className="relative inline-block">
      <Button
        onMouseEnter={() => setTooltipState('showing')}
        onMouseLeave={() => setTooltipState('hiding')}
        onFocus={() => setTooltipState('shown')}
        onBlur={() => setTooltipState('hidden')}
        onClick={() => setTooltipState('hidden')}
      >
        button
      </Button>
      {(tooltipState === 'shown' || tooltipState === 'hiding') && (
        <div
          onMouseEnter={() => setTooltipState('shown')}
          onMouseLeave={() => setTooltipState('hiding')}
          className="absolute top-full left-0 p-3 shadow mt-px bg-white"
        >
          <p>Some tooltip content that is not essential</p>
        </div>
      )}
    </div>
  );
};

const TooltipAlt = () => {
  const [currentState, send] = useMachine(tooltipMachine);

  return (
    <div className="relative inline-block">
      <Button
        onMouseEnter={() => {
          send('MOUSE_ENTER_TRIGGER');
        }}
        onMouseLeave={() => send('MOUSE_LEAVE_TRIGGER')}
        onFocus={() => send('TRIGGER_FOCUSED')}
        onBlur={() => send('TRIGGER_BLURRED')}
        onClick={() => send('MOUSE_CLICK_TRIGGER')}
      >
        button
      </Button>
      {(currentState.matches('shown') || currentState.matches('hiding')) && (
        <div
          onMouseEnter={() => send('MOUSE_ENTER_TOOLTIP')}
          onMouseLeave={() => send('MOUSE_LEAVE_TOOLTIP')}
          className="absolute top-full left-0 p-3 shadow mt-px bg-white"
        >
          <p>Some tooltip content that is not essential</p>
        </div>
      )}
    </div>
  );
};

const tooltipMachine = createMachine(
  {
    id: 'tooltip',
    initial: 'hidden',
    states: {
      hidden: {
        on: {
          MOUSE_ENTER_TRIGGER: {
            target: 'showing',
          },
          TRIGGER_FOCUSED: {
            target: 'shown',
          },
        },
      },
      shown: {
        on: {
          MOUSE_LEAVE_TRIGGER: {
            target: 'hiding',
          },
          MOUSE_LEAVE_TOOLTIP: {
            target: 'hiding',
          },
          MOUSE_CLICK_TRIGGER: {
            target: 'hidden',
          },
          TRIGGER_BLURRED: {
            target: 'hidden',
          },
        },
      },
      showing: {
        after: {
          ENTER_DELAY: {
            target: '#tooltip.shown',
            actions: [],
            internal: false,
          },
        },
        on: {
          MOUSE_LEAVE_TRIGGER: {
            target: 'hidden',
          },
          MOUSE_CLICK_TRIGGER: {
            target: 'hidden',
          },
        },
      },
      hiding: {
        after: {
          LEAVE_DELAY: {
            target: '#tooltip.hidden',
            actions: [],
            internal: false,
          },
        },
        on: {
          MOUSE_ENTER_TRIGGER: {
            target: 'shown',
          },
          MOUSE_ENTER_TOOLTIP: {
            target: 'shown',
          },
          MOUSE_CLICK_TRIGGER: {
            target: 'hidden',
          },
        },
      },
    },
    schema: {
      context: {} as {},
      events: {} as
        | { type: 'MOUSE_LEAVE_TRIGGER' }
        | { type: 'MOUSE_ENTER_TRIGGER' }
        | { type: 'TRIGGER_FOCUSED' }
        | { type: 'TRIGGER_BLURRED' }
        | { type: 'MOUSE_ENTER_TOOLTIP' }
        | { type: 'MOUSE_LEAVE_TOOLTIP' }
        | { type: 'MOUSE_CLICK_TRIGGER' },
    },
    context: {},
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    delays: {
      ENTER_DELAY: 500,
      LEAVE_DELAY: 1000,
    },
  }
);
