import { boundColumns, gridStyles } from '@lib/muiDataGrid';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import concatParams from '@utils/concatParams';
import fetch from '@utils/fetch';
import moment from 'moment';
import { DataGridPro } from '@mui/x-data-grid-pro';

const data_ids = [
  'United States 1-Month',
  'United States 2-Month',
  'United States 3-Month',
  'United States 6-Month',
  'United States 1-Year',
  'United States 2-Year',
  'United States 3-Year',
  'United States 5-Year',
  'United States 10-Year',
  'United States 20-Year',
  'United States 30-Year',
];
let boundCacheMap = new Map();

export default function TreasuryBoundList() {
  // console.log('route: TreasuryBoundList');
  const { bound_data_id } = useParams();
  const navigate = useNavigate();
  const [formattedBoundColumns, setFormattedBoundColumns] = useState(null);
  const [list, setList] = useState(null);

  function getTreasuryBoundYield(data_id) {
    if (boundCacheMap.has(data_id)) {
      return boundCacheMap.get(data_id);
    }
    const params = {
      dataset: 'GovernmentBondsYield',
      data_id,
      start_date: moment().subtract(10, 'days').format('YYYY-MM-DD'),
    };
    const paramsStr = concatParams(params);

    return fetch({
      url: process.env.GithubPages
        ? corsProxy + encodeURIComponent('https://api.finmindtrade.com/api/v4/data' + paramsStr)
        : '/api/stock' + paramsStr,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    })
      .then(res => res.data.data)
      .then(data => {
        const days = data.slice(-4).reverse();
        const history = days.map(day => {
          const { date, value } = day;
          const key = moment(date).format('MM/DD');

          return { [key]: value };
        });
        const result = Object.assign({ id: days[0].name }, ...history);

        boundCacheMap.set(data_id, result);
        return result;
      });
  }
  function onRowClick(params) {
    navigate(params.id);
  }

  useEffect(() => {
    const rowsPromise = data_ids.map(data_id => {
      return getTreasuryBoundYield(data_id);
    });
    Promise.all(rowsPromise).then(data => {
      const anyDay = data[0];
      const dayColumns = [];

      Object.keys(anyDay).forEach(key => {
        if (key !== 'id' && !dayColumns[key]) {
          const dayColumn = {
            align: 'center',
            field: key,
            headerName: key,
            headerAlign: 'center',
            sortable: false,
            type: 'number',
            width: 60,
            valueFormatter: params => params.value,
          };

          dayColumns.push(dayColumn);
        }
      });
      setFormattedBoundColumns([...boundColumns, ...dayColumns]);
      setList(data);
    });
  }, []);

  return (
    <>
      {!bound_data_id && list && (
        <DataGridPro
          className="-m-4"
          columns={formattedBoundColumns}
          disableColumnMenu
          disableColumnResize
          hideFooter
          onRowClick={onRowClick}
          rows={list}
          sx={gridStyles}
        />
      )}
      <Outlet />
    </>
  );
}
