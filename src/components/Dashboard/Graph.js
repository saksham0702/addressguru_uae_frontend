import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Graph = ({ stats }) => {
  console.log("stats", stats);
  const data = [
    { name: "Views", value: stats?.totalViews || 0 },
    { name: "Calls", value: stats?.totalCalls || 0 },
    { name: "Leads", value: stats?.totalLeads || 0 },
    { name: "Visits", value: stats?.websiteVisits || 0 },
    { name: "Reviews", value: stats?.totalReviews || 0 },
  ];

  const maxValue = Math.max(...data.map((d) => d.value));
  const yMax =
    maxValue <= 10
      ? 10
      : maxValue <= 100
        ? 100
        : Math.ceil(maxValue / 100) * 100;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      {/* Title */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800">
          Performance Overview
        </h3>
      </div>

      {/* Chart */}
      <div className="w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6C60F3" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#6C60F3" stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11 }}
              dy={5} // 👈 spacing below labels
            />

            <YAxis
              domain={[0, yMax]}
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              dx={-5} // 👈 spacing from chart
            />

            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                fontSize: "12px",
                border: "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#6C60F3"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorMain)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Graph;
