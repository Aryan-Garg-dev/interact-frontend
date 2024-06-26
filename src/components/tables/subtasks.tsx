import { SubTask, Task } from '@/types';
import React from 'react';
import PictureList from '../common/picture_list';
import moment from 'moment';
import { getSubtaskColor, getTaskDeadlineColor, getTaskPriorityColor } from '@/utils/funcs/task';

interface Props {
  subtasks: SubTask[];
  setClickedOnTask: React.Dispatch<React.SetStateAction<boolean>>;
  setClickedSubTask: React.Dispatch<React.SetStateAction<SubTask>>;
}

const SubTasksTable = ({ subtasks, setClickedOnTask, setClickedSubTask }: Props) => {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full h-12 bg-slate-100 rounded-xl border-gray-400 flex font-semibold text-primary_black">
        <div className="w-[35%] flex-center">Title</div>
        <div className="w-[20%] flex-center">Assigned To</div>
        <div className="w-[15%] flex-center">Priority</div>
        <div className="w-[15%] flex-center">Deadline</div>
        <div className="w-[15%] flex-center">Status</div>
      </div>
      {subtasks.map(task => (
        <div
          key={task.id}
          onClick={() => {
            setClickedSubTask(task);
            setClickedOnTask(true);
          }}
          className="w-full h-12 bg-slate-50 hover:bg-slate-200 rounded-xl border-gray-400 flex text-sm text-primary_black transition-ease-300 cursor-pointer"
        >
          <div className="w-[35%] flex-center text-gl font-medium">{task.title}</div>
          <div className="w-[20%] flex-center">
            <PictureList users={task.users} size={6} gap={2} />
          </div>
          <div className="w-[15%] flex-center">
            <div
              className="flex-center px-3 py-1 rounded-full text-xs"
              style={{ backgroundColor: getTaskPriorityColor(task) }}
            >
              {task.priority}
            </div>
          </div>
          <div className="w-[15%] flex-center">
            <div
              className="flex-center px-3 py-1 rounded-full text-xs"
              style={{ backgroundColor: getTaskDeadlineColor(task) }}
            >
              {moment(task.deadline).format('DD MMM YY')}
            </div>
          </div>
          <div className="w-[15%] flex-center">
            <div
              className="flex-center px-3 py-1 rounded-full text-xs"
              style={{ backgroundColor: getSubtaskColor(task) }}
            >
              {task.isCompleted ? 'Completed' : 'Not Completed'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubTasksTable;
