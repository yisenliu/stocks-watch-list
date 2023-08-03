import {
  Area,
  AreaChart,
  // CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useState } from 'react';

export default function PriceHistoryChart({ history }) {
  console.log('component: PriceHistoryChart:us');
  const [refLineY, setRefLineY] = useState(-100);

  function showRefLine({ activePayload }) {
    if (activePayload) {
      setRefLineY(activePayload[0].value);
    }
  }

  function hideRefLine() {
    setRefLineY(-100);
  }

  function legendFormatter(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  return (
    <ResponsiveContainer height={300} debounce={300}>
      <AreaChart data={history} onMouseMove={showRefLine} onMouseLeave={hideRefLine} margin={{ right: 30 }}>
        {/* <defs>
          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#b2ebf2" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#e0f7fa" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" /> */}
        <ReferenceLine stroke="red" strokeDasharray="1 1" strokeWidth="0.5" y={refLineY} />
        <XAxis dataKey="date" tick={{ fill: '#ccc' }} tickFormatter={value => value.slice(5)} minTickGap={24} />
        <YAxis
          domain={['auto', 'auto']}
          width={50}
          padding={{ top: 50 }}
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#ccc' }}
        />
        <Tooltip
          isAnimationActive={false}
          position={{ x: 0, y: 0 }}
          contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
          wrapperStyle={{
            position: 'absolute',
            zIndex: '1',
            top: '0',
            right: '0',
            left: 'auto',
            width: '120px',
          }}
          formatter={value => [value, '收盤價']}
        />
        <Legend formatter={legendFormatter} />
        <Area
          animationDuration={500}
          dataKey="Close"
          stroke="#00acc1"
          strokeWidth={2}
          fillOpacity={0}
          // fill="url(#colorPrice)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
