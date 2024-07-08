import { useDyteMeeting } from '@dytesdk/react-web-core';
import { DyteMeeting } from '@dytesdk/react-ui-kit';
import { useEffect } from 'react';

interface Props {
  id: string;
}

function Meeting({ id }: Props) {
  const { meeting } = useDyteMeeting();

  useEffect(() => {
    meeting.self.on('roomLeft', () => {
      window.location.replace(`/organisations/meetings/${id}`);
    });
    meeting.meta.meetingId;
  }, [meeting]);

  return (
    <div className="w-screen h-screen">
      <DyteMeeting mode="fill" meeting={meeting} showSetupScreen={false} />
    </div>
  );
}

export default Meeting;
