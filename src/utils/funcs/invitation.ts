const getInvitationStatus = (status: number): string => {
  switch (status) {
    case -1:
      return 'Rejected';
    case 0:
      return 'Waiting';
    case 1:
      return 'Accepted';
    default:
      return '';
  }
};

const danger = '#fbbebe';
const warn = '#fbf9be';
const success = '#bffbbe';

export const getInvitationStatusColor = (status: number): string => {
  switch (status) {
    case -1:
      return danger;
    case 0:
      return warn;
    case 1:
      return success;
    default:
      return '';
  }
};

export default getInvitationStatus;
