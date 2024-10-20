import React, { useEffect, useState } from 'react';
import { HackathonHistory } from '@/types';
import Created from '@/components/history/hackathon/created';
import Edited from '@/components/history/hackathon/edited';
import Deleted from '@/components/history/hackathon/deleted';
import ModalWrapper from '@/wrappers/modal';
import { useRouter } from 'next/router';
import { currentOrgSelector } from '@/slices/orgSlice';
import { useSelector } from 'react-redux';
import getHandler from '@/handlers/get_handler';
import Toaster from '@/utils/toaster';
import Loader from '@/components/common/loader';

interface Props {
  hackathonID: string;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const HackathonHistories: React.FC<Props> = ({ hackathonID, setShow }) => {
  const [histories, setHistories] = useState<HackathonHistory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const currentOrg = useSelector(currentOrgSelector);
  const router = useRouter();

  const fetchHistories = async () => {
    if (!currentOrg || !hackathonID) return;

    setIsLoading(true);
    const URL = `/org/${currentOrg.id}/hackathons/${hackathonID}/history`;

    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          setHistories(res.data.history || []);
        } else {
          if (res.data.message) {
            Toaster.error(res.data.message, 'error_toaster');
          } else {
            Toaster.error('Failed to fetch hackathon history', 'error_toaster');
          }
        }
      })
      .catch(err => {
        Toaster.error('Error fetching hackathon history', 'error_toaster');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  useEffect(() => {
    fetchHistories();
  }, [currentOrg, hackathonID]);

  return (
    <ModalWrapper setShow={setShow} width="1/3" height="fit" blur={true} modalStyles={{ top: '50%' }}>
      <div className="w-full flex flex-col gap-3">
        {isLoading ? (
          <Loader />
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
                return <Created key={history.id} history={history} />;
              case 1:
              case 4:
              case 7:
              case 10:
              case 13:
              case 16:
              case 22:
              case 23:
              case 24:
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
