import React, { useState } from 'react';
import Time from '@/components/form/time';
import { getInputFieldFormatTime } from '@/utils/funcs/time';
import Toaster from '@/utils/toaster';

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
  const [minTeamSizeInput, setMinTeamSizeInput] = useState<number>(minTeamSize);
  const [maxTeamSizeInput, setMaxTeamSizeInput] = useState<number>(maxTeamSize);

  const handleMinTeamSizeChange = (value: number) => {
    setMinTeamSizeInput(value);
  };

  const handleMaxTeamSizeChange = (value: number) => {
    setMaxTeamSizeInput(value);
  };

  const handleMinTeamSizeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (minTeamSizeInput < 1) {
        Toaster.error('Min Team Size must be at least 1');
        return;
      }
      setMinTeamSize(minTeamSizeInput);
    }
  };

  const handleMaxTeamSizeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (maxTeamSizeInput < 1) {
        Toaster.error('Max Team Size must be at least 1');
        return;
      }
      setMaxTeamSize(maxTeamSizeInput);
    }
  };

  const handleTeamFormationStartTimeChange = (value: string) => {
    setTeamFormationStartTime(value);
    setTeamFormationStartTimeInput(value);
  };

  const handleTeamFormationEndTimeChange = (value: string) => {
    setTeamFormationEndTime(value);
    setTeamFormationEndTimeInput(value);
  };

  const [teamFormationStartTimeInput, setTeamFormationStartTimeInput] = useState<string>(
    teamFormationStartTime ? getInputFieldFormatTime(teamFormationStartTime.toString()) : ''
  );

  const [teamFormationEndTimeInput, setTeamFormationEndTimeInput] = useState<string>(
    teamFormationEndTime ? getInputFieldFormatTime(teamFormationEndTime.toString()) : ''
  );

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full">
        <div className="text-xs ml-1 font-medium uppercase text-gray-500">Min Team Size*</div>
        <input
          value={minTeamSizeInput}
          onChange={el => handleMinTeamSizeChange(Number(el.target.value))}
          onKeyDown={handleMinTeamSizeKeyDown}
          type="number"
          className="w-full font-medium bg-transparent focus:outline-none border-[1px] border-gray-400 rounded-lg p-2"
        />
      </div>
      <div className="w-full">
        <div className="text-xs ml-1 font-medium uppercase text-gray-500">Max Team Size*</div>
        <input
          value={maxTeamSizeInput}
          onChange={el => handleMaxTeamSizeChange(Number(el.target.value))}
          onKeyDown={handleMaxTeamSizeKeyDown}
          type="number"
          className="w-full font-medium bg-transparent focus:outline-none border-[1px] border-gray-400 rounded-lg p-2"
        />
      </div>
      <Time
        label="Team Formation Start Time"
        val={teamFormationStartTimeInput}
        setVal={handleTeamFormationStartTimeChange}
        includeDate={true}
      />
      <Time
        label="Team Formation End Time"
        val={teamFormationEndTimeInput}
        setVal={handleTeamFormationEndTimeChange}
        includeDate={true}
      />
    </div>
  );
};

export default Teams;
