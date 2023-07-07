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
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: 'black',
    borderRadius: 0,
  },
  '& .MuiDataGrid-cell:focus': {
    outline: 'none',
  },
  '& .MuiDataGrid-sortIcon,& .MuiTablePagination-root, & .MuiSelect-icon': {
    color: 'white',
  },
  '& .MuiButtonBase-root.Mui-disabled': {
    color: 'rgba(255, 255, 255, 0.4)',
  },
  '& .MuiDataGrid-row': {
    userSelect: 'none',
    cursor: 'pointer',
    transition: 'transform .2s',
    '&.Mui-selected': {
      boxShadow: '0 0 8px 4px rgba(0,0,0,.8)',
      backgroundColor: 'rgba(255,255,255,.2)',
      '&:hover': {
        backgroundColor: 'rgba(255,255,255,.2)',
      },
    },
  },
};
// export default { columns, gridStyles };
