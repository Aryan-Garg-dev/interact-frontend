import { SubTask, Task } from '@/types';
import { ArrowArcLeft, Gear, Trash, PlusCircle } from '@phosphor-icons/react';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { userSelector } from '@/slices/userSlice';
import ToolTip from '@/components/utils/tooltip';
import { getTaskDeadlineColor, getTaskPriorityColor } from '@/utils/funcs/task';
import UsersList from '@/components/common/users_list';
import PictureList from '@/components/common/picture_list';
import Tags from '@/components/common/tags';
import SubTasksTable from '@/components/tables/subtasks';
import CommentBox from '@/components/comment/comment_box';
import renderContentWithLinks from '@/utils/funcs/render_content_with_links';
import CopyClipboardButton from '@/components/buttons/copy_clipboard_btn';

interface Props {
  task: Task;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setClickedTaskID?: React.Dispatch<React.SetStateAction<number>>;
  setClickedOnEditTask: React.Dispatch<React.SetStateAction<boolean>>;
  setClickedOnDeleteTask: React.Dispatch<React.SetStateAction<boolean>>;
  setClickedOnNewSubTask: React.Dispatch<React.SetStateAction<boolean>>;
  setClickedSubTask: React.Dispatch<React.SetStateAction<SubTask>>;
  setClickedOnViewSubTask: React.Dispatch<React.SetStateAction<boolean>>;
  toggleComplete: () => void;
  accessChecker: boolean;
  userFetchURL?: string;
}

const TaskComponent = ({
  task,
  setShow,
  setClickedTaskID,
  setClickedOnEditTask,
  setClickedOnDeleteTask,
  setClickedOnNewSubTask,
  setClickedSubTask,
  setClickedOnViewSubTask,
  toggleComplete,
  accessChecker,
  userFetchURL,
}: Props) => {
  const isAssignedUser = (userID: string) => {
    var check = false;
    task.users.forEach(user => {
      if (user.id == userID) {
        check = true;
        return;
      }
    });
    return check;
  };

  const [clickedOnUsers, setClickedOnUsers] = useState(false);

  const user = useSelector(userSelector);

  useEffect(() => {
    document.documentElement.style.overflowY = 'hidden';
    document.documentElement.style.height = '100vh';

    return () => {
      document.documentElement.style.overflowY = 'auto';
      document.documentElement.style.height = 'auto';
    };
  }, []);

  return (
    <>
      {clickedOnUsers && <UsersList title="Task Users" users={task.users} setShow={setClickedOnUsers} />}
      <div className="w-no_side_base_open h-base fixed bg-gray-50 top-navbar overflow-y-auto flex flex-col gap-4 p-8 pt-4 font-primary animate-fade_third z-10">
        <div className="w-full flex flex-col gap-2">
          <ArrowArcLeft
            className="cursor-pointer"
            size={24}
            onClick={() => {
              if (setClickedTaskID) setClickedTaskID(-1);
              setShow(false);
            }}
          />
          <div className="w-full flex justify-between items-center">
            <div className="flex-center gap-2">
              <div className="text-4xl font-semibold">{task.title}</div>
              <div className="relative group">
                <ToolTip
                  content="Copy Task Link"
                  styles={{
                    fontSize: '10px',
                    padding: '2px',
                    width: '120px',
                    top: '-60%',
                    left: '50%',
                    translate: '-50% 0',
                    border: 'none',
                  }}
                />
                <CopyClipboardButton
                  url={
                    task.organizationID != ''
                      ? `organisations?oid=${task.organizationID}&redirect_url=/tasks?tid=${task.id}`
                      : `workspace/tasks/${task.project?.title}?tid=${task.id}`
                  }
                  iconOnly={true}
                  size={28}
                />
              </div>
            </div>
            <div className="flex-center gap-2">
              {accessChecker && (
                <>
                  <Gear onClick={() => setClickedOnEditTask(true)} className="cursor-pointer" size={32} />
                  <Trash onClick={() => setClickedOnDeleteTask(true)} className="cursor-pointer" size={32} />
                </>
              )}
              {(isAssignedUser(user.id) || accessChecker) && (
                <div
                  className={`${
                    task.isCompleted
                      ? 'bg-priority_low hover:bg-priority_high'
                      : 'bg-primary_comp hover:bg-priority_low'
                  } font-semibold px-4 py-2 rounded-md transition-ease-300`}
                >
                  {task.isCompleted ? (
                    <span onClick={toggleComplete} className="relative group cursor-pointer">
                      <ToolTip content="Mark Incomplete" />
                      <div className="font-semibold">Completed</div>
                    </span>
                  ) : (
                    <div onClick={toggleComplete} className="cursor-pointer">
                      Mark Completed
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col gap-4">
          <div className="text-lg">{renderContentWithLinks(task.description)}</div>
          <Tags tags={task.tags} />
        </div>
        <div className="w-fit flex-center gap-16">
          <div className="flex gap-2 items-center">
            <div>Priority:</div>
            <div
              style={{ backgroundColor: getTaskPriorityColor(task) }}
              className="uppercase px-3 py-1 rounded-lg text-sm font-medium"
            >
              {task.priority}
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <div>Deadline:</div>
            <div
              style={{ backgroundColor: getTaskDeadlineColor(task) }}
              className="w-fit px-3 py-1 rounded-lg text-sm font-medium"
            >
              <div className="font-semibold">{moment(task.deadline).format('DD-MMM-YY')}</div>
            </div>
            <div className="text-xs">({moment(task.deadline).fromNow()})</div>
          </div>
        </div>

        {task.users.length > 0 ? (
          <div onClick={() => setClickedOnUsers(true)} className="w-fit h-fit flex-center gap-2 cursor-pointer">
            <div className="text-xl font-medium">Assigned To: </div>
            <PictureList users={task.users} size={8} gap={2} />
          </div>
        ) : (
          accessChecker && (
            <div
              onClick={() => setClickedOnEditTask(true)}
              className="w-full text-base bg-gray-100 rounded-xl p-4 cursor-pointer transition-ease-300"
            >
              <span className="text-xl max-lg:text-lg text-gradient font-semibold">Your task is lonely! </span> and
              looking for a buddy. Don&apos;t leave it hanging, assign it to a team member and let the magic begin! 🚀
            </div>
          )
        )}

        <div className="w-full border-[#34343479] border-t-[1px]"></div>

        {task.subTasks?.length > 0 ? (
          <div className="w-full flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <div className="text-xl font-medium">Subtasks</div>
              {(isAssignedUser(user.id) || accessChecker) && (
                <PlusCircle
                  onClick={() => setClickedOnNewSubTask(true)}
                  className="bg-gray-50 rounded-full cursor-pointer"
                  size={24}
                  weight="bold"
                />
              )}
            </div>
            <SubTasksTable
              subtasks={task.subTasks}
              setClickedOnTask={setClickedOnViewSubTask}
              setClickedSubTask={setClickedSubTask}
            />
          </div>
        ) : (
          (isAssignedUser(user.id) || accessChecker) && (
            <div
              onClick={() => setClickedOnNewSubTask(true)}
              className="w-full text-base bg-gray-100 rounded-xl p-4 cursor-pointer transition-ease-300"
            >
              <span className="text-xl max-lg:text-lg text-gradient font-semibold">Divide and conquer! </span> Big tasks
              can be daunting! Break them down into bite-sized subtasks for smoother sailing. 📋
            </div>
          )
        )}
        <div className="pb-32">
          <div className="text-xl font-medium">Conversations</div>
          <CommentBox type="task" item={task} userFetchURL={userFetchURL} />
        </div>
      </div>
    </>
  );
};

export default TaskComponent;
