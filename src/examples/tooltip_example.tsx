import { useMachine } from '@xstate/react';
import * as React from 'react';
import { createMachine } from 'xstate';
import { Button } from '../components/button';

export const TooltipExample = () => {
  return (
    <div className="flex items-end gap-3">
      <InitialImpl />
      <FinalImpl />
      <StateImpl />
    </div>
  );
};

const InitialImpl = () => {
  const [tooltipShown, setTooltipShown] = React.useState(false);

  return (
    <div className="relative inline-block">
      <Button
        onFocus={() => setTooltipShown(true)}
        onBlur={() => setTooltipShown(false)}
        onMouseEnter={() => setTooltipShown(true)}
        onMouseLeave={() => setTooltipShown(false)}
      >
        Button
      </Button>
      {tooltipShown && (
        <div className="absolute top-full left-0 p-3 shadow mt-1">
          <p>Some tooltip content that is not essential</p>
        </div>
      )}
    </div>
  );
};

type TooltipState = 'hidden' | 'showing' | 'shown' | 'hiding';

const FinalImpl = () => {
  const [tooltipState, setTooltipState] =
    React.useState<TooltipState>('hidden');

  React.useEffect(() => {
    if (tooltipState === 'showing') {
      const timer = window.setTimeout(() => setTooltipState('shown'), 400);

      return () => window.clearTimeout(timer);
    }
  }, [tooltipState]);

  React.useEffect(() => {
    if (tooltipState === 'hiding') {
      const timer = window.setTimeout(() => setTooltipState('hidden'), 600);

      return () => window.clearTimeout(timer);
    }
  }, [tooltipState]);

  return (
    <div>
      <div>{tooltipState}</div>
      <div className="relative">
        <Button
          onMouseEnter={() => setTooltipState('showing')}
          onMouseLeave={() => setTooltipState('hiding')}
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
    </div>
  );
};

const StateImpl = () => {
  const [currentState, send] = useMachine(tooltipMachine);

  return (
    <div>
      <div>{currentState.toStrings().join('.')}</div>
      <div className="relative">
        <Button
          onMouseEnter={() => {
            send('MOUSE_ENTER_ANCHOR');
          }}
          onMouseLeave={() => send('MOUSE_LEAVE_ANCHOR')}
          onClick={() => send('MOUSE_CLICK_ANCHOR')}
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
          MOUSE_ENTER_ANCHOR: {
            target: 'showing',
          },
        },
      },
      shown: {
        on: {
          MOUSE_LEAVE_ANCHOR: {
            target: 'hiding',
          },
          MOUSE_LEAVE_TOOLTIP: {
            target: 'hiding',
          },
          MOUSE_CLICK_ANCHOR: {
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
          MOUSE_LEAVE_ANCHOR: {
            target: 'hidden',
          },
          MOUSE_CLICK_ANCHOR: {
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
          MOUSE_ENTER_ANCHOR: {
            target: 'shown',
          },
          MOUSE_ENTER_TOOLTIP: {
            target: 'shown',
          },
          MOUSE_CLICK_ANCHOR: {
            target: 'hidden',
          },
        },
      },
    },
    schema: {
      context: {} as {},
      events: {} as
        | { type: 'MOUSE_LEAVE_ANCHOR' }
        | { type: 'MOUSE_ENTER_ANCHOR' }
        | { type: 'MOUSE_ENTER_TOOLTIP' }
        | { type: 'MOUSE_LEAVE_TOOLTIP' }
        | { type: 'MOUSE_CLICK_ANCHOR' },
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
