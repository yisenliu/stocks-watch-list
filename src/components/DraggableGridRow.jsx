import { memo } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { GridRow } from '@mui/x-data-grid-pro';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import tw, { css } from 'twin.macro';

function DraggableGridRow(props) {
  // console.log('component: DraggableGridRow');
  const { market, selectedRowIds, updateSelectedRowIds, ...rowProps } = props;
  const draggableCSS = css`
    ${tw`relative flex items-center`}
    ${selectedRowIds.includes(props.rowId) ? tw`bg-white/25` : ''}
    &::before {
      ${tw`content-[''] border-b border-gray-500 absolute bottom-0 w-full`}
    }
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
              backgroundColor: snapshot.isDragging ? 'rgba(255,255,255,.4)' : '',
            }}
          >
            {snapshot.isDragging && <DragHandleIcon fontSize="small" />}
            <GridRow {...rowProps} />
          </div>
        );
      }}
    </Draggable>
  );
}
const MemoDraggableDataRow = memo(DraggableGridRow);
export default MemoDraggableDataRow;
