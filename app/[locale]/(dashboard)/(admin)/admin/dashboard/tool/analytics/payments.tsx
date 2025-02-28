'use client';
import React, { useEffect, useRef, useState } from 'react';
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, BarChart, Line } from 'recharts';

export default function ChartPlatform({data}:any) {
  const myDivRef = useRef(null);
  const [divWidth, setDivWidth] = useState(0);

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        setDivWidth(entry.contentRect.width);
      }
    });

    if (myDivRef.current) {
      observer.observe(myDivRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [divWidth]);

  const CustomTooltip = ({ active, payload, colors }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0];
      return (
        <div className="dark:bg-zinc-900 bg-white p-4 rounded-md flex flex-col gap-y-1 border border-slate-300 dark:border-zinc-700">
          <p className='text-zinc-800 dark:text-slate-200 text-sm font-medium'>{`${dataPoint.payload.name}`}</p>
            <div className='flex flex-col gap-y-0'>
              {payload.map((dataPoint: any, index: number) => (
                <p key={index} className={`text-sm text-[${dataPoint.stroke}]`} style={{ color: colors[dataPoint.dataKey] }}>{`${dataPoint.dataKey}: ${dataPoint.value}`}</p>
              ))}
            </div>
        </div>
      );
    }

    return null;
  };
  const colors = {
    pending: "#f97316",
    succeeded: "#10b981",
    canceled: "#ef4444",
  };

  return (
    <div className="w-full h-fit" ref={myDivRef}>
    <LineChart width={divWidth-32} height={240} data={data}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} />
      <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: '12px' }} />
      <YAxis tick={{ fill: '#6b7280', fontSize: '12px' }} />
      <Tooltip content={({ active, payload, label }) => <CustomTooltip active={active} payload={payload} colors={colors} />} />
      <Legend />
      <Line type="monotone" dataKey="pending" stroke="#f97316" />
      <Line type="monotone" dataKey="succeeded" stroke="#10b981" />
      <Line type="monotone" dataKey="canceled" stroke="#ef4444" />
    </LineChart>
  </div>
  );
}