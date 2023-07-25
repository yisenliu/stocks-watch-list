export default function TickerInput({ ticker, onKeyDown, stockList }) {
  return (
    <>
      <input
        defaultValue={ticker}
        onKeyDown={onKeyDown}
        className="w-full p-2 uppercase border border-gray-400 rounded"
        list="myStocks"
        placeholder="Input ticker"
      />
      <datalist id="myStocks">
        {stockList.map((stock) => {
          return (
            <option key={stock.code} value={stock.code}>
              {stock.name}
            </option>
          );
        })}
      </datalist>
    </>
  );
}
