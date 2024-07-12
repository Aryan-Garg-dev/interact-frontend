import { TaskHistory } from '@/types';
import TaskHistoryWrapper from '@/wrappers/task_history';
import React from 'react';

interface Props {
  history: TaskHistory;
}

const Assigned = ({ history }: Props) => {
  switch (history.historyType) {
    case 0: // User assigned task to user
      return (
        <TaskHistoryWrapper history={history}>
          <div className="w-fit text-center flex-center gap-1">
            assigned the task to <b>{history.assignee.name}</b>.
          </div>
        </TaskHistoryWrapper>
      );
    case 3: // User assigned subtask to user
      return (
        <TaskHistoryWrapper history={history}>
          <div className="w-fit text-center flex-center gap-1">
            assigned the subtask to <b>{history.assignee.name}</b>.
          </div>
        </TaskHistoryWrapper>
      );
    default:
      return null;
  }
};

export default Assigned;
