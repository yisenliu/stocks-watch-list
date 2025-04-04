import { Bar, ComposedChart, Line, LabelList, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import BlockSection from '@components/BlockSection';
import ErrorMsg from '@components/ErrorMsg';
import Loading from '@components/Loading';
import useStockDividend from '@markets/tw/hooks/useStockDividend';
import tw, { css } from 'twin.macro';

const stripTableStyles = css`
  ${tw`w-full text-left text-white`};
  caption {
    ${tw`p-2 text-lg text-left border-b border-gray-700`}
  }
  td {
    ${tw`p-2 text-gray-400`}
    &:last-child {
      text-align: right;
    }
  }
  tr:nth-of-type(even) {
    ${tw`bg-white/5`}
  }
  tfoot {
    td {
      ${tw`text-right text-white border-t border-gray-700`}
    }
  }
`;

function DividendGroup({ year, dividends }) {
  let total = dividends.reduce((acc, current) => {
    // 避免浮點數的精密度問題
    return Math.round((acc + current.value) * 1000) / 1000;
  }, 0);
  const decimalPlaces = total.toString().split('.')[1]?.length;
  const fixedLen = decimalPlaces <= 3 ? decimalPlaces : 3;
  total = parseFloat(total).toFixed(fixedLen);

  return (
    <BlockSection>
      <table css={stripTableStyles}>
        <caption>{`${year}年度股息`}</caption>
        <tfoot>
          <tr>
            <td colSpan="2">{total}</td>
          </tr>
        </tfoot>
        <tbody>
          {dividends.reverse().map(({ date, value }) => {
            return (
              <tr key={date}>
                <td>{date}</td>
                <td>{value}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </BlockSection>
  );
}

export default function Dividend({ ticker, token }) {
  // console.log('component: Dividend');
  const { data, error, stage } = useStockDividend({ ticker, token });
  const dividend_quarter = data?.dividend_quarter;
  const dividend_policy = data?.dividend_policy;
  const legendFormatter = value => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };
  const animationDuration = 200;
  let result = null;

  if (stage === 'fetching') {
    result = (
      <BlockSection>
        <Loading />
      </BlockSection>
    );
  }
  if (error) {
    result = (
      <BlockSection>
        <ErrorMsg>{error.message}</ErrorMsg>
      </BlockSection>
    );
  }
  if (stage === 'fetched') {
    if (!dividend_quarter) {
      result = (
        <BlockSection>
          <p className="m-4 text-center text-white">{ticker} 未配息</p>
        </BlockSection>
      );
    } else {
      let chart = (
        <ResponsiveContainer height={300} debounce={300}>
          <ComposedChart data={dividend_quarter} barCategoryGap="20%">
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
      let dividendPolicy = dividend_policy
        .reverse()
        .map(({ stock_id, year, dividends }) => <DividendGroup key={stock_id} year={year} dividends={dividends} />);

      result = (
        <div className="space-y-8">
          <BlockSection>{chart}</BlockSection>
          {dividendPolicy}
        </div>
      );
    }
  }
  return <>{result}</>;
}
