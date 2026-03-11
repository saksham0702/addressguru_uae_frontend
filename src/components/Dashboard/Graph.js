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

const Graph = () => {
  const data = [
    { name: "Mon", uv: 4000, pv: 2400, amt: 2400 },
    { name: "Tue", uv: 3000, pv: 1398, amt: 2210 },
    { name: "Wed", uv: 2000, pv: 9800, amt: 2290 },
    { name: "Thu", uv: 2780, pv: 3908, amt: 2000 },
    { name: "Fri", uv: 1890, pv: 4800, amt: 2181 },
    { name: "Sat", uv: 2390, pv: 3800, amt: 2500 },
    { name: "Sun", uv: 3490, pv: 4300, amt: 2100 },
  ];

  return (
    <ResponsiveContainer width="100%" height={190}>
      <AreaChart className=""
        data={data}
        margin={{ top: 10, right: 10, left: -15, bottom: 0,  }}
      >
        <defs >
          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FF6E04" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#FF6E04" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6C60F3" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#6C60F3" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" axisLine={false}  tickLine={false}   tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} axisLine={false}   tickLine={false}  tickCount={5} />
        <CartesianGrid strokeDasharray="3 3" vertical={false}  />
        <Tooltip contentStyle={{ fontSize: "10px" }} />
        <Area
          type="monotone"
          dataKey="uv"
          stroke="#6C60F3"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorUv)"
        />
        <Area
          type="monotone"
          dataKey="pv"
          strokeWidth={2}
          stroke="#FF6E04"
          fillOpacity={1}
          fill="url(#colorPv)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default Graph;
