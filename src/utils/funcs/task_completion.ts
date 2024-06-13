import { Task } from '@/types';

const getCompletionPercentage = (task: Task) => {
  var percentage = 0;
  if (task.isCompleted) percentage = 100;
  else if (task.subTasks) {
    if (task.subTasks.length == 0) percentage = 0;
    else {
      var completedSubtasks = 0;
      task.subTasks.forEach(subtask => {
        if (subtask.isCompleted) completedSubtasks++;
      });
      percentage = (completedSubtasks / task.subTasks.length) * 100;
    }
  }
  return parseFloat(percentage.toFixed(2));
};

export default getCompletionPercentage;
