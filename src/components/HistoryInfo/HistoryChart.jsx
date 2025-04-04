import { Area, AreaChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useState } from 'react';

export default function HistoryChart({ history, closeKey, tooltipValueLabel = '收盤價' }) {
  // console.log('component: HistoryChart');
  const [refLineY, setRefLineY] = useState(-100);

  function showRefLine({ activePayload }) {
    if (activePayload) {
      setRefLineY(activePayload[0].value);
    }
  }

  function hideRefLine() {
    setRefLineY(-100);
  }

  return (
    <div data-name="price_history_chart" className="-ml-2">
      <ResponsiveContainer height={300} debounce={300}>
        <AreaChart data={history} onMouseMove={showRefLine} onMouseLeave={hideRefLine}>
          <ReferenceLine stroke="#ccc" strokeDasharray="1 1" strokeWidth="0.5" y={refLineY} />
          <XAxis dataKey="date" tick={{ fill: '#ccc' }} tickFormatter={d => d.slice(5)} minTickGap={24} />
          <YAxis
            domain={['auto', 'auto']}
            width={50}
            padding={{ top: 50, bottom: 20 }}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#ccc' }}
          />
          <Tooltip
            active={false}
            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: 'none', color: '#ccc' }}
            formatter={value => [value, tooltipValueLabel]}
            itemStyle={{ color: '#fff' }}
            isAnimationActive={false}
            position={{ x: 0, y: 0 }}
            cursor={{ stroke: '#ccc', strokeWidth: 0.5, strokeDasharray: '1 1' }}
            wrapperStyle={{
              zIndex: 1,
              right: 16,
              left: 'auto',
              textAlign: 'right',
            }}
          />
          <Area animationDuration={500} dataKey={closeKey} stroke="#00acc1" strokeWidth={2} fillOpacity={0} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
