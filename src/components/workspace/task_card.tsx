import { Task } from '@/types';
import getCompletionPercentage from '@/utils/funcs/task';
import moment from 'moment';
import React from 'react';

interface Props {
  task: Task;
  index: number;
  clickedTaskID: number;
  clickedOnTask: boolean;
  setClickedOnTask?: React.Dispatch<React.SetStateAction<boolean>>;
  setClickedTaskID?: React.Dispatch<React.SetStateAction<number>>;
}

const TaskCard = ({ task, index, clickedTaskID, clickedOnTask, setClickedOnTask, setClickedTaskID }: Props) => {
  return (
    <div
      onClick={() => {
        if (setClickedOnTask) setClickedOnTask(true);
        if (setClickedTaskID) setClickedTaskID(index);
      }}
      className={`w-full ${
        index == clickedTaskID ? 'bg-white' : 'hover:bg-gray-100'
      } relative flex justify-between items-center gap-2 rounded-lg px-6 py-4 border-gray-800 border-dotted border-2 cursor-pointer transition-ease-300`}
    >
      <div className="grow flex flex-col gap-2">
        <div className="font-semibold text-xl">{task.title}</div>
        <div className="text-sm text-gray-600">{task.description}</div>
        <div className="flex gap-2 text-sm">
          <div>Deadline: </div>
          <div> {moment(task.deadline).format('DD-MMM-YY')}</div>
        </div>
      </div>
      {clickedOnTask ? (
        <div className="text-4xl font-bold text-gradient">{getCompletionPercentage(task)}%</div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="text-5xl max-md:text-2xl font-bold text-gradient">{getCompletionPercentage(task)}%</div>
          <div className="w-40 h-2 max-md:hidden border-dark_primary_btn border-2 rounded-lg">
            <div
              style={{ width: getCompletionPercentage(task) + '%' }}
              className="h-full bg-dark_primary_btn rounded-lg"
            ></div>
          </div>
        </div>
      )}

      <div
        style={{
          backgroundColor: task.priority == 'high' ? '#fbbebe' : task.priority == 'medium' ? '#fbf9be' : '#bffbbe',
        }}
        className="absolute px-3 py-1 rounded-xl text-xs uppercase top-0 right-0 -translate-y-1/2 z-5"
      >
        {task.priority}
      </div>
    </div>
  );
};

export default TaskCard;
