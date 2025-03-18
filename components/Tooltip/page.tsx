"use client"
import { FC, JSX, ReactNode, useRef } from "react";

interface Props {
  children: ReactNode;
  tooltip?: string;
}

const ToolTip: FC<Props>= ({ children, tooltip }): JSX.Element => {
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const container = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={container}
      className="group relative flex items-center justify-center"
    >
      {children}
      {tooltip ? (
        <span
          ref={tooltipRef}
          className="z-10 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition dark:bg-zinc-900 bg-white flex flex-col gap-y-1 border border-slate-300 dark:border-zinc-700 p-2 rounded-md absolute top-full mt-2 dark:text-slate-200 whitespace-nowrap"
        >
          {tooltip}
        </span>
      ) : null}
    </div>
  );
};

export default ToolTip;