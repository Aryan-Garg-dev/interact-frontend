import { UserState } from '@/slices/userSlice';
import { initialUser } from '@/types/initials';

export const getUserFromState = (reduxUser: UserState) => {
  const user = initialUser;
  user.id = reduxUser.id;
  user.name = reduxUser.name;
  user.username = reduxUser.username;
  user.profilePic = reduxUser.profilePic;

  return user;
};
