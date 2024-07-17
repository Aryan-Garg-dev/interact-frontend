import { TaskHistory } from '@/types';
import TaskHistoryWrapper from '@/wrappers/task_history';
import React from 'react';

interface Props {
  history: TaskHistory;
}

const Completed = ({ history }: Props) => {
  if (history.historyType === 6) {
    return (
      <TaskHistoryWrapper history={history}>
        <div className="w-fit text-center flex-center gap-1">marked the task as completed.</div>
      </TaskHistoryWrapper>
    );
  }
  return null;
};

export default Completed;
