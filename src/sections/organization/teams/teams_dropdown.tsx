import { currentOrgSelector } from '@/slices/orgSlice';
import { OrganizationMembership, Team } from '@/types';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

interface Props {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  membership: OrganizationMembership;
}

const TeamsDropdown = ({ setShow, membership }: Props) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const currentOrg = useSelector(currentOrgSelector);
  const orgTeams = currentOrg.teams || [];

  const menuRef = useRef<HTMLDivElement>(null);
  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setShow(false);
    }
  };

  useEffect(() => {
    const userTeams = (membership.teams || []).map(t => t.id);
    setTeams(orgTeams.filter(t => userTeams.includes(t.id)));
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={menuRef}
      className="w-[20%] bg-slate-100 absolute top-0 translate-y-2 flex flex-col gap-2 rounded-md p-2 z-10 animate-fade_third"
    >
      {teams.length > 0 ? (
        teams.map((team, i) => {
          return (
            <div
              style={{ backgroundColor: team.color }}
              className="w-full flex flex-col rounded-sm px-2 py-1 cursor-default"
              key={i}
            >
              <div className="font-medium">{team.title}</div>
              <div className="text-xs">{team.noUsers} Members</div>
            </div>
          );
        })
      ) : (
        <div>No more teams</div>
      )}
    </div>
  );
};

export default TeamsDropdown;
