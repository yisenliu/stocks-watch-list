export const columns = [
  { field: 'id', flex: 1, headerName: '代號' },
  {
    field: 'price',
    width: 100,
    headerName: '現價',
    type: 'number',
    align: 'right',
    headerAlign: 'right',
    valueGetter: params => {
      return params.row.close;
    },
  },
  {
    field: 'percent',
    width: 120,
    headerName: '漲幅 %',
    align: 'right',
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
    cellClassName: params => (params.row.spread < 0 ? 'text-red-500' : 'text-green-500'),
  },
];
export const gridStyles = {
  border: 'none',
  color: 'white',
  height: 'calc(100vh - 48px)',
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: 'black',
    borderRadius: 0,
  },
  '& .MuiDataGrid-cell': {
    border: 'none',
    '&:focus': {
      outline: 'none',
    },
  },
  '& .MuiDataGrid-withBorderColor': {
    borderColor: '#ccc',
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
    cursor: 'drop',
    transition: 'transform .2s linear 0s',
    '&.Mui-selected': {
      backgroundColor: 'transparent !important',
    },
  },
};
