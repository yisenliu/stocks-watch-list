export default function PriceSummary({ currentDuration, currentPrice, startPrice, endDate, min, max }) {
  const diff = {
    value: parseFloat(Number(currentPrice - startPrice).toFixed(2)),
    percent: parseFloat(Number(((currentPrice - startPrice) / startPrice) * 100).toFixed(2)),
  };
  return (
    <>
      <ul className="gap-x-4 inline-grid justify-center grid-cols-2 my-4">
        <li className="col-span-2">
          <p className="mx-2 text-3xl font-bold text-black"> {currentPrice}</p>

          <p className="space-x-2 text-lg font-bold">
            <span className={diff.value > 0 ? 'text-green-600 before:content-["+"]' : 'text-red-600'}>
              {diff.value}
            </span>
            <span className={diff.percent > 0 ? 'text-green-600' : 'text-red-600'}>({diff.percent + '%'})</span>
            <span className="text-lg text-black">{currentDuration}</span>
          </p>
        </li>
        <li>
          min: <span className="mx-1 font-bold text-red-600">{min}</span>
        </li>
        <li>
          max: <span className="mx-1 font-bold text-green-600">{max}</span>
        </li>
      </ul>
      <div className="z-3 fixed bottom-0 left-0 w-full px-2 text-sm text-white bg-gray-900">最後更新：{endDate}</div>
    </>
  );
}
