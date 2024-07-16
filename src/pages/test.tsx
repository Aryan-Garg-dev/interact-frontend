// components/DraggableList.tsx
import SubscriptionsConfig, { SubscriptionConfig } from '@/config/subscriptions';
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

const SubscriptionTable: React.FC = () => {
  const plans: Record<string, SubscriptionConfig> = SubscriptionsConfig;

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-semibold text-gray-800">Subscription Plans</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded">
          <thead>
            <tr>
              <th className="py-2 px-4 bg-gray-200 font-semibold text-gray-700">Plan Name</th>
              <th className="py-2 px-4 bg-gray-200 font-semibold text-gray-700">Analytics</th>
              <th className="py-2 px-4 bg-gray-200 font-semibold text-gray-700">Max Meeting Duration</th>
              <th className="py-2 px-4 bg-gray-200 font-semibold text-gray-700">Max Meetings Per Month</th>
              <th className="py-2 px-4 bg-gray-200 font-semibold text-gray-700">Teams</th>
              <th className="py-2 px-4 bg-gray-200 font-semibold text-gray-700">Reach</th>
              <th className="py-2 px-4 bg-gray-200 font-semibold text-gray-700">Org Openings</th>
              <th className="py-2 px-4 bg-gray-200 font-semibold text-gray-700">Project Management</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(plans).map((plan, index) => (
              <tr key={index} className="border-t">
                <td className="py-2 px-4 text-center">{plan.Name}</td>
                <td className="py-2 px-4 text-center">{plan.Analytics ? 'Yes' : 'No'}</td>
                <td className="py-2 px-4 text-center">{plan.Meetings.MaxDuration}</td>
                <td className="py-2 px-4 text-center">{plan.Meetings.MaxMeetingsPerMonth}</td>
                <td className="py-2 px-4 text-center">{plan.Teams ? 'Yes' : 'No'}</td>
                <td className="py-2 px-4 text-center">{plan.Reach}</td>
                <td className="py-2 px-4 text-center">{plan.OrgOpenings ? 'Yes' : 'No'}</td>
                <td className="py-2 px-4 text-center">{plan.ProjectManagement ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];

  return (
    <div className="w-[100vw] h-[100vh] relative">
      {/* <div className="w-1/2 absolute translate-x-1/2 translate-y-1/2">
        <DraggableList items={items} />
        <div>hello</div>
      </div> */}
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <SubscriptionTable />
        </div>
      </div>
    </div>
  );
};

export default App;
