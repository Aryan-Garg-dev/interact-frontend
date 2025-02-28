import { SubTask, Task } from '@/types';
import React from 'react';
import PictureList from '../common/picture_list';
import moment from 'moment';
import { getSubtaskColor, getTaskDeadlineColor, getTaskPriorityColor } from '@/utils/funcs/task';
import { USER_PROFILE_PIC_URL } from '@/config/routes';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface Props {
  subtasks: SubTask[];
  setClickedOnTask: React.Dispatch<React.SetStateAction<boolean>>;
  setClickedSubTask: React.Dispatch<React.SetStateAction<SubTask>>;
}

const SubTasksTable = ({ subtasks, setClickedOnTask, setClickedSubTask }: Props) => {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full h-12 bg-slate-100 rounded-xl border-gray-400 flex font-semibold text-primary_black max-md:text-xs">
        <div className="w-[35%] max-md:w-[40%] flex-center">Title</div>
        <div className="w-[20%] max-md:w-[25%] flex-center">Assigned To</div>
        <div className="w-[15%] flex-center">Priority</div>
        <div className="w-[15%] max-md:hidden flex-center">Deadline</div>
        <div className="w-[15%] max-md:w-[20%] flex-center">Status</div>
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
          <div className="w-[35%] max-md:w-[40%] flex-center font-medium max-md:text-xs">{task.title}</div>
          <div className="w-[20%] max-md:w-[25%] flex-center">
            <PictureList users={task.users} size={6} gap={2} />
          </div>
          <div className="w-[15%] flex-center">
            <div
              className="flex-center px-3 max-md:px-2 py-1 rounded-full text-xs max-md:text-xxs"
              style={{ backgroundColor: getTaskPriorityColor(task) }}
            >
              {task.priority}
            </div>
          </div>
          <div className="w-[15%] max-md:hidden flex-center">
            <div
              className="flex-center px-3 py-1 rounded-full text-xs"
              style={{ backgroundColor: getTaskDeadlineColor(task) }}
            >
              {moment(task.deadline).format('DD MMM YY')}
            </div>
          </div>
          <div className="w-[15%] max-md:w-[20%] flex-center">
            <div
              className="flex-center px-3 max-md:px-1 py-1 rounded-full text-xs max-md:text-xxs"
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

interface SubtasksListProps {
  subtasks: SubTask[];
  setClickedOnTask: React.Dispatch<React.SetStateAction<boolean>>;
  setClickedSubTask: React.Dispatch<React.SetStateAction<SubTask>>;
  selectedSubtasks: string[];
  setSelectedSubtasks: React.Dispatch<React.SetStateAction<string[]>>;
}

export const SubTasksList: React.FC<SubtasksListProps> = ({
  subtasks, setSelectedSubtasks, setClickedSubTask, setClickedOnTask, selectedSubtasks
})=>{
  return (
    <div className={"flex flex-col gap-3 font-primary"}>
      {subtasks.map((subtask, index)=>(
        <div
          key={subtask.id}
          className={"w-full px-5 py-3 flex max-lg:flex-col gap-2 border dark:border-neutral-700 rounded-md shadow-sm"}
          onClick={() => {
            setClickedSubTask(subtask);
            setClickedOnTask(true);
          }}
        >
          <div className={"flex gap-2 w-full"}>
            <div>{index+1}.</div>
            <div className={"h-full w-full flex flex-col justify-between gap-1"}>
              <div className={"flex max-lg:flex-col gap-2 line-clamp-1"}>
                <p className={"font-semibold truncate"}>{subtask.title}</p>
                <div className={"flex flex-wrap items-center gap-2 max-md:hidden"}>
                  <SubTaskMetric value={subtask.priority} color={getTaskPriorityColor(subtask)} />
                  <SubTaskMetric value={moment(subtask.deadline).format('DD MMM YY')} color={getTaskDeadlineColor(subtask)} />
                </div>
              </div>
              <div className={"flex gap-3"}>
                <span className={"max-md:text-sm"}>Assigned To:</span>
                <div className={"flex gap-2"}>
                  {subtask.users.map((user, index)=>(
                    <div key={index} className={"flex items-center flex-wrap justify-between gap-1 pr-1 border border-dark_primary_comp dark:border-neutral-700 rounded-full select-none"}>
                      <Image width={50} height={50} alt={"User Pic"} src={`${USER_PROFILE_PIC_URL}/${user.profilePic}`} className={"w-6 h-6 max-md:w-5 max-md:h-5 rounded-full"} />
                      <p className={"text-xs max-md:text-[0.65rem] p-1 max-md:p-0.5"}>{user.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className={"flex flex-col max-lg:px-5"}>
            <div className={"w-fit flex flex-nowrap items-center gap-1"}>
              <span className={"max-md:text-sm"}>Status:</span>
              <div
                className={cn("text-sm h-fit w-full flex items-center py-0.5 px-3 max-md:text-xs rounded-full border-2 border-progress", subtask.isCompleted && "bg-progress")}
              ><p>{subtask.isCompleted ? "Completed" : "Assigned"}</p></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

interface SubTaskMetricProps {
  title?: string,
  value: string,
  color: string,
  info?: string,
}
const SubTaskMetric: React.FC<SubTaskMetricProps> = ({title, value, color, info})=>{
  return (
    <div className="flex gap-2 items-center">
      {title && <div className={"font-semibold text-sm"}>{title}:</div>}
      <div
        style={{ backgroundColor: color }}
        className="uppercase px-3 rounded-md text-[0.75rem] font-medium dark:text-primary_black"
      >
        {value}
      </div>
      {info && <div className="text-xs max-md:hidden">{info}</div>}
    </div>
  )
}

export default SubTasksTable;
