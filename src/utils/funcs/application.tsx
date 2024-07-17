export const getApplicationStatus = (status: number): string => {
  switch (status) {
    case -1:
      return 'Rejected';
    case 0:
      return 'Waiting';
    case 1:
      return 'Shortlisted';
    case 2:
      return 'Accepted';
    default:
      return '';
  }
};

const danger = '#fbbebe';
const warn = '#fbf9be';
const info = '#607ee7';
const success = '#bffbbe';

export const getApplicationStatusColor = (status: number): string => {
  switch (status) {
    case -1:
      return danger;
    case 0:
      return warn;
    case 1:
      return info;
    case 2:
      return success;
    default:
      return '';
  }
};
