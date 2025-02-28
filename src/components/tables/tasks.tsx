import { Task } from '@/types';
import React, { useMemo, useState } from 'react';
import PictureList from '../common/picture_list';
import moment from 'moment';
import getCompletionPercentage, {
  getTaskDeadlineColor,
  getTaskPriorityColor,
  getTaskStatusColor,
} from '@/utils/funcs/task';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loader from '../common/loader';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface Props {
  tasks: Task[];
  fetcher: (abortController?: AbortController, initialPage?: number) => void;
  hasMore: boolean;
  setClickedOnTask: React.Dispatch<React.SetStateAction<boolean>>;
  setClickedTaskID: React.Dispatch<React.SetStateAction<number>>;
  selectedTasks: string[];
  setSelectedTasks: React.Dispatch<React.SetStateAction<string[]>>;
}

const TasksTable = ({ tasks, fetcher, hasMore, setClickedOnTask, setClickedTaskID, selectedTasks, setSelectedTasks }: Props) => {
  const handleSelectTask = (taskId: string)=>{
    if (selectedTasks.includes(taskId)) setSelectedTasks(tasks => tasks.filter(t => t != taskId));
    else setSelectedTasks(tasks => ([...tasks, taskId]));
  }

  const isTaskSelected = useMemo(
    () => (taskId: string) => selectedTasks.includes(taskId),
    [selectedTasks]
  );

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full h-12 bg-white dark:bg-dark_primary_comp_hover rounded-xl border-gray-400 dark:border-dark_primary_btn flex font-semibold text-primary_black dark:text-white max-md:text-sm pl-8 max-md:pl-0">
        <div className="w-[35%] flex-center">Title</div>
        <div className="w-[20%] max-md:w-[25%] flex-center">Assigned To</div>
        <div className="w-[15%] max-md:hidden flex-center">Priority</div>
        <div className="w-[15%] max-md:w-[20%] flex-center">Deadline</div>
        <div className="w-[15%] max-md:w-[20%] flex-center">Status</div>
      </div>
      <InfiniteScroll
        dataLength={tasks.length}
        next={fetcher}
        hasMore={hasMore}
        loader={<Loader />}
        className="w-full flex flex-col gap-2"
      >
        {tasks.map((task, index) => (
          <div
            key={task.id}
            onClick={() => {
              setClickedTaskID(index);
              setClickedOnTask(true);
            }}
            className="w-full h-12 py-2 bg-white dark:bg-dark_primary_comp_hover dark:hover:bg-dark_primary_comp_hover dark:hover:bg-dark_primary_comp_active rounded-xl border-gray-400 dark:border-dark_primary_btn flex text-sm text-primary_black dark:text-white transition-ease-300 cursor-pointer"
          >
            <div className={"w-8 max-md:hidden flex justify-center items-center"} onClick={e=>e.stopPropagation()}>
              <label>
                <input type={"checkbox"} className={"sr-only peer"} checked={isTaskSelected(task.id)} onClick={e=>{
                  e.stopPropagation()
                  handleSelectTask(task.id)
                }} />
                <div className="w-5 h-5 ml-3 relative rounded-full border-2 border-gray-500 peer-checked:border-blue-500 after:content-[''] after:absolute after:inset-0 after:m-auto after:invisible peer-checked:after:visible after:rounded-full after:size-3 after:transition-all peer-checked:after:bg-blue-500" onClick={e=>e.stopPropagation()} />
              </label>
            </div>
            <div className="w-[35%] flex-center font-medium max-md:text-sm">{task.title}</div>
            <div className="w-[20%] max-md:w-[25%] flex-center">
              <PictureList users={task.users} size={6} gap={2} />
            </div>
            <div className="w-[15%] max-md:hidden flex-center">
              <div
                className="flex-center px-3 py-1 rounded-full text-xs dark:text-primary_black"
                style={{ backgroundColor: getTaskPriorityColor(task) }}
              >
                {task.priority}
              </div>
            </div>
            <div className="w-[15%] max-md:w-[20%] flex-center">
              <div
                className="flex-center px-3 max-md:px-2 py-1 rounded-full text-xs max-md:text-xxs dark:text-primary_black"
                style={{ backgroundColor: getTaskDeadlineColor(task) }}
              >
                {moment(task.deadline).format('DD MMM YY')}
              </div>
            </div>
            <div className="w-[15%] max-md:w-[20%] flex-center px-2">
              <div className={"relative w-full h-6 mr-2 flex items-center rounded-full bg-primary/30 dark:bg-dark_primary_comp/50"}>
                <div className={cn("h-full rounded-full active-item-gradient")} style={{width: `${getCompletionPercentage(task)}%`}} />
                <p className={cn("absolute w-full text-center text-xs max-md:text-[0.55rem] font-primary text-white")}>
                  {task.isCompleted
                    ? 'Completed'
                    : getCompletionPercentage(task) == 0
                      ? 'Not Started'
                      : `${getCompletionPercentage(task)}%`
                  }
                </p>
              </div>
            </div>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default TasksTable;
