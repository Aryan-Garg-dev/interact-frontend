import { useDyteMeeting } from '@dytesdk/react-web-core';
import { DyteMeeting } from '@dytesdk/react-ui-kit';
import { useEffect } from 'react';

function Meeting() {
  const { meeting } = useDyteMeeting();

  useEffect(() => {
    //TODO
    // meeting.self.on('roomLeft', () => {
    //   // handle navigation to other screen here after the user has left the room.
    //   alert("You've left the room");
    // });
  }, [meeting]);

  return (
    <div className="w-screen h-screen">
      <DyteMeeting mode="fill" meeting={meeting} showSetupScreen={false} />
    </div>
  );
}

export default Meeting;
