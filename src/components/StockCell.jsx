import { useContext } from 'react';
import StockContext from '@contexts/StockContext';

export function IdName({ value }) {
  const { showDetailedRow } = useContext(StockContext);

  return (
    <div className="w-full">
      {value.id}
      {showDetailedRow && <span className="block text-sm text-gray-500 truncate">{value.name}</span>}
    </div>
  );
}
export function PercentSpread({ value }) {
  const { showDetailedRow } = useContext(StockContext);

  return (
    <div className="text-right">
      {value.percent}
      {showDetailedRow && <span className="block text-sm opacity-75">{value.spread}</span>}
    </div>
  );
}
