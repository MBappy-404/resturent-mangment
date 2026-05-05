import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { feeCollection } from '@/data/demoData';

export const FeeCollectionChart: React.FC = () => {
  const formatCurrency = (value: number) => {
    return `৳${(value / 1000).toFixed(0)}K`;
  };

  return (
    <div className="bg-card rounded-2xl p-6 border border-border/50 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Fee Collection</h3>
          <p className="text-sm text-muted-foreground">Monthly collection vs due amount</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-secondary" />
            <span className="text-sm text-muted-foreground">Collected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent" />
            <span className="text-sm text-muted-foreground">Due</span>
          </div>
        </div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={feeCollection} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickFormatter={formatCurrency}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value: number) => [`৳${value.toLocaleString()}`, '']}
            />
            <Bar 
              dataKey="collected" 
              fill="hsl(var(--secondary))" 
              radius={[4, 4, 0, 0]} 
              name="Collected"
            />
            <Bar 
              dataKey="due" 
              fill="hsl(var(--accent))" 
              radius={[4, 4, 0, 0]} 
              name="Due"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
