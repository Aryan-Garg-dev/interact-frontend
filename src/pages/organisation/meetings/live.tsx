import Meeting from '@/screens/organisation/meeting';
import Toaster from '@/utils/toaster';
import { DyteProvider, useDyteClient } from '@dytesdk/react-web-core';
import { useEffect } from 'react';

export default function App() {
  const [meeting, initMeeting] = useDyteClient();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('mid');

    if (!token || token == '') {
      Toaster.error('Invalid session');
      return;
    }
    initMeeting({
      authToken: token,
      defaults: {
        audio: false,
        video: false,
      },
    });
  }, []);

  return (
    <DyteProvider value={meeting}>
      <Meeting />
    </DyteProvider>
  );
}
