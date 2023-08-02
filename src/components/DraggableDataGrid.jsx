import { useEffect, useState } from 'react';
import { DataGridPro, useGridApiRef } from '@mui/x-data-grid-pro';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import DraggableGridRow from './DraggableGridRow';

export default function DraggableDataGrid({
  dispatch,
  market,
  rows,
  selectedRowIds,
  setApiRefCurrent,
  updateSelectedRowIds,
  ...restProps
}) {
  console.log('component: DraggableDataGrid');
  const [gridRows, setGridRows] = useState(rows);
  const apiRef = useGridApiRef();
  const onDragEnd = async ({ destination, source }) => {
    if (!destination) {
      return;
    }

    const newGridRows = reorder(gridRows, source.index, destination.index);
    await apiRef.current.setSortModel([]);
    setGridRows(newGridRows);
    dispatch({ type: 'update_stocks', market, stocks: newGridRows });
  };
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  useEffect(() => {
    setApiRefCurrent(apiRef.current);
  }, []);

  useEffect(() => {
    setGridRows(rows);
  }, [rows]);

  return (
    <DragDropContext
      onDragEnd={onDragEnd}
      onDragStart={e => {
        updateSelectedRowIds(e.draggableId);
      }}
    >
      <Droppable droppableId="droppableStocks">
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <DataGridPro
              apiRef={apiRef}
              rows={gridRows}
              slots={{
                row: DraggableGridRow,
              }}
              slotProps={{
                row: { market, selectedRowIds, updateSelectedRowIds },
              }}
              {...restProps}
            />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
