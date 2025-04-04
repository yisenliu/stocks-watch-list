export default function Summary({ currentDurationLabel = null, currentValue, startValue, endDate, min, max }) {
  // console.log('component: Summary');
  const diff = {
    value: parseFloat(currentValue - startValue).toFixed(2),
    percent: parseFloat(((currentValue - startValue) / startValue) * 100).toFixed(2),
  };
  const fromTopDown = parseFloat((currentValue / max - 1) * 100).toFixed(2);
  return (
    <div className="w-full overflow-x-auto">
      <ul className="gap-x-2 inline-grid justify-center grid-cols-[repeat(3,auto)] text-white *:whitespace-nowrap">
        <li className="col-span-full">
          <p className="mx-2 text-3xl font-bold"> {currentValue}</p>
          <p className="space-x-2 text-lg font-bold">
            <span className={diff.value > 0 ? 'text-green-400 before:content-["+"]' : 'text-red-400'}>
              {diff.value}
            </span>
            <span className={diff.percent > 0 ? 'text-green-400' : 'text-red-400'}>({diff.percent + '%'})</span>
            {currentDurationLabel && <span className=" text-lg">{currentDurationLabel}</span>}
          </p>
        </li>
        <li>
          高: <span className="mx-1 font-bold text-green-400">{max}</span>
        </li>
        <li>
          低: <span className="mx-1 font-bold text-red-400">{min}</span>
        </li>
        <li>
          高點回落: <span className="mx-1 font-bold text-red-400">{fromTopDown < 0 ? fromTopDown + '%' : '-'}</span>
        </li>
      </ul>
      <div className="z-3 fixed bottom-0 left-0 w-full px-2 text-sm text-white bg-gray-900">最後更新：{endDate}</div>
    </div>
  );
}
