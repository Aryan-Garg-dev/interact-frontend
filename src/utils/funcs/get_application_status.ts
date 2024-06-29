const getApplicationStatus = (status: number): string => {
  switch (status) {
    case -1:
      return 'Rejected';
    case 0:
      return 'Submitted';
    case 1:
      return 'Shortlisted';
    case 2:
      return 'Accepted';
    default:
      return '';
  }
};

export default getApplicationStatus;
