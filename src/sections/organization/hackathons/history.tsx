import React, { useEffect, useState } from 'react';
import { HackathonHistory } from '@/types';
import Created from '@/components/history/hackathon/created';
import Edited from '@/components/history/hackathon/edited';
import Deleted from '@/components/history/hackathon/deleted';
import ModalWrapper from '@/wrappers/modal';
import { useRouter } from 'next/router'; 
import { currentOrgSelector } from '@/slices/orgSlice';
import { useSelector } from 'react-redux';

interface Props {
  hackathonID: string;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const HackathonHistories: React.FC<Props> = ({ hackathonID, setShow }) => {
  const [histories, setHistories] = useState<HackathonHistory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const currentOrg = useSelector(currentOrgSelector);
  const router = useRouter();

  useEffect(() => {
    const fetchHistories = async () => {
      if (!currentOrg || !hackathonID) return;

      try {
        const response = await fetch(`/org/${currentOrg.id}/hackathons/${hackathonID}/history`);
        if (response.ok) {
          const data: HackathonHistory[] = await response.json();
          setHistories(data);
        } else {
          console.error('Failed to fetch hackathon history');
        }
      } catch (error) {
        console.error('Error fetching hackathon history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistories();
  }, [currentOrg, hackathonID]);

  return (
    <ModalWrapper setShow={setShow} width="1/3" height="fit" blur={true} modalStyles={{ top: '40%' }}>
      <div className="w-full flex flex-col gap-3">
        {isLoading ? (
          <p>Loading...</p>
        ) : histories.length > 0 ? (
          histories.map(history => {
            switch (history.historyType) {
              case 0:
              case 3:
              case 6:
              case 9:
              case 12:
              case 15:
              case 18:
              case 20:
              case 22:
                return <Created key={history.id} history={history} />;
              case 1:
              case 4:
              case 7:
              case 10:
              case 13:
              case 16:
                return <Edited key={history.id} history={history} />;
              case 2:
              case 5:
              case 8:
              case 11:
              case 14:
              case 17:
              case 19:
              case 21:
                return <Deleted key={history.id} history={history} />;
              default:
                return null;
            }
          })
        ) : (
          <p>No history available for this hackathon.</p>
        )}
      </div>
    </ModalWrapper>
  );
};

export default HackathonHistories;
