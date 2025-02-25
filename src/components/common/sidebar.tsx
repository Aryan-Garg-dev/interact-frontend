import React, { CSSProperties, ReactNode, useEffect, useMemo, useState } from 'react';
import SidebarItem from './sidebar_item';
import {
  ArrowLineLeft,
  Bell,
  Buildings,
  CalendarDots,
  Envelope,
  Gear,
  HouseLine,
  ReadCvLogo,
  RocketLaunch,
  UserCircle,
} from '@phosphor-icons/react';
import { useDispatch, useSelector } from 'react-redux';
import { navbarOpenSelector, toggleNavbarOpen } from '@/slices/feedSlice';
import useUserStateFetcher from '@/hooks/user_fetcher';
import BottomBar from './bottombar';
import { resetUser, userSelector } from '@/slices/userSlice';
import { resetConfig } from '@/slices/configSlice';
import { currentOrgSelector, resetCurrentOrg } from '@/slices/orgSlice';
import Cookies from 'js-cookie';
import ConfirmDelete from './confirm_delete';
import { Check, ChevronsUpDown, LogOutIcon } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Image from 'next/image';
import { USER_PROFILE_PIC_URL } from '@/config/routes';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  CircularProgressbarWithChildren,
  buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
interface Props {
  index: number;
}

const Sidebar = ({ index }: Props) => {
  const [active, setActive] = useState(index);

  const open = useSelector(navbarOpenSelector);
  const user = useSelector(userSelector);

  const dispatch = useDispatch();

  const [clickedOnLogout, setClickedOnLogout] = useState(false);

  const handleLogout = () => {
    dispatch(resetUser());
    dispatch(resetConfig());
    dispatch(resetCurrentOrg());
    Cookies.remove('id');
    Cookies.remove('token');
    setClickedOnLogout(false);

    window.location.replace('/login');
  };

  const userFetcher = useUserStateFetcher();

  useEffect(() => {
    if (user.id != '') userFetcher();
  }, []);

  return (
    <>
      {clickedOnLogout && (
        <Dialog open={clickedOnLogout} onOpenChange={setClickedOnLogout}>
          <DialogContent className={'space-y-4'}>
            <DialogHeader className={'-space-y-1'}>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>You will be logged out of this application</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <div className={"w-full flex justify-center gap-8 max-md:flex-col max-md:gap-2"}>
                <Button variant={'destructive'} onClick={handleLogout} className={'w-full'}>Confirm</Button>
                <Button variant={"secondary"} onClick={setClickedOnLogout.bind(null, false)} className={"w-full"}>Cancel</Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      <div
        className={`${
          open ? 'w-sidebar_open' : 'w-sidebar_close'
        } h-base overflow-y-auto overflow-x-hidden thin_scrollbar bg-sidebar border-gray-300 border-r-[1px] dark:border-0 dark:bg-dark_sidebar backdrop-blur-sm fixed mt-navbar py-3 flex flex-col justify-between pl-[30px] transition-ease-out-500 max-lg:hidden`}
      >
        <div className={`${open ? 'w-[220px]' : 'w-12'} transition-ease-500 flex flex-col gap-2`}>
          <div className={`w-full flex justify-end ${!open && 'pr-3'}`}>
            <ToggleSidebar open={open} setOpen={() => dispatch(toggleNavbarOpen())} />
          </div>
          <ProfileView />
        </div>
        <div className={"flex flex-col gap-2 h-full justify-center"}>
          <div className="w-full flex flex-col gap-2">
            <SidebarItem index={1} title="Home" icon={<HouseLine size={24} />} active={active} setActive={setActive} />
            <SidebarItem
              index={2}
              title="Projects"
              icon={<RocketLaunch size={24} />}
              active={active}
              setActive={setActive}
            />
            <SidebarItem
              index={3}
              title="Events"
              icon={<CalendarDots size={24} />}
              active={active}
              setActive={setActive}
            />
            <SidebarItem
              index={4}
              title="Organisations"
              icon={<Buildings size={24} />}
              active={active}
              setActive={setActive}
            />
            <SidebarItem
              index={5}
              title="Openings"
              icon={<ReadCvLogo size={24} />}
              active={active}
              setActive={setActive}
            />
          </div>
          {/* {user.id != '' && user.organizationMemberships && user.organizationMemberships.length > 0 && <Organisations />} */}
          {user.id != '' && (
            <div className="w-fit py-4 border-y-2 border-gray-300 dark:border-dark_primary_btn flex flex-col gap-2">
              <SidebarItem
                index={7}
                title="Profile"
                url={`/users/${user.username}`}
                icon={<UserCircle size={24} />}
                active={active}
                setActive={setActive}
              />
              <SidebarItem
                index={10}
                title="Invitations"
                icon={<Envelope size={24} />}
                active={active}
                setActive={setActive}
              />
              <SidebarItem index={9} title="Settings" icon={<Gear size={24} />} active={active} setActive={setActive} />
              {/* {open && <Theme />} */}
            </div>
          )}
        </div>

        <Logout onClick={()=>setClickedOnLogout(true)} />
        {/*<ArrowLineLeft*/}
        {/*  onClick={() => dispatch(toggleNavbarOpen())}*/}
        {/*  className={`cursor-pointer ml-2 mt-2 ${*/}
        {/*    open ? 'rotate-0' : '-rotate-180'*/}
        {/*  } text-gray-500 dark:text-white transition-ease-500`}*/}
        {/*  size={24}*/}
        {/*/>*/}

        {/* <Profile /> */}
      </div>
      <BottomBar index={index} />
    </>
  );
};

export default Sidebar;

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const Profile = () => {
  const open = useSelector(navbarOpenSelector);
  const user = useSelector(userSelector);
  return (
    <div className="w-[220px]">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div
            className={`${
              open ? 'w-[220px]' : 'w-10 '
            } h-10 p-[8.5px] rounded-lg hover:bg-primary_comp dark:hover:bg-dark_primary_comp_hover text-gray-500 dark:text-white relative font-primary font-medium items-center transition-ease-out-500`}
          >
            {
              <div
                className={`absolute top-1/2 -translate-y-1/2 ${
                  open ? 'opacity-100 left-[64px]' : 'opacity-0 left-[0px] animate-shrink'
                } transition-ease-500`}
              >
                {user.name}
              </div>
            }
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[220px] -right-10">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuItem>Subscription</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const Organisations = () => {
  const navbarOpen = useSelector(navbarOpenSelector);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');

  const user = useSelector(userSelector);
  const currentOrg = useSelector(currentOrgSelector);

  const organisations = user.organizationMemberships.map(m => {
    return {
      label: m.organization.title,
      value: m.organization.title.toLowerCase(),
    };
  });

  return (
    <div
      className={`${
        navbarOpen ? 'w-[220px]' : 'w-10 '
      } h-10 p-[8.5px] rounded-lg hover:bg-primary_comp dark:hover:bg-[#0000002b] text-gray-500 dark:text-white relative font-primary font-medium items-center transition-ease-out-500`}
    >
      <Buildings size={24} />

      <div
        className={`absolute top-1/2 -translate-y-1/2 ${
          navbarOpen ? 'opacity-100 left-[64px]' : 'opacity-0 left-[0px] animate-shrink'
        } transition-ease-500`}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="flex-center justify-between">
              {value ? organisations.find(framework => framework.value === value)?.label : 'Organisations'}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search" />
              <CommandList>
                <CommandEmpty>No organisations found.</CommandEmpty>
                <CommandGroup>
                  {organisations.map(o => {
                    const membership = user.organizationMemberships.filter(m => m.organization.title == o.label)[0];
                    return (
                      <CommandItem
                        key={o.value}
                        value={o.value}
                        onSelect={currentValue => {
                          setValue(currentValue === value ? '' : currentValue);
                          setOpen(false);
                        }}
                        className="flex items-center gap-2"
                      >
                        {currentOrg.title === o.label ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Image
                            crossOrigin="anonymous"
                            width={25}
                            height={25}
                            alt={''}
                            src={`${USER_PROFILE_PIC_URL}/${membership?.organization?.user?.profilePic}`}
                            className="w-4 h-4 rounded-full"
                          />
                        )}
                        {o.label}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

interface LogoutProps {
  onClick: () => void;
}
const Logout = (props: LogoutProps)=>{
  const open = useSelector(navbarOpenSelector);
  return (
    <TooltipProvider>
      <Tooltip>
        <div
          onClick={props.onClick}
          className={`${open ? 'w-[220px]' : 'w-12'} h-10 p-[8.5px] px-3 rounded-lg hover:bg-primary_comp dark:hover:bg-dark_primary_comp_hover text-gray-600 dark:text-white relative font-primary font-medium items-center transition-ease-out-500 cursor-pointer`}
        >
          <TooltipTrigger>
            <LogOutIcon size={24} />
          </TooltipTrigger>
          {
            <div
              className={`absolute top-1/2 -translate-y-1/2 ${
                open ? 'opacity-100 left-[64px]' : 'opacity-0 left-[0px] animate-shrink'
              } transition-ease-500`}
            >
              Log out
            </div>
          }
        </div>
        <TooltipContent align={'center'} side={'right'} hidden={open} sideOffset={15} className={'font-dm_sans'}>
          Logout
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}


interface ToggleSidebarProps {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}
const ToggleSidebar = ({open, setOpen}: ToggleSidebarProps)=>{
  return (
    <label className="hamburger">
      <input type="checkbox" checked={open} onClick={()=>setOpen(open=>!open)} />
        <svg viewBox="0 0 32 32" className={"size-6 "}>
          <path className="line  line-top-bottom" d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"></path>
          <path className="line" d="M7 16 27 16"></path>
        </svg>
    </label>
  )
}


interface ProfileCompProps {

}

const ProfileView = ()=>{
  const user = useSelector(userSelector);

  const profileCompletionPercentage = useMemo((): number => {
    const totalPoints = 5;
    var counter = 0;
    if ((user.following || []).length >= 3) counter++;
    if ((user.links || []).length != 0) counter++;
    if (user.tagline != '') counter++;
    if (user.email != '' && user.isVerified) counter++;
    if ((user.ownerProjects || []).length != 0) counter++;
    return Math.floor((counter / totalPoints) * 100);
  }, [user]);

  const open = useSelector(navbarOpenSelector);

  if (!open){
    return (
     <div>
       <CircularProgressbarWithChildren
         value={profileCompletionPercentage}
         className={'w-12 h-12'}
         strokeWidth={6}
          styles={buildStyles({
            strokeLinecap: "butt",
            pathColor: "url(#progressGradient)",
          })}
       >
         <Image
           crossOrigin="anonymous"
           className="w-10 h-10 max-md:w-6 max-md:h-6 max-md:ml-2 rounded-full cursor-pointer"
           width={50}
           height={50}
           alt="user"
           src={`${USER_PROFILE_PIC_URL}/${user.profilePic != '' ? user.profilePic : 'default.jpg'}`}
         />
         <svg width="0" height="0">
           <defs>
             <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
               <stop offset="0%" stopColor="#4B9EFF" />
               <stop offset="100%" stopColor="#607EE7" />
             </linearGradient>
           </defs>
         </svg>
         {/*<RadialSeparators*/}
         {/*  count={10}*/}
         {/*  className={"rounded-xl"}*/}
         {/*  style={{*/}
         {/*    background: "#fff",*/}
         {/*    width: 10,*/}
         {/*    height: 2,*/}
         {/*  }}*/}
         {/*/>*/}
       </CircularProgressbarWithChildren>
     </div>
    )
  }
  return (
    <div className={"font-dm_sans flex flex-col gap-2 px-1"}>
      <div className={"flex gap-2"}>
        <div className={"flex-center"}>
          <Image
            crossOrigin="anonymous"
            className="w-12 h-12 max-md:w-6 max-md:h-6 max-md:ml-2 rounded-full cursor-pointer"
            width={50}
            height={50}
            alt="user"
            src={`${USER_PROFILE_PIC_URL}/${user.profilePic != '' ? user.profilePic : 'default.jpg'}`}
          />
        </div>
        <div className={"flex flex-col justify-between"}>
          <div className={'text-lg font-semibold truncate line-clamp-1'}>{user.name}</div>
          <div className={'text-sm font-medium'}>@{user.username}</div>
        </div>
      </div>
      <div className={"flex flex-col dark:text-neutral-200 text-neutral-800 gap-0.5"}>
        <div className={"flex justify-between"}>
          <div className={'text-xs'}>Profile Completion</div>
          <div className={"text-xs"}>{profileCompletionPercentage}%</div>
        </div>
        <Progress value={profileCompletionPercentage} />
      </div>
    </div>
  )
}

function Separator(props: { turns: number, className?: string, style: CSSProperties | undefined }) {
  return (
    <div
      style={{
        position: "absolute",
        height: "100%",
        transform: `rotate(${props.turns}turn)`
      }}
    >
      <div style={props.style} className={props.className} />
    </div>
  );
}

function RadialSeparators(props: { count: number, className?: string, style?: CSSProperties | undefined }) {
  const turns = 1 / props.count;
  return <>{Array.from({length: props.count}).map((_, index) => (
    <Separator turns={index * turns} style={props.style} className={props.className} key={index} />
  ))}</>
}

