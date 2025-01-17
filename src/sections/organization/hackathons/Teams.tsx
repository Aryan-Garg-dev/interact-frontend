import React, { useState } from 'react';
import moment from 'moment';
import Time from '@/components/form/time';

interface TeamsProps {
  minTeamSize: number;
  setMinTeamSize: (value: number) => void;
  maxTeamSize: number;
  setMaxTeamSize: (value: number) => void;
  teamFormationStartTime: Date;
  setTeamFormationStartTime: (value: string) => void;
  teamFormationEndTime: Date;
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

  // Format function for date and time using moment.js
  const formatDateTime = (value: string) => {
    return moment(value).format('YYYY-MM-DDTHH:mm'); // Format to a readable format
  };

  const handleMinTeamSizeChange = (value: number) => {
    setMinTeamSizeInput(value);
  };

  const handleMaxTeamSizeChange = (value: number) => {
    setMaxTeamSizeInput(value);
  };

  const handleMinTeamSizeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (minTeamSizeInput < 1) {
        alert('Min Team Size must be at least 1');
        return;
      }
      setMinTeamSize(minTeamSizeInput);
    }
  };

  const handleMaxTeamSizeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (maxTeamSizeInput < 1) {
        alert('Max Team Size must be at least 1');
        return;
      }
      setMaxTeamSize(maxTeamSizeInput);
    }
  };

  const handleTeamFormationStartTimeChange = (value: string) => {
    const formattedValue = moment(value).toISOString();
    setTeamFormationStartTime(formattedValue);
    setTeamFormationStartTimeInput(formattedValue);
  };

  const handleTeamFormationEndTimeChange = (value: string) => {
    const formattedValue = moment(value).toISOString(); // Converts to ISO 8601 format with UTC time
    setTeamFormationEndTime(formattedValue);
    setTeamFormationEndTimeInput(formattedValue);
  };

  const [teamFormationStartTimeInput, setTeamFormationStartTimeInput] = useState<string>(
    teamFormationStartTime ? formatDateTime(teamFormationStartTime.toString()) : ''
  );

  const [teamFormationEndTimeInput, setTeamFormationEndTimeInput] = useState<string>(
    teamFormationEndTime ? formatDateTime(teamFormationEndTime.toString()) : ''
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
