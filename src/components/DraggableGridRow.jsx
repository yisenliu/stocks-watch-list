import { memo } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { GridRow } from '@mui/x-data-grid-pro';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import tw, { css } from 'twin.macro';

function DraggableGridRow(props) {
  // console.log('component: DraggableGridRow');
  const { market, selectedRowIds, updateSelectedRowIds, ...rowProps } = props;
  const activeColor = tw`bg-primary`;
  const draggableCSS = css`
    ${tw`flex items-center !w-auto`}
    ${selectedRowIds.includes(props.rowId) ? activeColor : ''}
  `;

  return (
    <Draggable draggableId={props.rowId} index={props.index}>
      {(provided, snapshot) => {
        return (
          <div
            ref={provided.innerRef}
            css={draggableCSS}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              ...provided.draggableProps.style,
              backgroundColor: snapshot.isDragging ? activeColor : '',
              backgroundImage: 'linear-gradient(to top,#666 1px,transparent 1px)',
            }}
          >
            {snapshot.isDragging && <DragHandleIcon fontSize="small" />}
            <GridRow {...rowProps} sx={{ borderBottom: 'none' }} />
          </div>
        );
      }}
    </Draggable>
  );
}
const MemoDraggableDataRow = memo(DraggableGridRow);
export default MemoDraggableDataRow;
