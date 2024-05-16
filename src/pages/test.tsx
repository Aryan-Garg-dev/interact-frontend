// components/DraggableList.tsx
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface DraggableListProps {
  items: string[];
}

const DraggableList: React.FC<DraggableListProps> = ({ items }) => {
  const [listItems, setListItems] = useState<string[]>(items);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newItems = [...listItems];
    const [removed] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, removed);
    setListItems(newItems);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {provided => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {listItems.map((item, index) => (
              <Draggable key={index} draggableId={index.toString()} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      padding: '8px',
                      marginBottom: '4px',
                      backgroundColor: snapshot.isDragging ? 'lightgreen' : 'lightblue',
                      ...provided.draggableProps.style,
                    }}
                  >
                    {item}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const App: React.FC = () => {
  const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];

  return (
    <div className="w-[100vw] h-[100vh] relative">
      <div className="w-1/2 absolute translate-x-1/2 translate-y-1/2">
        <DraggableList items={items} />
        <div>hello</div>
      </div>
    </div>
  );
};

export default App;
