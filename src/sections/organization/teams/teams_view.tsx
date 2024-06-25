import { Organization, Team } from '@/types';
import ModalWrapper from '@/wrappers/modal';
import React, { useState } from 'react';
import NewTeam from './new_team';
import { initialTeam } from '@/types/initials';
import Mascot from '@/components/fillers/mascot';

interface Props {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  organization: Organization;
  setOrganization: React.Dispatch<React.SetStateAction<Organization>>;
}

const TeamsView = ({ setShow, organization, setOrganization }: Props) => {
  const [clickedOnNewTeam, setClickedOnNewTeam] = useState(false);
  const [clickedOnEditTeam, setClickedOnEditTeam] = useState(false);
  const [clickedTeam, setClickedTeam] = useState(initialTeam);

  return clickedOnNewTeam ? (
    <NewTeam organization={organization} setShow={setClickedOnNewTeam} setOrganization={setOrganization} />
  ) : (
    <ModalWrapper setShow={setShow}>
      <div onClick={() => setClickedOnNewTeam(true)}>New Team</div>
      TeamsView
      {organization.teams && organization.teams.length > 0 ? (
        organization.teams.map(team => <div key={team.id}>{team.title}</div>)
      ) : (
        <Mascot message="No Teams Yet." />
      )}
    </ModalWrapper>
  );
};

export default TeamsView;
