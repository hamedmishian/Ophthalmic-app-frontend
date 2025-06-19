"use client";

import { cn } from "@/lib/utils";

interface GaugeProps {
  value: number;
  maxValue: number;
  label: string;
  unit?: string;
  trend?: {
    value: number;
    label: string;
  };
  date?: string;
  className?: string;
}

export function Gauge({
  value,
  maxValue,
  label,
  unit,
  trend,
  date,
  className
}: GaugeProps) {
  // Convert value to percentage for the needle rotation
  const percentage = (value / maxValue) * 100;
  // Calculate rotation (-90 to 90 degrees)
  const rotation = -90 + (180 * percentage) / 100;

  return (
    <div
      className={cn(
        "flex flex-col items-center p-4 bg-white rounded-lg border",
        className
      )}
    >
      <div className="text-sm font-medium mb-3">{label}</div>
      <div className="relative w-[140px] h-[70px]">
        <svg width="140" height="70" viewBox="0 0 140 70">
          {/* Red Section (0-33%) */}
          <path
            d="M 10 70 A 60 60 0 0 1 50 11.699"
            fill="none"
            stroke="#FF4D4D"
            strokeWidth="14"
          />
          {/* Yellow Section (33-66%) */}
          <path
            d="M 50 11.699 A 60 60 0 0 1 90 11.699"
            fill="none"
            stroke="#FFC107"
            strokeWidth="14"
          />
          {/* Green Section (66-100%) */}
          <path
            d="M 90 11.699 A 60 60 0 0 1 130 70"
            fill="none"
            stroke="#4CAF50"
            strokeWidth="14"
          />
          {/* Outer border arc */}
          {/* <path
            d="M 10 70 A 60 60 0 0 1 130 70"
            fill="none"
            stroke="#000"
            strokeWidth="2"
          /> */}
        </svg>

        {/* Needle */}
        <div
          className="absolute bottom-0 left-1/2 w-[2px] h-[60px] bg-black origin-bottom"
          style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
        />

        {/* Center point */}
        <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-black rounded-full transform -translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Value and trend */}
      <div className="mt-4 text-center">
        <div className="text-2xl font-bold">
          {value}
          {unit}
        </div>
        {trend && (
          <div className="flex items-center justify-center gap-1 mt-2">
            {trend.value > 0 ? (
              <div className="flex items-center gap-1 text-green-600">
                ▲ <span className="text-sm text-gray-600">{trend.label}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-red-600">
                ▼ <span className="text-sm text-gray-600">{trend.label}</span>
              </div>
            )}
          </div>
        )}
        {date && (
          <div className="text-xs text-gray-500 mt-1">Datum: {date}</div>
        )}
      </div>
    </div>
  );
}

// "use client";

// import { cn } from "@/lib/utils";
// import {
//   RadialBarChart,
//   RadialBar,
//   PolarAngleAxis,
//   ResponsiveContainer
// } from "recharts";

// interface GaugeProps {
//   value: number;
//   maxValue: number;
//   label: string;
//   unit?: string;
//   trend?: {
//     value: number;
//     label: string;
//   };
//   date?: string;
//   className?: string;
// }

// export function Gauge({
//   value,
//   maxValue,
//   label,
//   unit,
//   trend,
//   date,
//   className
// }: GaugeProps) {
//   const percentage = (value / maxValue) * 100;
//   const data = [{ value: percentage }];

//   return (
//     <div
//       className={cn(
//         "flex flex-col items-center p-4 bg-white rounded-lg border",
//         className
//       )}
//     >
//       <div className="text-sm font-medium mb-3">{label}</div>
//       <div className="relative w-[140px] h-[70px]">
//         <ResponsiveContainer width="100%" height={100}>
//           <RadialBarChart
//             cx="50%"
//             cy="100%"
//             innerRadius="80%"
//             outerRadius="100%"
//             startAngle={180}
//             endAngle={0}
//             barSize={10}
//             data={data}
//           >
//             <PolarAngleAxis
//               type="number"
//               domain={[0, 100]}
//               angleAxisId={0}
//               tick={false}
//             />
//             <RadialBar
//               background
//               dataKey="value"
//               cornerRadius={10}
//               fill={
//                 percentage > 66
//                   ? "#4CAF50"
//                   : percentage > 33
//                   ? "#FFC107"
//                   : "#F44336"
//               }
//             />
//           </RadialBarChart>
//         </ResponsiveContainer>
//       </div>

//       <div className="mt-4 text-center">
//         <div className="text-2xl font-bold">
//           {value}
//           {unit}
//         </div>
//         {trend && (
//           <div className="flex items-center justify-center gap-1 mt-2">
//             {trend.value > 0 ? (
//               <div className="flex items-center gap-1 text-green-600">
//                 ▲ <span className="text-sm text-gray-600">{trend.label}</span>
//               </div>
//             ) : (
//               <div className="flex items-center gap-1 text-red-600">
//                 ▼ <span className="text-sm text-gray-600">{trend.label}</span>
//               </div>
//             )}
//           </div>
//         )}
//         {date && (
//           <div className="text-xs text-gray-500 mt-1">Datum: {date}</div>
//         )}
//       </div>
//     </div>
//   );
// }
