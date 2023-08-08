import BlockSection from '@components/BlockSection';
import ErrorMsg from '@components/ErrorMsg';
import Loading from '@components/Loading';
import NewsItem from '@components/NewsItem';
import useTaiwanStockNews from '@markets/tw/hooks/useTaiwanStockNews';

export default function StockNews({ ticker, token }) {
  const newsResult = useTaiwanStockNews(ticker, token);
  const { data: news, error, stage } = newsResult;
  let Result = null;

  if (stage === 'fetching') {
    Result = (
      <BlockSection>
        <Loading />
      </BlockSection>
    );
  }
  if (error) {
    Result = (
      <BlockSection>
        <ErrorMsg>{error.message}</ErrorMsg>
      </BlockSection>
    );
  }
  if (news) {
    if (news.length > 0) {
      Result = news.reverse().map((props, index) => <NewsItem {...props} key={index + props.date} />);
    } else {
      Result = (
        <BlockSection>
          <p className="m-4 text-center text-white">無相關新聞</p>
        </BlockSection>
      );
    }
  }

  return <div className="space-y-4">{Result}</div>;
}
