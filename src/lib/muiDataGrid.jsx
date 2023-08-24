import { gridStringOrNumberComparator } from '@mui/x-data-grid-pro';
import { IdName, PercentSpread } from '@components/StockCell';

export const gridStyles = {
  border: 'none',
  color: 'white',
  height: 'calc(100vh - 48px)',
  fontSize: '1rem',
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: 'black',
    borderRadius: 0,
    '& .MuiDataGrid-columnSeparator': {
      width: '24px',
      '&::before': {
        content: `""`,
        width: 0,
        height: '8px',
        borderLeft: '1px solid #999',
        position: 'absolute',
        left: '12px',
        bottom: 0,
      },
      '& svg': {
        visibility: 'hidden',
      },
    },
  },
  '& .MuiDataGrid-cell': {
    border: 'none',
    '&:focus': {
      outline: 'none',
    },
  },
  '& .MuiDataGrid-virtualScrollerRenderZone': {
    transform: 'none !important',
  },
  '& .MuiDataGrid-virtualScroller': {
    width: '100%',
    overflowX: 'hidden',
  },
  '& .MuiDataGrid-sortIcon,& .MuiTablePagination-root, & .MuiSelect-icon': {
    color: 'white',
  },
  '& .MuiButtonBase-root.Mui-disabled': {
    color: 'rgba(255, 255, 255, 0.4)',
  },
  '& .MuiDataGrid-row': {
    userSelect: 'none',
    borderBottom: '1px solid #666',
    transition: 'transform .2s linear 0s',
    '&.Mui-selected': {
      backgroundColor: 'transparent !important',
    },
  },
};
export const stockColumns = [
  {
    field: 'id',
    flex: 1,
    headerName: '代號',
    renderCell: ({ value }) => <IdName value={value} />,
    sortComparator: (v1, v2) => gridStringOrNumberComparator(v1.id, v2.id),
    valueGetter: params => {
      return {
        id: params.row.id,
        name: params.row.name,
      };
    },
  },
  {
    align: 'right',
    field: 'price',
    headerName: '現價',
    headerAlign: 'right',
    type: 'number',
    valueGetter: params => {
      return params.row.close;
    },
    width: 100,
  },
  {
    align: 'right',
    cellClassName: params => (params.row.spread < 0 ? 'text-red-300' : 'text-green-400'),
    field: 'percent',
    headerName: '漲幅 %',
    headerAlign: 'right',
    renderCell: ({ value }) => <PercentSpread value={value} />,
    sortComparator: (v1, v2) => gridStringOrNumberComparator(v1.percent, v2.percent),
    valueGetter: params => {
      const spread = params.row.spread;
      const open = params.row.open;
      return {
        percent: isNaN(spread) ? '-' : parseFloat((spread / open) * 100).toFixed(2),
        spread: isNaN(spread) ? '-' : parseFloat(spread).toFixed(2),
      };
    },
    valueFormatter: ({ value }) => {
      const { percent, spread } = value;
      return {
        percent: isNaN(percent) ? '-' : `${percent.toLocaleString()} %`,
        spread,
      };
    },
    width: 100,
  },
];
export const boundColumns = [
  {
    field: 'id',
    flex: 1,
    headerName: '美國國債殖利率',
    sortable: false,
    valueFormatter: params => {
      const str = params.value;
      if (!str) {
        return '';
      }
      switch (str) {
        case 'United States 1-Month':
          return '1月';
        case 'United States 2-Month':
          return '2月';
        case 'United States 3-Month':
          return '3月';
        case 'United States 6-Month':
          return '6月';
        case 'United States 1-Year':
          return '1年';
        case 'United States 2-Year':
          return '2年';
        case 'United States 3-Year':
          return '3年';
        case 'United States 5-Year':
          return '5年';
        case 'United States 10-Year':
          return '10年';
        case 'United States 20-Year':
          return '20年';
        case 'United States 30-Year':
          return '30年';
      }
    },
  },
];
