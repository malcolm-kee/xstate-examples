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

const tooltipMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBcD2qA2yCWAHAdABbYQRgB2AxALIDyAqgMoCiA+swHIAqzASqwEEOAYQAStXgG0ADAF1EoXKljYcqcgpAAPRAFYAbAEZ80gCwBOU6YBMADkNXTu3QBoQAT0T38pgOznDIwNrAGZfEOlrAF8otzRMHAJYQlQAdyo6JjYAGWYBADU2ITEJGXkkECUVNQ0KnQRrMxNzfRDdX10Qo3NzX2s3TwRdaWNzWyszcfMI218YuPQsPHxktIyGFlZcgrYuWlpsrgBJAAUyzSrVbHVNesbffENba2sWkMNrfWlfU30BxDa0nwummfV8tnMzlsIXmIHiSySKXSNA2bGE2SOwgA0oIROIpHILsorjc6nojCYLFY7A4rM5-ghTCMTO1XrZhvo7NZdLD4YkVkjsOQoCisls8oVcSUCeVFMSardEI1rPhXpZoVCWuz+h4lZFVYZpOZXjZ2V0urzFvzVqkhSLMpt0ZiccV8ecKpcFWSGvq1aYNboIfptQzuSr9D9frpAtJbK1LQllja7ZQtLBkABDZBgfAZgBm2YATgAKTg8fgAEWY2QEAE0AJSUPlJwXC91y6rXWqgO6+nr+tqBrW6HWDCIhR5hYfSIyvaKxOFW5bECAph1sMt8KVuwke+VdxU+lV+gNBkO6xnM6SssYcrk8hfNggrteo9jcLd7A7HM67jsk7ttD1Y9+1PYdR0QJxjBHWMQhsEI4yNecFkTZ8SFfMUnWxbdSj-Sp91JHtgNVUDBzPEcGWcFUrH8JlA0CNpTATBEiHQ4VU3TLMc3zIti22SUqxrBsmyXNDVzbPDPQPb1lRI9UyPAhkvhVAJDGjQxDGNEI2hiBdyFQMh4AqJ8iU7QigIQABaP4L2s5j+RXMhAKk8z6meB5aNCWxnj8F5XAvblzEeawLF0KxNPBY17JbNZTIAw8nCCswbH8AxjScToGSZaDqV8fRTECfRozCaLETSO04q9IjGQghBjRMQwIkaqxOSedpStY8SoEq6TqsDfAQhpRpzGvJkqVMBlzXwDpnHCaxGuCcxdKiIA */
  createMachine(
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
