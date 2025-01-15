'use client';
import React from 'react';
import Time from '@/components/form/time';

interface TeamsProps {
  minTeamSize: number;
  setMinTeamSize: (value: number) => void;
  maxTeamSize: number;
  setMaxTeamSize: (value: number) => void;
  teamFormationStartTime: string;
  setTeamFormationStartTime: (value: string) => void;
  teamFormationEndTime: string;
  setTeamFormationEndTime: (value: string) => void;
}

const Teams: React.FC<TeamsProps> = ({
  minTeamSize,
  setMinTeamSize,
  maxTeamSize,
  setMaxTeamSize,
  teamFormationStartTime,
  setTeamFormationStartTime,
  teamFormationEndTime,
  setTeamFormationEndTime,
}) => {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full">
        <div className="text-xs ml-1 font-medium uppercase text-gray-500">Min Team Size*</div>
        <input
          value={minTeamSize}
          onChange={el => setMinTeamSize(Number(el.target.value))}
          type="number"
          className="w-full font-medium bg-transparent focus:outline-none border-[1px] border-gray-400 rounded-lg p-2"
        />
      </div>
      <div className="w-full">
        <div className="text-xs ml-1 font-medium uppercase text-gray-500">Max Team Size*</div>
        <input
          value={maxTeamSize}
          onChange={el => setMaxTeamSize(Number(el.target.value))}
          type="number"
          className="w-full font-medium bg-transparent focus:outline-none border-[1px] border-gray-400 rounded-lg p-2"
        />
      </div>
      <Time
        label="Team Formation Start Time"
        val={teamFormationStartTime}
        setVal={setTeamFormationStartTime}
        includeDate={true}
      />
      <Time
        label="Team Formation End Time"
        val={teamFormationEndTime}
        setVal={setTeamFormationEndTime}
        includeDate={true}
      />
    </div>
  );
};
export default Teams;
