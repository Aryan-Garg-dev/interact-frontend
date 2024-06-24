import { useDyteMeeting } from '@dytesdk/react-web-core';
import { DyteMeeting } from '@dytesdk/react-ui-kit';

function Meeting() {
  const { meeting } = useDyteMeeting();

  return (
    <div className="w-screen h-screen">
      <DyteMeeting mode="fill" meeting={meeting} showSetupScreen={false} />
    </div>
  );
}

export default Meeting;
