const dataGridStyles = {
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
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,.1)',
    },
  },
};
export default dataGridStyles;
