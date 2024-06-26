import Select from '@/components/form/select';
import { SERVER_ERROR } from '@/config/errors';
import postHandler from '@/handlers/post_handler';
import { currentOrgSelector, setCurrentOrgTeams } from '@/slices/orgSlice';
import { Organization, OrganizationMembership, Team } from '@/types';
import Toaster from '@/utils/toaster';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

interface Props {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  membership: OrganizationMembership;
  setOrganization: React.Dispatch<React.SetStateAction<Organization>>;
}

const AddMemberToTeam = ({ setShow, membership, setOrganization }: Props) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const currentOrg = useSelector(currentOrgSelector);
  const orgTeams = currentOrg.teams;

  const menuRef = useRef<HTMLDivElement>(null);
  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setShow(false);
    }
  };

  const dispatch = useDispatch();

  const handleAddTeamMember = async (team: Team) => {
    const URL = `org/${currentOrg.id}/teams/users/${team.id}`;
    const formData = {
      userID: membership.userID,
      teamID: team.id,
    };

    const res = await postHandler(URL, formData);
    if (res.statusCode == 200) {
      setOrganization(prev => {
        return {
          ...prev,
          memberships: prev.memberships.map(m => {
            if (m.id == membership.id) return { ...m, teams: [...(m.teams || []), team] };
            return m;
          }),
        };
      });
      dispatch(
        setCurrentOrgTeams(
          currentOrg.teams.map(t => {
            if (t.id == team.id) return { ...t, noUsers: t.noUsers + 1 };
            return t;
          })
        )
      );
      setShow(false);
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else {
        Toaster.error(SERVER_ERROR);
      }
    }
  };

  useEffect(() => {
    const userTeams = (membership.teams || []).map(t => t.id);
    setTeams(orgTeams.filter(t => !userTeams.includes(t.id)));
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
              onClick={() => handleAddTeamMember(team)}
              className="w-full flex flex-col rounded-sm px-2 py-1 cursor-pointer"
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

export default AddMemberToTeam;
