import Loader from '@/components/common/loader';
import Order from '@/components/filters/order';
import Select from '@/components/filters/select';
import Tags from '@/components/filters/tags';
import Users from '@/components/filters/users';
import TasksTable from '@/components/tables/tasks';
import { SERVER_ERROR } from '@/config/errors';
import { PROJECT_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import NewTask from '@/sections/tasks/new_task';
import TaskView from '@/sections/workspace/task_view';
import { userSelector } from '@/slices/userSlice';
import { Project, Task, User } from '@/types';
import { initialProject } from '@/types/initials';
import { getUserFromState } from '@/utils/funcs/redux';
import Toaster from '@/utils/toaster';
import MainWrapper from '@/wrappers/main';
import { ChartLine, WarningCircle, SortAscending, Plus } from '@phosphor-icons/react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

interface Props {
  slug: string;
}

const ProjectTasks = ({ slug }: Props) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [project, setProject] = useState<Project>(initialProject);
  const [loading, setLoading] = useState(true);

  const [clickedOnTask, setClickedOnTask] = useState(false);
  const [clickedTaskID, setClickedTaskID] = useState(-1);

  const [clickedOnNewTask, setClickedOnNewTask] = useState(false);

  const [order, setOrder] = useState('deadline');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const user = useSelector(userSelector);

  const getTasks = (abortController: AbortController) => {
    const URL = `${PROJECT_URL}/tasks/populated/${slug}?order=${order}&search=${search}&tags=${tags.join(
      ','
    )}&priority=${priority}&is_completed=${status == '' ? '' : status == 'completed'}&user_id=${users
      .map(u => u.id)
      .join(',')}`;

    getHandler(URL, abortController.signal)
      .then(res => {
        if (res.statusCode === 200) {
          setProject(res.data.project);
          const taskData = res.data.tasks || [];
          setTasks(taskData);
          const tid = new URLSearchParams(window.location.search).get('tid');
          if (tid && tid != '') {
            taskData.forEach((task: Task, i: number) => {
              if (tid == task.id) {
                setClickedTaskID(i);
                setClickedOnTask(true);
              }
            });
          }

          setLoading(false);
        } else if (res.status != -1) {
          if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
          else {
            Toaster.error(SERVER_ERROR, 'error_toaster');
          }
        }
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      });
  };

  let oldAbortController: AbortController | null = null;

  useEffect(() => {
    const abortController = new AbortController();
    if (oldAbortController) oldAbortController.abort();
    oldAbortController = abortController;

    getTasks(abortController);
    return () => {
      abortController.abort();
    };
  }, [order, search, priority, status, tags, users]);

  return (
    <MainWrapper>
      {clickedOnNewTask && <NewTask org={false} setShow={setClickedOnNewTask} project={project} setTasks={setTasks} />}
      <div className="w-full flex flex-col">
        <div className="w-full flex justify-between items-center p-base_padding">
          <div className="flex-center gap-4">
            <div className="w-fit text-6xl font-semibold dark:text-white font-primary ">Tasks</div>
            <div className="flex-center gap-2">
              <Select
                fieldName="Status"
                options={['not_completed', 'completed']}
                icon={<ChartLine size={20} />}
                selectedOption={status}
                setSelectedOption={setStatus}
              />
              <Select
                fieldName="Priority"
                options={['low', 'medium', 'high']}
                icon={<WarningCircle size={20} />}
                selectedOption={priority}
                setSelectedOption={setPriority}
              />
              <Order
                fieldName="Sort By"
                options={['deadline', 'latest']}
                icon={<SortAscending size={20} />}
                selectedOption={order}
                setSelectedOption={setOrder}
              />
              <Tags selectedTags={tags} setSelectedTags={setTags} />
              <Users
                fieldName="Assigned To"
                users={[...project.memberships.map(m => m.user), getUserFromState(user)]}
                selectedUsers={users}
                setSelectedUsers={setUsers}
              />
              {/* <Search /> */}
            </div>
          </div>

          {(project.userID == user.id || user.managerProjects.includes(project.id)) && (
            <Plus
              onClick={() => setClickedOnNewTask(true)}
              size={42}
              className="flex-center rounded-full hover:bg-white p-2 transition-ease-300 cursor-pointer"
              weight="regular"
            />
          )}
        </div>

        <div className="w-full flex flex-col gap-6 px-2 py-2">
          {loading ? (
            <Loader />
          ) : tasks.length > 0 ? (
            <div className="w-full flex justify-evenly px-4">
              {clickedOnTask && (
                <TaskView
                  taskID={clickedTaskID}
                  tasks={tasks}
                  project={project}
                  setShow={setClickedOnTask}
                  setTasks={setTasks}
                  setClickedTaskID={setClickedTaskID}
                />
              )}
              <TasksTable tasks={tasks} setClickedOnTask={setClickedOnTask} setClickedTaskID={setClickedTaskID} />
            </div>
          ) : (
            <div className="mx-auto font-medium text-xl mt-8">No Tasks found :)</div>
          )}
        </div>
      </div>
    </MainWrapper>
  );
};

export default ProjectTasks;
