import { HackathonHistory } from '@/types';
import HackathonHistoryWrapper from '@/wrappers/hackathon_history';
import { ArrowUpRight } from '@phosphor-icons/react';
import Link from 'next/link';
import React from 'react';

interface Props {
  history: HackathonHistory;
}

const Edited = ({ history }: Props) => {
  switch (history.historyType) {
    case 1:
      return (
        <HackathonHistoryWrapper history={history}>
          <div className="w-fit bg-priority_mid px-1 rounded-md gap-4">
            Hackathon details updated:{history.hackathonID}
          </div>
          : <div>{history.deletedText}</div>
        </HackathonHistoryWrapper>
      );
    case 4:
      return (
        <HackathonHistoryWrapper history={history}>
          <div className="w-fit bg-priority_mid px-1 rounded-md gap-4">
            Track updated!{history.hackathonTrack.title}
          </div>
        </HackathonHistoryWrapper>
      );
    case 7:
      return (
        <HackathonHistoryWrapper history={history}>
          <div className="w-fit bg-priority_mid px-1 rounded-md gap-4">
            Prize Updated!{history.hackathonPrize.amount}
          </div>
          : <div>{history.deletedText}</div>
        </HackathonHistoryWrapper>
      );
    case 10:
        return (
            <HackathonHistoryWrapper history={history}>
              <div className="w-fit bg-priority_mid px-1 rounded-md gap-4">
                Sponsor Updated:{history.hackathonSponsor.name}
              </div>
              : <div>{history.deletedText}</div>
            </HackathonHistoryWrapper>
          );
    case 13:
      return (
        <HackathonHistoryWrapper history={history}>
          <div className="w-fit bg-priority_mid px-1 rounded-md gap-4">
            FAQ Updated:{history.hackathonFAQ.question}
          </div>
        </HackathonHistoryWrapper>
      );
    case 16:
      return (
        <HackathonHistoryWrapper history={history}>
          <div className="w-fit bg-priority_mid px-1 rounded-md gap-4">
            Round updated:{history.hackathonRound.id}
          </div>
        </HackathonHistoryWrapper>
      );
    default:
      return <></>;
  }
};

export default Edited;
