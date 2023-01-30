import * as React from 'react';

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<'button'>
>(function Button(props, forwardedRef) {
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex justify-center items-center text-lg px-3 py-1 min-w-[100px] bg-rose-600 text-white rounded-sm active:bg-rose-700 ${
        props.className || ''
      }`}
      ref={forwardedRef}
    />
  );
});
