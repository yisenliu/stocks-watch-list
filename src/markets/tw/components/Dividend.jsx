import { Bar, ComposedChart, Line, LabelList, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import BlockSection from '@components/BlockSection';
import ErrorMsg from '@components/ErrorMsg';
import Loading from '@components/Loading';
import useStockDividend from '@markets/tw/hooks/useStockDividend';

export default function Dividend({ ticker, token }) {
  // console.log('component: Dividend');
  const { data, error, stage } = useStockDividend({ ticker, token });
  const dividend_policy = data?.dividend_policy;
  const legendFormatter = value => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };
  const animationDuration = 200;
  let Result = null;

  if (stage === 'fetching') {
    Result = <Loading />;
  }
  if (error) {
    Result = <ErrorMsg>{error.message}</ErrorMsg>;
  }
  if (stage === 'fetched') {
    if (!dividend_policy) {
      Result = <p className="m-4 text-center text-white">{ticker} 未配息</p>;
    } else {
      Result = (
        <ResponsiveContainer height={300} debounce={300}>
          <ComposedChart data={dividend_policy} barCategoryGap="20%">
            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#ccc' }} />
            <YAxis hide padding={{ top: 30 }} domain={[0, 'dataMax']} />
            <Legend formatter={legendFormatter} />
            <Bar dataKey="Q1" stackId="Quarter" fill="#81c784" animationDuration={animationDuration}>
              <LabelList position="center" dataKey="Q1" />
            </Bar>
            <Bar dataKey="Q2" stackId="Quarter" fill="#ef9a9a" animationDuration={animationDuration}>
              <LabelList position="center" dataKey="Q2" />
            </Bar>
            <Bar dataKey="Q3" stackId="Quarter" fill="#bcaaa4" animationDuration={animationDuration}>
              <LabelList position="center" dataKey="Q3" />
            </Bar>
            <Bar dataKey="Q4" stackId="Quarter" fill="#81d4fa" animationDuration={animationDuration}>
              <LabelList position="center" dataKey="Q4" />
            </Bar>
            <Line type="linear" dataKey="total" stroke="#ffffff" isAnimationActive={false}>
              <LabelList position="top" dataKey="total" />
            </Line>
          </ComposedChart>
        </ResponsiveContainer>
      );
    }
  }
  return <BlockSection>{Result}</BlockSection>;
}
