'use client';

import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

export function ChartCard({ title, children, className }) {
  return (
    <div className={`card ${className || ''}`}>
      <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
      {children}
    </div>
  );
}

export function RevenueSpendChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
        <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
        <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }} />
        <Legend />
        <Line type="monotone" dataKey="revenue" stroke="#112E81" strokeWidth={2} dot={false} name="Revenue" />
        <Line type="monotone" dataKey="spend" stroke="#4382DF" strokeWidth={2} dot={false} name="Ad Spend" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function RoasTrendChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
        <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" domain={[0, 'auto']} />
        <Tooltip contentStyle={{ borderRadius: '12px' }} />
        <Line type="monotone" dataKey="roas" stroke="#4647AE" strokeWidth={2} dot={{ fill: '#4647AE' }} name="ROAS" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function SalesByChannelChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="channel" tick={{ fontSize: 11 }} stroke="#94a3b8" />
        <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
        <Tooltip contentStyle={{ borderRadius: '12px' }} />
        <Bar dataKey="sales" fill="#112E81" radius={[6, 6, 0, 0]} name="Sales" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function CampaignPerformanceChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis type="number" tick={{ fontSize: 12 }} stroke="#94a3b8" />
        <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} stroke="#94a3b8" width={100} />
        <Tooltip contentStyle={{ borderRadius: '12px' }} />
        <Bar dataKey="revenue" fill="#10B981" radius={[0, 6, 6, 0]} name="Revenue" />
        <Bar dataKey="spend" fill="#4382DF" radius={[0, 6, 6, 0]} name="Spend" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function PlatformDonutChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: '12px' }} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
