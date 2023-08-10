import { Area, AreaChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useState } from 'react';

export default function TreasuryBoundHistoryChart({ history }) {
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
    <div data-name={history.name} className="-ml-2">
      <ResponsiveContainer height={300} debounce={300}>
        <AreaChart data={history} onMouseMove={showRefLine} onMouseLeave={hideRefLine}>
          <ReferenceLine stroke="#ccc" strokeDasharray="1 1" strokeWidth="0.5" y={refLineY} />
          <XAxis dataKey="date" tick={{ fill: '#ccc' }} tickFormatter={d => d.slice(5)} minTickGap={24} />
          <YAxis
            domain={['dataMin', 'dataMax']}
            width={40}
            padding={{ top: 50, bottom: 20 }}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#ccc' }}
          />
          <Tooltip
            active={false}
            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: 'none', color: '#ccc' }}
            formatter={value => [value, '殖利率']}
            itemStyle={{ color: '#fff' }}
            isAnimationActive={false}
            position={{ x: 0, y: 0 }}
            cursor={{ stroke: '#ccc', strokeWidth: 0.5, strokeDasharray: '1 1' }}
            wrapperStyle={{
              zIndex: 1,
              right: 16,
              left: 'auto',
            }}
          />
          <Area animationDuration={500} dataKey="value" stroke="#00acc1" strokeWidth={2} fillOpacity={0} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
