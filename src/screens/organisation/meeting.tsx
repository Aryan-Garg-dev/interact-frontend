import { useDyteMeeting } from '@dytesdk/react-web-core';
import { DyteMeeting } from '@dytesdk/react-ui-kit';
import { useEffect, useState } from 'react';

interface Props {
  callbackURL: string;
  duration?: number; // Duration in hours
}

function Meeting({ callbackURL, duration }: Props) {
  const { meeting } = useDyteMeeting();

  useEffect(() => {
    meeting.self.on('roomLeft', () => {
      window.location.replace(callbackURL);
    });
  }, [meeting]);

  const [targetTime, setTargetTime] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [remainingMinutes, setRemainingMinutes] = useState(0);

  useEffect(() => {
    if (duration !== undefined) {
      const target = new Date();
      target.setHours(target.getHours() + duration);
      setTargetTime(target);
    }
  }, [duration]);

  useEffect(() => {
    if (targetTime === null) return;

    const checkModalTime = () => {
      const currentTime = new Date().getTime();
      const timeLeft = targetTime.getTime() - currentTime;

      if (timeLeft <= 600000 && timeLeft > 0) {
        setShowModal(true);
        setRemainingMinutes(Math.ceil(timeLeft / 60000));
      } else if (timeLeft <= 0) {
        setShowModal(false);
        clearInterval(interval);
      }
    };

    const interval = setInterval(checkModalTime, 60000);

    return () => clearInterval(interval);
  }, [targetTime]);

  return (
    <div className="w-screen h-screen">
      {showModal && (
        <div
          className={`bg-white px-4 py-2 rounded-lg ${
            remainingMinutes < 5 ? 'text-primary_danger' : 'text-amber-500'
          } flex-center font-medium fixed top-2 right-1/2 z-[100] translate-x-1/2`}
        >
          <p>Meeting ends in {remainingMinutes} minutes</p>
        </div>
      )}

      <DyteMeeting mode="fill" meeting={meeting} showSetupScreen={false} />
    </div>
  );
}

export default Meeting;
