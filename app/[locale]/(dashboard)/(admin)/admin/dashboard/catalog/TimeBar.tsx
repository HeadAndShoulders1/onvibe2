export function TimeBar({ sampleBeginTimeOffsetMs, sampleEndTimeOffsetMs, durationMs }: any) {
  const beginPosition = (sampleBeginTimeOffsetMs / durationMs) * 100;
  const endPosition = (sampleEndTimeOffsetMs / durationMs) * 100;

  return (
    <div className="w-full h-3 bg-slate-300 dark:bg-zinc-800 relative rounded-md">
      <div className="w-full h-full bg-slate-300 dark:bg-zinc-800 absolute top-0 left-0 rounded-md"></div>
      <div className="absolute top-0 left-0 bg-indigo-600 h-full rounded-md" style={{ width: `${endPosition - beginPosition}%`, marginLeft: `${beginPosition}%` }}></div>
    </div>
  );
};

