import { useState, useCallback } from 'react';
import { Bar, ComposedChart, Line, LabelList, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import Loading from '@components/Loading';
import useStockDividend from '@markets/tw/hooks/useStockDividend';

function Container({ children }) {
  return <div className="pt-4 mx-4 bg-gray-800">{children}</div>;
}
export default function DividendChart({ ticker, token }) {
  // console.log('component: DividendChart');
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
  let Result = null;

  if (loading) {
    Result = <Loading darkTheme />;
  }
  if (error) {
    Result = (
      <p className="my-4">
        <span className="text-red-800">{error.message}</span>
      </p>
    );
  }
  if (dividend_policy?.length === 0) {
    Result = <p className="text-red-900">{ticker} 未配息</p>;
  } else {
    Result = (
      <ResponsiveContainer height={300} debounce={300}>
        <ComposedChart data={dividend_policy} barCategoryGap="20%">
          <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#ccc' }} />
          <YAxis hide padding={{ top: 30 }} domain={[0, 'dataMax']} />
          <Legend formatter={legendFormatter} />
          <Bar
            dataKey="Q1"
            stackId="Quarter"
            fill="#66bb6a"
            isAnimationActive={animate}
            onAnimationStart={onAnimationStart}
            animationDuration={500}
          >
            <LabelList position="center" dataKey="Q1" />
          </Bar>
          <Bar
            dataKey="Q2"
            stackId="Quarter"
            fill="#ef9a9a"
            isAnimationActive={animate}
            onAnimationStart={onAnimationStart}
            animationDuration={500}
          >
            <LabelList position="center" dataKey="Q2" />
          </Bar>
          <Bar
            dataKey="Q3"
            stackId="Quarter"
            fill="#c5e1a5"
            isAnimationActive={animate}
            onAnimationStart={onAnimationStart}
            animationDuration={500}
          >
            <LabelList position="center" dataKey="Q3" />
          </Bar>
          <Bar
            dataKey="Q4"
            stackId="Quarter"
            fill="#81d4fa"
            isAnimationActive={animate}
            onAnimationStart={onAnimationStart}
            animationDuration={500}
          >
            <LabelList position="center" dataKey="Q4" />
          </Bar>
          <Line
            type="linear"
            dataKey="total"
            stroke="#ffffff"
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
  return <Container>{Result}</Container>;
}
