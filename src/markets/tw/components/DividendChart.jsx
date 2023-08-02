import { useState, useCallback } from 'react';
import { Bar, ComposedChart, Line, LabelList, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import Loading from '@components/Loading';
import useStockDividend from '@markets/tw/hooks/useStockDividend';

export default function DividendChart({ ticker, token }) {
  console.log('component: DividendChart');
  const { data, error, loading } = useStockDividend({ ticker, token });
  const dividend_policy = data?.dividend_policy;
  const legendFormatter = value => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };
  let [animate, setAnimate] = useState(false);
  const onAnimationStart = useCallback(() => {
    setTimeout(() => {
      setAnimate(true);
    }, 500);
  }, []);

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return (
      <p className="my-4">
        <span className="text-red-800">{error.message}</span>
      </p>
    );
  }
  if (dividend_policy?.length === 0) {
    return <p className="text-red-900">{ticker} 未配息</p>;
  }
  return (
    <ResponsiveContainer height={300} debounce={300}>
      <ComposedChart data={dividend_policy} barCategoryGap="20%">
        <XAxis dataKey="year" axisLine={false} tickLine={false} />
        <YAxis hide padding={{ top: 30 }} domain={[0, 'dataMax']} />
        <Legend formatter={legendFormatter} />
        <Bar
          dataKey="Q1"
          stackId="Quarter"
          fill="#b2ebf2"
          isAnimationActive={animate}
          onAnimationStart={onAnimationStart}
          animationDuration={500}
        >
          <LabelList position="center" dataKey="Q1" />
        </Bar>
        <Bar
          dataKey="Q2"
          stackId="Quarter"
          fill="#80deea"
          isAnimationActive={animate}
          onAnimationStart={onAnimationStart}
          animationDuration={500}
        >
          <LabelList position="center" dataKey="Q2" />
        </Bar>
        <Bar
          dataKey="Q3"
          stackId="Quarter"
          fill="#4dd0e1"
          isAnimationActive={animate}
          onAnimationStart={onAnimationStart}
          animationDuration={500}
        >
          <LabelList position="center" dataKey="Q3" />
        </Bar>
        <Bar
          dataKey="Q4"
          stackId="Quarter"
          fill="#26c6da"
          isAnimationActive={animate}
          onAnimationStart={onAnimationStart}
          animationDuration={500}
        >
          <LabelList position="center" dataKey="Q4" />
        </Bar>
        <Line
          type="linear"
          dataKey="total"
          stroke="#ff6f00"
          isAnimationActive={animate}
          onAnimationStart={onAnimationStart}
          animationDuration={500}
        >
          <LabelList position="top" dataKey="total" />
        </Line>
      </ComposedChart>
    </ResponsiveContainer>
  );
}
