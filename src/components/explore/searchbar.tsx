import { Command, CommandEmpty, CommandInput, CommandList, CommandSeparator } from '@/components/ui/command';
import { SERVER_ERROR } from '@/config/errors';
import {
  COMMUNITY_PROFILE_PIC_URL,
  EVENT_PIC_URL,
  EXPLORE_URL,
  PROJECT_PIC_URL,
  USER_PROFILE_PIC_URL,
} from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import { Project, User, Opening, Event, Organization, Community } from '@/types';
import Toaster from '@/utils/toaster';
import { CommandLoading } from 'cmdk';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import Loader from '../common/loader';
import Image from 'next/image';
import Link from 'next/link';

const SearchBar = () => {
  const [results, setResults] = useState({
    projects: [] as Project[],
    users: [] as User[],
    openings: [] as Opening[],
    events: [] as Event[],
    organizations: [] as Organization[],
    communities: [] as Community[],
  });
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filters, setFilters] = useState<string[]>([]);

  //TODO add abort controller
  const fetchResults = async (search?: string) => {
    setLoading(true);
    const URL = `${EXPLORE_URL}/quick?${'search=' + search}&limit=3`;
    const res = await getHandler(URL);

    if (res.statusCode === 200) {
      setResults({
        projects: res.data.projects || [],
        users: res.data.users || [],
        openings: res.data.openings || [],
        events: res.data.events || [],
        organizations: res.data.orgs || [],
        communities: res.data.communities || [],
      });
    } else {
      Toaster.error(res.data.message || SERVER_ERROR, 'error_toaster');
    }

    setLoading(false);
  };

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsDialogOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const noResults = useMemo(() => Object.values(results).every(group => group.length === 0), [results]);

  return (
    <div
      ref={menuRef}
      className="w-[640px] max-md:hidden fixed top-2 right-1/2 translate-x-1/2 max-md:w-taskbar_md mx-auto z-50"
    >
      <Command className={`bg-gray-50 border-[1px] border-gray-200 ${isDialogOpen && !noResults && 'pb-2'}`}>
        <CommandInput
          placeholder="Search for users, projects, openings, events, etc."
          onValueChange={value => {
            if (value) fetchResults(value);
            setIsDialogOpen(Boolean(value));
          }}
        />
        <CommandList>
          {isDialogOpen &&
            (loading ? (
              <CommandLoading className="loader-container">
                <Loader />
              </CommandLoading>
            ) : (
              <>
                {noResults ? (
                  <CommandEmpty>No results found.</CommandEmpty>
                ) : (
                  <ToggleGroup
                    className="w-full flex-center gap-4 my-2"
                    value={filters}
                    onValueChange={setFilters}
                    type="multiple"
                  >
                    {['openings', 'projects', 'users', 'events', 'communities', 'organizations'].map(filterType => (
                      <ToggleGroupItem key={filterType} value={filterType} className="capitalize">
                        {filterType}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                )}
                {Object.entries(results).map(([key, group]) => {
                  return (
                    (filters.length === 0 || filters.includes(key)) &&
                    group.length > 0 && (
                      <CommandGroup key={key} heading={key}>
                        {group.map(item => (
                          <SearchItem key={item.id} item={item} type={key} />
                        ))}
                        {/* {group.length === 3 && (
                          <div className="w-full text-center text-xs font-medium text-gray-400">Load More</div>
                        )} */}
                        <CommandSeparator />
                      </CommandGroup>
                    )
                  );
                })}
              </>
            ))}
        </CommandList>
      </Command>
    </div>
  );
};

const CommandGroup: React.FC<{ children: ReactNode; heading: string }> = ({ children, heading }) => (
  <div className="w-full flex flex-col gap-2 px-2 mt-2">
    <div className="text-gray-500 text-sm font-medium pl-1 capitalize">{heading}</div>
    {children}
  </div>
);

const CommandItem: React.FC<{ children: ReactNode; link: string }> = ({ children, link }) => (
  <Link href={link} className="w-full flex items-center gap-1 hover:bg-gray-100 p-1 rounded-sm">
    {children}
  </Link>
);

const ProjectItem = ({ project }: { project: Project }) => (
  <CommandItem link={`${EXPLORE_URL}?pid=${project.slug}`}>
    <Image
      crossOrigin="anonymous"
      width={50}
      height={50}
      alt={'User Pic'}
      src={`${PROJECT_PIC_URL}/${project.coverPic}`}
      placeholder="blur"
      blurDataURL={project.blurHash || 'no-hash'}
      className="w-6 h-6 rounded-full mr-1"
    />
    <div className="text-sm">{project.title}</div>
  </CommandItem>
);

const UserItem = ({ user }: { user: User }) => (
  <CommandItem link={`${EXPLORE_URL}/user/${user.username}`}>
    <Image
      crossOrigin="anonymous"
      width={50}
      height={50}
      alt={'User Pic'}
      src={`${USER_PROFILE_PIC_URL}/${user.profilePic}`}
      placeholder="blur"
      blurDataURL={user.profilePicBlurHash || 'no-hash'}
      className="w-6 h-6 rounded-full mr-1"
    />
    <div className="text-sm">{user.username}</div>
  </CommandItem>
);

const OpeningItem = ({ opening }: { opening: Opening }) => (
  <CommandItem link={`${EXPLORE_URL}?oid=${opening.id}`}>
    <Image
      crossOrigin="anonymous"
      width={50}
      height={50}
      alt={'User Pic'}
      src={`${PROJECT_PIC_URL}/${opening?.project?.coverPic}`}
      placeholder="blur"
      blurDataURL={opening?.project?.blurHash || 'no-hash'}
      className="w-6 h-6 rounded-full mr-1"
    />
    <div className="text-sm">{opening.title}</div>
  </CommandItem>
);

const EventItem = ({ event }: { event: Event }) => (
  <CommandItem link={`${EXPLORE_URL}/event/${event.id}`}>
    <Image
      crossOrigin="anonymous"
      width={50}
      height={50}
      alt={'User Pic'}
      src={`${EVENT_PIC_URL}/${event.coverPic}`}
      placeholder="blur"
      blurDataURL={event.blurHash || 'no-hash'}
      className="w-6 h-6 rounded-full mr-1"
    />
    <div className="text-sm">{event.title}</div>
  </CommandItem>
);

const OrgItem = ({ org }: { org: Organization }) => (
  <CommandItem link={`${EXPLORE_URL}/organisation/${org.user.username}`}>
    <Image
      crossOrigin="anonymous"
      width={50}
      height={50}
      alt={'User Pic'}
      src={`${USER_PROFILE_PIC_URL}/${org.user.profilePic}`}
      placeholder="blur"
      blurDataURL={org.user.profilePicBlurHash || 'no-hash'}
      className="w-6 h-6 rounded-full mr-1"
    />
    <div className="text-sm">{org.title}</div>
  </CommandItem>
);

const CommunityItem = ({ community }: { community: Community }) => (
  <CommandItem link={`community/${community.id}`}>
    <Image
      crossOrigin="anonymous"
      width={50}
      height={50}
      alt={'User Pic'}
      src={`${COMMUNITY_PROFILE_PIC_URL}/${community.profilePic}`}
      placeholder="blur"
      blurDataURL={community.profilePicBlurHash || 'no-hash'}
      className="w-6 h-6 rounded-full mr-1"
    />
    <div className="text-sm">{community.title}</div>
  </CommandItem>
);

const SearchItem = ({ item, type }: { item: any; type: string }) => {
  switch (type) {
    case 'projects':
      return <ProjectItem project={item} />;
    case 'users':
      return <UserItem user={item} />;
    case 'openings':
      return <OpeningItem opening={item} />;
    case 'events':
      return <EventItem event={item} />;
    case 'organizations':
      return <OrgItem org={item} />;
    case 'communities':
      return <CommunityItem community={item} />;
    default:
      return <></>;
  }
};

export default SearchBar;
