import { SERVER_ERROR } from '@/config/errors';
import {
  COMMUNITY_PROFILE_PIC_URL,
  COMMUNITY_URL,
  EXPLORE_URL,
  ORG_URL,
  POST_URL,
  USER_PROFILE_PIC_URL,
} from '@/config/routes';
import postHandler from '@/handlers/post_handler';
import Toaster from '@/utils/toaster';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { userSelector } from '@/slices/userSlice';
import { useSelector } from 'react-redux';
import NewPostImages from '@/components/home/new_post_images';
import NewPostHelper from '@/components/home/new_post_helper';
import { User } from '@/types';
import { useWindowWidth } from '@react-hook/window-size';
import { currentOrgSelector } from '@/slices/orgSlice';
import getHandler from '@/handlers/get_handler';
import TagUserUtils from '@/utils/funcs/tag_users';
import ModalWrapper from '@/wrappers/modal';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Checkbox from '@/components/form/checkbox';

import renderContentWithLinks from '@/utils/funcs/render_content_with_links';
import PreviewBtn from '@/components/common/preview_btn';
import Editor from '@/components/editor/editor';

interface Props {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setFeed?: React.Dispatch<React.SetStateAction<any[]>>;
  org?: boolean;
  initialCommunityID?: string;
}

const NewPost = ({ setShow, setFeed, org = false, initialCommunityID = '' }: Props) => {
  const [content, setContent] = useState<string>('');
  const [images, setImages] = useState<File[]>([]);
  const [showTipsModal, setShowTipsModal] = useState<boolean>(false);
  const [taggedUsernames, setTaggedUsernames] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showUsers, setShowUsers] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);

  const [showPreview, setShowPreview] = useState(false);

  const user = useSelector(userSelector);
  const currentOrg = useSelector(currentOrgSelector);

  const [openCommunityDropdown, setOpenCommunityDropdown] = React.useState(false);
  const [communityID, setCommunityID] = React.useState(initialCommunityID);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    document.documentElement.style.overflowY = 'hidden';
    document.documentElement.style.height = '100vh';

    return () => {
      document.documentElement.style.overflowY = 'auto';
      document.documentElement.style.height = 'auto';
    };
  }, []);

  const fetchUsers = async (search: string) => {
    const URL = `${EXPLORE_URL}/users?search=${search}&order=trending&limit=${10}&include=org`;
    const res = await getHandler(URL, undefined, true);
    if (res.statusCode == 200) {
      const userData: User[] = res.data.users || [];
      setUsers(org ? userData : userData.filter(u => u.id != user.id));
    } else {
      if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
      else Toaster.error(SERVER_ERROR, 'error_toaster');
    }
  };

  const tagsUserUtils = new TagUserUtils(
    cursorPosition,
    content,
    showUsers,
    taggedUsernames,
    setCursorPosition,
    setContent,
    fetchUsers,
    setShowUsers,
    setTaggedUsernames,
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'b' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      wrapSelectedText('**', '**');
    }
  };

  const wrapSelectedText = (prefix: string, suffix: string) => {
    const textarea = document.getElementById('textarea_id') as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + prefix + selectedText + suffix + content.substring(end);
    setContent(newText);
    textarea.focus();
    textarea.setSelectionRange(start + prefix.length, end + prefix.length);
  };

  const handleSubmit = async () => {
    if (content.trim() == '' || content.replace(/\n/g, '').length == 0) {
      Toaster.error('Caption cannot be empty!');
      return;
    }

    const toaster = Toaster.startLoad('Adding your Post..');
    const formData = new FormData();

    images.forEach(file => {
      formData.append('images', file);
    });
    formData.append('content', content.replace(/\n{3,}/g, '\n\n'));
    taggedUsernames.forEach(username => formData.append('taggedUsernames', username));
    formData.append('isOpen', String(isOpen));

    const URL = org
      ? `${ORG_URL}/${currentOrg.id}/posts`
      : communityID
      ? `${COMMUNITY_URL}/${communityID}/posts`
      : POST_URL; 

    const res = await postHandler(URL, formData, 'multipart/form-data');

    if (res.statusCode === 201) {
      setContent('');
      setImages([]);
      setShow(false);
      if (setFeed) setFeed(prev => [res.data.post, ...prev]);
      Toaster.stopLoad(toaster, 'Posted!', 1);
      setShow(false);
    } else if (res.statusCode == 413) {
      Toaster.stopLoad(toaster, 'Image/s too large', 0);
    } else {
      if (res.data.message) {
        Toaster.stopLoad(toaster, res.data.message, 0);
      } else {
        Toaster.stopLoad(toaster, SERVER_ERROR, 0);
      }
    }
  };

  const width = useWindowWidth();

  return (
    <ModalWrapper setShow={setShow} top="1/2" width="2/3" height="2/3" blur={true} border={false}>
      {/* <div className="fixed top-24 max-md:top-[calc(50%-75px)] w-[953px] max-lg:w-5/6 h-[560px] max-md:h-2/3 shadow-2xl dark:shadow-none backdrop-blur-xl bg-[#ffffff] dark:bg-dark_primary_comp flex flex-col justify-between max-md:items-end p-8 max-md:p-6 dark:text-white font-primary overflow-y-auto border-[1px] border-primary_btn  dark:border-dark_primary_btn rounded-lg right-1/2 translate-x-1/2 max-md:-translate-y-1/2 animate-fade_third z-30"> */}
      <div className="w-full h-full flex flex-col justify-between items-end">
        <div className="w-full flex flex-col gap-6">
          <div className="flex gap-4 max-md:w-full">
            <Image
              crossOrigin="anonymous"
              className="w-16 h-16 rounded-full"
              width={50}
              height={50}
              alt="user"
              src={`${USER_PROFILE_PIC_URL}/${org ? currentOrg.coverPic : user.profilePic || 'default.jpg'}`}
            />
            <div className="grow flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="w-fit max-md:w-full flex-center max-md:justify-between max-md:flex-wrap gap-12 max-md:gap-4">
                  <div className="flex flex-col">
                    <div className="text-2xl font-semibold">{org ? currentOrg.title : user.name}</div>
                    {!org && <div className="text-sm">@{user.username}</div>}
                  </div>

                  {user.communityMemberships && user.communityMemberships.length > 0 && (
                    <Popover open={openCommunityDropdown} onOpenChange={setOpenCommunityDropdown}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openCommunityDropdown}
                          className="w-[200px] justify-between"
                        >
                          {communityID
                            ? '@' +
                              user.communityMemberships?.find(membership => membership.communityID === communityID)
                                ?.community?.title
                            : 'Post in Community'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search Community..." />
                          <CommandList>
                            <CommandEmpty>No Community Found.</CommandEmpty>
                            <CommandGroup>
                              {user.communityMemberships?.map(membership => (
                                <CommandItem
                                  key={membership.id}
                                  value={membership.communityID}
                                  onSelect={currentValue => {
                                    setCommunityID(currentValue === communityID ? '' : currentValue);
                                    setOpenCommunityDropdown(false);
                                  }}
                                >
                                  {communityID === membership.communityID ? (
                                    <Check className="mr-2 h-4 w-4" />
                                  ) : (
                                    <Image
                                      crossOrigin="anonymous"
                                      className="w-4 h-4 rounded-full mr-2"
                                      width={20}
                                      height={20}
                                      alt="profile pic"
                                      src={`${COMMUNITY_PROFILE_PIC_URL}/${membership.community?.profilePic}`}
                                    />
                                  )}

                                  {membership.community?.title}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>

                <div
                  onClick={handleSubmit}
                  className="max-md:hidden w-[120px] h-[48px] bg-primary_comp dark:bg-dark_primary_comp hover:bg-primary_comp_hover dark:hover:bg-dark_primary_comp_hover active:bg-primary_comp_active dark:active:bg-dark_primary_comp_active transition-ease-300 shrink-0 flex-center text-lg font-semibold rounded-lg cursor-pointer"
                >
                  Post
                </div>
              </div>
              {width > 640 && (
                <div className="w-full flex flex-col gap-8 relative">
                  <div className="w-full flex gap-4 items-center">
                    <NewPostImages setSelectedFiles={setImages} />
                    {images.length == 0 && <NewPostHelper setShow={setShowTipsModal} show={showTipsModal} />}
                  </div>
                  <Editor editable setContent={setContent} placeholder='Start a conversation...' limit={2000} className="min-h-[150px]"  />
                  {communityID && (
                    <div className="w-full mt-4">
                      <Checkbox
                        label="Is the post open?" 
                        val={isOpen}
                        setVal={setIsOpen}
                        caption={
                          isOpen
                            ? 'Post will be shown on your profile as well.'
                            : "Post will only be shown in the community's feed."
                        }
                        border={false}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {width <= 640 && (
            <div className="md:hidden w-full flex flex-col gap-8 relative">
              <div className="w-full flex gap-4 items-center">
                <NewPostImages setSelectedFiles={setImages} />
                {images.length == 0 && (
                  <NewPostHelper setShow={setShowTipsModal} show={showTipsModal} smallScreen={true} />
                )}
                <PreviewBtn show={showPreview} setShow={setShowPreview} />
              </div>
              <Editor editable setContent={setContent} placeholder='Start a converstation...' limit={2000} className="min-h-[150px]"  />
              {communityID && (
                <div className="w-full my-4">
                  <Checkbox
                    label="Is the post open?"
                    val={isOpen}
                    setVal={setIsOpen}
                    caption={
                      isOpen
                        ? 'Post will be shown on your profile as well.'
                        : "Post will only be shown in the community's feed."
                    }
                    border={false}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {showUsers && users.length > 0 && (
          <div className="w-full bg-gradient-to-b from-white via-[#ffffffb2] via-[90%] dark:from-dark_primary_comp_hover dark:via-dark_primary_comp flex flex-wrap justify-center gap-3 py-4">
            {users.map(user => (
              <div
                key={user.id}
                onClick={() => tagsUserUtils.handleTagUser(user.username)}
                className="w-1/3 max-md:w-2/5 md:hover:scale-105 overflow-clip flex items-center gap-1 rounded-md border-[1px] border-primary_btn p-2 max-md:p-1 hover:bg-primary_comp cursor-pointer transition-ease-300"
              >
                <Image
                  crossOrigin="anonymous"
                  width={50}
                  height={50}
                  alt={'User Pic'}
                  src={`${USER_PROFILE_PIC_URL}/${user.profilePic}`}
                  className="rounded-full w-6 h-6"
                />
                <div className="flex md:items-center justify-center max-md:flex-col gap-2 max-md:gap-0">
                  <div className="text-sm max-md:text-xs font-semibold line-clamp-1">{user.name}</div>
                  <div className="text-xs max-md:text-xxs text-gray-500">@{user.username}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div
          onClick={handleSubmit}
          className="md:hidden w-[120px] h-[48px] bg-primary_comp dark:bg-dark_primary_comp hover:bg-primary_comp_hover active:bg-primary_comp_active dark:hover:bg-dark_primary_comp_hover dark:active:bg-dark_primary_comp_active transition-ease-300 shrink-0 flex-center text-lg font-semibold rounded-lg cursor-pointer"
        >
          Post
        </div>
      </div>
    </ModalWrapper>
  );
};

export default NewPost;
