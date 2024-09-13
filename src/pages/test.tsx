// components/DraggableList.tsx
import { ChangeEvent, KeyboardEventHandler, useEffect, useRef, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface DraggableListProps {
  items: string[];
}

const BoldTextEditor: React.FC = () => {
  const [rawText, setRawText] = useState<string>('');
  const [renderedHTML, setRenderedHTML] = useState<string>('');
  const editableDivRef = useRef<HTMLDivElement | null>(null);
  const cursorPositionRef = useRef<number>(0);

  const formatBold = (text: string): string => {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = event => {
    const div = editableDivRef.current;

    if (div) {
      if (event.key === 'Backspace') {
        event.preventDefault();
        setRawText(prev => prev.slice(0, -1));
      } else if (event.key.length === 1) {
        // For printable characters
        setRawText(prev => prev + event.key);
      }
    }
  };

  useEffect(() => {
    setRenderedHTML(formatBold(rawText));
  }, [rawText]);

  useEffect(() => {
    const div = editableDivRef.current;
    if (div) {
      div.innerHTML = renderedHTML;
      restoreCursorPosition();
    }
  }, [renderedHTML]);

  const restoreCursorPosition = () => {
    const div = editableDivRef.current;
    if (div) {
      const selection = window.getSelection();
      if (selection) {
        const range = document.createRange();
        const textNode = div.childNodes[0] as Text;
        if (textNode) range.setStart(textNode, Math.min(cursorPositionRef.current, textNode.length));
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };

  return (
    <div className="flex flex-col p-4">
      <div
        ref={editableDivRef}
        contentEditable
        className="border border-gray-300 p-2 rounded-md shadow-sm min-h-[100px]"
        onKeyDown={handleKeyDown}
        dangerouslySetInnerHTML={{ __html: renderedHTML }}
      />
    </div>
  );
};

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
      <BoldTextEditor />
      <div className="w-1/2 absolute translate-x-1/2 translate-y-1/2">
        <DraggableList items={items} />
        <div>hello</div>
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  if (process.env.NODE_ENV != 'development') {
    return {
      redirect: {
        permanent: true,
        destination: '/home',
      },
      props: {},
    };
  } else
    return {
      props: {},
    };
}

export default App;
