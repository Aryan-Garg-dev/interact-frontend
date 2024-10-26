import { Button } from '@/components/ui/button';
import { DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { SERVER_ERROR } from '@/config/errors';
import { COMMUNITY_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import patchHandler from '@/handlers/patch_handler';
import { Community, CommunityMembership, CommunityRole } from '@/types';
import categories from '@/utils/categories';
import Toaster from '@/utils/toaster';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import React, { useEffect, useState } from 'react';
import isArrEdited from '@/utils/funcs/check_array_edited';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MagnifyingGlass, X } from '@phosphor-icons/react';
import getHandler from '@/handlers/get_handler';
import Image from 'next/image';
import moment from 'moment';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { COMMUNITY_ADMIN, COMMUNITY_MEMBER, COMMUNITY_MODERATOR } from '@/config/constants';
import { useSelector } from 'react-redux';
import { userSelector } from '@/slices/userSlice';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import postHandler from '@/handlers/post_handler';

const EditMemberships = ({
  community,
  setCommunity,
}: {
  community: Community;
  setCommunity: React.Dispatch<React.SetStateAction<Community>>;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [memberships, setMemberships] = useState<CommunityMembership[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMemberships = async (key: string, abortController: AbortController) => {
    const URL = `${COMMUNITY_URL}/${community.id}/members?search=${key}`;
    const res = await getHandler(URL, abortController.signal);
    if (res.statusCode == 200) {
      setMemberships(res.data.memberships || []);
      setLoading(false);
    } else {
      if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
      else Toaster.error(SERVER_ERROR, 'error_toaster');
    }
  };

  let oldAbortController: AbortController | null = null;

  const handleChange = (el: React.ChangeEvent<HTMLInputElement>) => {
    const abortController = new AbortController();
    if (oldAbortController) oldAbortController.abort();
    oldAbortController = abortController;
    fetchMemberships(el.target.value, abortController);
    setSearch(el.target.value);
  };

  useEffect(() => {
    const abortController = new AbortController();
    oldAbortController = abortController;
    fetchMemberships('', abortController);
  }, []);

  const handleChangeRole = async (membershipID: string, role: CommunityRole) => {
    const URL = `${COMMUNITY_URL}/${community.id}/membership`;
    const res = await patchHandler(URL, { membershipID, role });
    if (res.statusCode == 200) {
      setMemberships(prev =>
        prev.map(m => {
          if (m.id == membershipID) return { ...m, role: role };
          return m;
        })
      );
      Toaster.success('Membership Updated');
    } else {
      if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
      else Toaster.error(SERVER_ERROR, 'error_toaster');
    }
  };

  const handleRemoveMember = async (membershipID: string) => {
    const URL = `${COMMUNITY_URL}/${community.id}/remove`;
    const res = await postHandler(URL, { membershipID });
    if (res.statusCode == 200) {
      setMemberships(prev => prev.filter(m => m.id != membershipID));
      Toaster.success('Member Removed from Community');
    } else {
      if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
      else Toaster.error(SERVER_ERROR, 'error_toaster');
    }
  };

  const user = useSelector(userSelector);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
          Manage Members
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md min-w-[60%]">
        <DialogHeader>
          <DialogTitle className="text-3xl">Manage Members</DialogTitle>
          <DialogDescription>Manage your community members.</DialogDescription>
        </DialogHeader>
        <div className="w-full h-12 flex items-center px-4 gap-4 dark:bg-dark_primary_comp_hover rounded-md">
          <MagnifyingGlass size={24} />
          <input
            className="grow bg-transparent focus:outline-none font-medium"
            placeholder="Search"
            value={search}
            onChange={handleChange}
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined On</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {memberships?.map(membership => (
              <TableRow key={membership.id}>
                <TableCell className="flex-center gap-2">
                  <Image
                    crossOrigin="anonymous"
                    width={50}
                    height={50}
                    alt={'User Pic'}
                    src={`${USER_PROFILE_PIC_URL}/${membership.user.profilePic}`}
                    placeholder="blur"
                    blurDataURL={membership.user.profilePicBlurHash || 'no-hash'}
                    className="w-6 h-6 rounded-full z-[1]"
                  />
                  <div className="w-[calc(100%-24px)] flex max-md:flex-col md:items-center flex-wrap gap-1 max-md:gap-0">
                    <div className="font-medium text-lg max-md:text-sm line-clamp-1">{membership.user.name}</div>
                    <div className="text-xs max-md:text-xxs">@{membership.user.username}</div>
                  </div>
                </TableCell>
                <TableCell>
                  {user.id == membership.userID ? (
                    membership.role
                  ) : (
                    <Select
                      defaultValue={membership.role}
                      onValueChange={value => handleChangeRole(membership.id, value as CommunityRole)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={COMMUNITY_MEMBER}>{COMMUNITY_MEMBER}</SelectItem>
                        <SelectItem value={COMMUNITY_ADMIN}>{COMMUNITY_ADMIN}</SelectItem>
                        <SelectItem value={COMMUNITY_MODERATOR}>{COMMUNITY_MODERATOR}</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </TableCell>
                <TableCell>{moment(membership.createdAt).format('DD MMMM, YYYY')}</TableCell>
                <TableCell className="flex items-center justify-end">
                  {user.id != membership.userID && (
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <X size={20} />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove from Community?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. If the community is restricted, user will have to request
                            again to join.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleRemoveMember(membership.id)}>
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default EditMemberships;
