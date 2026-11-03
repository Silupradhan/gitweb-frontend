'use client';

import React, { useState } from 'react';

interface EventsLineChartProps {
  data: Array<{ date: string; count: number }>;
}

export default function EventsLineChart({ data }: EventsLineChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{ date: string; count: number } | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 flex flex-col items-center justify-center min-h-[300px] text-center">
        <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center mb-3">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        </div>
        <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
          No Event Activity Recorded
        </h4>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 max-w-sm">
          There are no events recorded in this time range. Pushing commits or triggering webhooks will populate this chart.
        </p>
      </div>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count), 5);
  const width = 600;
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;
  const graphWidth = width - paddingX * 2;
  const graphHeight = height - paddingY * 2;

  const points = data.map((d, index) => {
    const x =
      data.length === 1
        ? width / 2
        : paddingX + (index / (data.length - 1)) * graphWidth;
    const y = paddingY + graphHeight - (d.count / maxCount) * graphHeight;
    return { x, y, date: d.date, count: d.count };
  });

  const pathD = points.reduce((acc, point, i) => {
    return i === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, '');

  const areaD =
    points.length > 0
      ? `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
      : '';

  // Generate Y-axis grid ticks
  const yTicks = [0, Math.round(maxCount / 2), maxCount];

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            Event Frequency
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Daily event volume over time (FR-8.3)
          </p>
        </div>
        {hoveredPoint && (
          <div className="text-xs px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900">
            <span className="font-semibold">{hoveredPoint.count} event{hoveredPoint.count === 1 ? '' : 's'}</span> on {hoveredPoint.date}
          </div>
        )}
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[480px]"
          onMouseLeave={() => setHoveredPoint(null)}
        >
          <defs>
            <linearGradient id="eventLineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {yTicks.map((tick) => {
            const y = paddingY + graphHeight - (tick / maxCount) * graphHeight;
            return (
              <g key={tick}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="currentColor"
                  className="text-zinc-100 dark:text-zinc-800"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 10}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[10px] fill-zinc-400 font-mono"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          {areaD && <path d={areaD} fill="url(#eventLineGradient)" />}

          {/* Line stroke */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data Points */}
          {points.map((pt, index) => (
            <circle
              key={index}
              cx={pt.x}
              cy={pt.y}
              r={hoveredPoint?.date === pt.date ? 6 : 3.5}
              className="fill-blue-600 stroke-white dark:stroke-zinc-900 transition-all cursor-pointer"
              strokeWidth="2"
              onMouseEnter={() => setHoveredPoint({ date: pt.date, count: pt.count })}
            />
          ))}

          {/* X Axis Labels (First, Middle, Last) */}
          {points.length > 0 && (
            <>
              <text
                x={points[0].x}
                y={height - 8}
                textAnchor="start"
                className="text-[10px] fill-zinc-400 font-mono"
              >
                {points[0].date}
              </text>
              {points.length > 2 && (
                <text
                  x={points[Math.floor(points.length / 2)].x}
                  y={height - 8}
                  textAnchor="middle"
                  className="text-[10px] fill-zinc-400 font-mono"
                >
                  {points[Math.floor(points.length / 2)].date}
                </text>
              )}
              {points.length > 1 && (
                <text
                  x={points[points.length - 1].x}
                  y={height - 8}
                  textAnchor="end"
                  className="text-[10px] fill-zinc-400 font-mono"
                >
                  {points[points.length - 1].date}
                </text>
              )}
            </>
          )}
        </svg>
      </div>
    </div>
  );
}

