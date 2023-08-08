import BlockSection from '@components/BlockSection';

export default function NewsItem({ date, link, source, title }) {
  const newTitle = title.replace(' - ' + source, '');
  function onClick() {
    window.open(link, '_blank');
  }
  return (
    <BlockSection data-name="news-item" className="text-white" onClick={onClick}>
      <h1 className="text-lg">{newTitle}</h1>
      <footer className="mt-4 text-sm text-right text-gray-400">
        <span>{source}</span> / <time dateTime={date}>{date}</time>
      </footer>
    </BlockSection>
  );
}
