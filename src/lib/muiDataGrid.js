export const gridStyles = {
  border: 'none',
  color: 'white',
  height: 'calc(100vh - 48px)',
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
  { field: 'id', flex: 1, headerName: '代號' },
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
    cellClassName: params => (params.row.spread < 0 ? 'text-red-500' : 'text-green-500'),
    field: 'percent',
    headerName: '漲幅 %',
    headerAlign: 'right',
    valueGetter: params => {
      return parseFloat((params.row.spread / params.row.open) * 100).toFixed(2);
    },
    valueFormatter: params => {
      if (params.value == null) {
        return '';
      }
      return `${params.value.toLocaleString()} %`;
    },
    width: 120,
  },
];
export const boundColumns = [
  {
    field: 'id',
    flex: 1,
    headerName: '美國公債殖利率',
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
