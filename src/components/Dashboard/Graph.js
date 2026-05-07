import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = {
  Views: "#6C60F3",
  Calls: "#00C49F",
  Leads: "#FFBB28",
  Visits: "#FF8042",
  Reviews: "#FF4560",
};

const Graph = ({ stats }) => {
  const lineData = [
    { name: "Views", value: stats?.totalViews || 0 },
    { name: "Calls", value: stats?.totalCalls || 0 },
    { name: "Leads", value: stats?.totalLeads || 0 },
    { name: "Visits", value: stats?.websiteVisits || 0 },
    { name: "Reviews", value: stats?.totalReviews || 0 },
  ].sort((a, b) => a.value - b.value);

  const pieData = [
    { name: "Views", value: stats?.totalViews || 0, color: "#6C60F3" },
    { name: "Calls", value: stats?.totalCalls || 0, color: "#00C49F" },
    { name: "Leads", value: stats?.totalLeads || 0, color: "#FFBB28" },
    { name: "Visits", value: stats?.websiteVisits || 0, color: "#FF8042" },
    { name: "Reviews", value: stats?.totalReviews || 0, color: "#FF4560" },
  ];

  const maxValue = Math.max(...lineData.map((d) => d.value));
  const yMax =
    maxValue <= 10
      ? 10
      : maxValue <= 100
        ? 100
        : Math.ceil(maxValue / 100) * 100;

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const name = payload[0].payload.name;
    const value = payload[0].payload.value ?? payload[0].value;
    const color = COLORS[name] || payload[0].stroke || payload[0].fill;
    return (
      <div className="bg-white border border-black/10 rounded-lg px-3 py-2 shadow-md text-xs">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ background: color }}
          />
          <span className="text-gray-400">{name}</span>
        </div>
        <div className="font-semibold text-sm text-gray-900 pl-3.5">
          {value.toLocaleString()}
        </div>
      </div>
    );
  };

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="#fff"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-[11px] font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div className="flex flex-wrap gap-4">
        {/* Left */}
        <div className="flex-1 min-w-[300px]">
          <p className="text-xs font-semibold text-gray-700 mb-2 tracking-wide">
            Performance Overview
          </p>

          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={lineData}
                margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f2f2f2"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#bbb" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#bbb" }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, yMax]}
                  tickFormatter={(v) =>
                    v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v
                  }
                />
                <Tooltip content={<CustomTooltip />} />

                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {lineData.map((entry) => (
                    <Cell key={entry.name} fill={COLORS[entry.name]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right */}
        <div className="flex-1 min-w-[300px] flex flex-col items-center">
          <p className="text-xs font-semibold text-gray-700 mb-2 tracking-wide text-center">
            Distribution
          </p>

          {/* Legend Centered */}
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mb-2">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-1">
                <div
                  className="w-2 h-2 rounded-sm"
                  style={{ background: item.color }}
                />
                <span className="text-[11px] text-gray-400">{item.name}</span>
              </div>
            ))}
          </div>

          <div className="h-[205px] w-full flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={88}
                  dataKey="value"
                  strokeWidth={2}
                  stroke="#fff"
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Graph;
