import React, { useEffect, useState } from 'react';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import OrgSidebar from '@/components/common/org_sidebar';
import { HackathonTrack, HackathonPrize, HackathonRound, HackathonSponsor, HackathonFAQ } from '@/types';
import {
  initialHackathon,
  initialHackathonFAQ,
  initialHackathonPrize,
  initialHackathonRound,
  initialHackathonSponsor,
  initialHackathonTrack,
} from '@/types/initials';
import { currentOrgSelector } from '@/slices/orgSlice';
import { useSelector } from 'react-redux';
import Toaster from '@/utils/toaster';
import { SERVER_ERROR } from '@/config/errors';
import postHandler from '@/handlers/post_handler';
import moment from 'moment';
import { ORG_URL } from '@/config/routes';
import { getFormattedTime, getInputFieldFormatTime } from '@/utils/funcs/time';
import { Timeline } from '@/components/ui/timeline';
import Tracks from '@/sections/organization/hackathons/Track';
import Prizes from '@/sections/organization/hackathons/Prize';
import Rounds from '@/sections/organization/hackathons/Round';
import FAQs from '@/sections/organization/hackathons/FAQ';
import Sponsors from '@/sections/organization/hackathons/Sponsor';
import Teams from '@/sections/organization/hackathons/Teams';
import Basics from '@/sections/organization/hackathons/Basics';
import { Hackathon } from '@/types';
import { GetServerSidePropsContext } from 'next/types';
import getHandler from '@/handlers/get_handler';
import { EXPLORE_URL } from '@/config/routes';
import patchHandler from '@/handlers/patch_handler';
import deleteHandler from '@/handlers/delete_handler';

interface Props {
  id: string;
}

const EditHackathon: React.FC<Props> = ({ id }) => {
  const [mutex, setMutex] = useState(false);
  const [hackathon, setHackathon] = useState<Hackathon>(initialHackathon);
  const [image, setImage] = useState<File | null>(null);

  const currentOrg = useSelector(currentOrgSelector);
  const getEvent = async () => {
    const URL = `${EXPLORE_URL}/events/${id}`;
    const res = await getHandler(URL);
    if (res.statusCode === 200) {
      setHackathon(res.data.event.hackathon);
    } else {
      Toaster.error(res.data.message || SERVER_ERROR, 'error_toaster');
    }
  };
  useEffect(() => {
    getEvent();
  }, [id]);

  const handleAddFAQ = async (data: { question: string; answer: string }) => {
    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Adding FAQ...');
    const res = await postHandler(`${ORG_URL}/${currentOrg.id}/hackathons/${hackathon.id}/faq`, data);
    if (res.statusCode === 201) {
      Toaster.stopLoad(toaster, 'FAQ Added!', 1);
      const faq = res.data.faq;
      setHackathon({
        ...hackathon,
        faqs: [...hackathon.faqs, faq],
      });
    } else {
      Toaster.stopLoad(toaster, res.data.message || SERVER_ERROR, 0);
    }
    setMutex(false);
  };

  const handleEditFAQ = async (faq: HackathonFAQ) => {
    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Updating FAQ...');
    const res = await patchHandler(`${ORG_URL}/${currentOrg.id}/hackathons/faq/${faq.id}`, faq);

    if (res.statusCode === 200) {
      Toaster.stopLoad(toaster, 'FAQ Updated!', 1);
      setHackathon({
        ...hackathon,
        faqs: hackathon.faqs.map(f => (f.id === faq.id ? res.data.faq || initialHackathonFAQ : f)),
      });
    } else {
      Toaster.stopLoad(toaster, res.data.message || SERVER_ERROR, 0);
    }
    setMutex(false);
  };

  const handleDeleteFaq = async (faqId: string) => {
    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Deleting FAQ...');
    const res = await deleteHandler(`${ORG_URL}/${currentOrg.id}/hackathons/faq/${faqId}`);

    if (res.statusCode === 200) {
      Toaster.stopLoad(toaster, 'FAQ Deleted!', 1);
      setHackathon({
        ...hackathon,
        faqs: hackathon.faqs.filter(faq => faq.id !== faqId),
      });
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
    setMutex(false);
  };

  const handleAddSponsor = async (data: HackathonSponsor) => {
    if (mutex) return;
    setMutex(true);
    const toaster = Toaster.startLoad('Adding Sponsor...');
    const res = await postHandler(`${ORG_URL}/${currentOrg.id}/hackathons/${hackathon.id}/sponsor`, data);
    if (res.statusCode === 201) {
      Toaster.stopLoad(toaster, 'Sponsor Added!', 1);
      const sponsor = res.data.sponsor;
      setHackathon({
        ...hackathon,
        sponsors: [...hackathon.sponsors, sponsor],
      });
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
    setMutex(false);
  };

  const handleEditSponsor = async (sponsor: HackathonSponsor) => {
    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Updating Sponsor...');
    const res = await patchHandler(`${ORG_URL}/${currentOrg.id}/hackathons/sponsor/${sponsor.id}`, sponsor);

    if (res.statusCode === 200) {
      setHackathon({
        ...hackathon,
        sponsors: hackathon.sponsors.map(s => (s.id === sponsor.id ? res.data.sponsor || initialHackathonSponsor : s)),
      });
      Toaster.stopLoad(toaster, 'Sponsor Updated!', 1);
    } else {
      Toaster.stopLoad(toaster, res.data.message || SERVER_ERROR, 0);
    }
    setMutex(false);
  };

  const handleDeleteSponsor = async (sponsorId: string) => {
    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Deleting Sponsor...');
    const res = await deleteHandler(`${ORG_URL}/${currentOrg.id}/hackathons/sponsor/${sponsorId}`);

    if (res.statusCode === 200) {
      Toaster.stopLoad(toaster, 'Sponsor Deleted!', 1);
      setHackathon({
        ...hackathon,
        sponsors: hackathon.sponsors.filter(sponsor => sponsor.id !== sponsorId),
      });
    } else {
      Toaster.stopLoad(toaster, res.data.message || SERVER_ERROR, 0);
    }
    setMutex(false);
  };

  const handleAddRound = async (data: HackathonRound) => {
    if (!validateRounds([...hackathon.rounds, data])) return;

    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Adding Round...');
    const res = await postHandler(`${ORG_URL}/${currentOrg.id}/hackathons/${hackathon.id}/round`, data);
    if (res.statusCode === 201) {
      const round = res.data.round;
      setHackathon({
        ...hackathon,
        rounds: [...hackathon.rounds, round],
      });
      Toaster.stopLoad(toaster, 'Round Added!', 1);
    } else {
      Toaster.stopLoad(toaster, res.data.message || SERVER_ERROR, 0);
    }
    setMutex(false);
  };

  const handleEditRound = async (round: HackathonRound) => {
    if (!validateRounds(hackathon.rounds.map(r => (r.id === round.id ? round : r)))) return;

    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Updating Round...');
    const res = await patchHandler(`${ORG_URL}/${currentOrg.id}/hackathons/${hackathon.id}/round/${round.id}`, round);

    if (res.statusCode === 200) {
      setHackathon(prevHackathon => ({
        ...prevHackathon,
        rounds: prevHackathon.rounds.map(r => (r.id === round.id ? res.data.round || initialHackathonRound : r)),
      }));
      Toaster.stopLoad(toaster, 'Round Updated!', 1);
    } else {
      Toaster.stopLoad(toaster, res.data.message || SERVER_ERROR, 0);
    }
    setMutex(false);
  };

  const handleDeleteRound = async (roundId: string) => {
    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Deleting Round...');
    const res = await deleteHandler(`${ORG_URL}/${currentOrg.id}/hackathons/round/${roundId}`);

    if (res.statusCode === 200) {
      Toaster.stopLoad(toaster, 'Round Deleted!', 1);
      setHackathon({
        ...hackathon,
        rounds: hackathon.rounds.filter(round => round.id !== roundId),
      });
    } else {
      Toaster.stopLoad(toaster, res.data.message || SERVER_ERROR, 0);
    }
    setMutex(false);
  };

  const handleAddTrack = async (data: HackathonTrack) => {
    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Adding Track...');
    const res = await postHandler(`${ORG_URL}/${currentOrg.id}/hackathons/${hackathon.id}/track`, data);
    if (res.statusCode === 201) {
      Toaster.stopLoad(toaster, 'Track Added!', 1);
      const track = res.data.track;
      setHackathon({
        ...hackathon,
        tracks: [...hackathon.tracks, track],
      });
    } else {
      Toaster.stopLoad(toaster, res.data.message || SERVER_ERROR, 0);
    }
    setMutex(false);
  };

  const handleEditTrack = async (track: HackathonTrack) => {
    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Updating Track...');
    const res = await patchHandler(`${ORG_URL}/${currentOrg.id}/hackathons/track/${track.id}`, track);

    if (res.statusCode === 200) {
      setHackathon({
        ...hackathon,
        tracks: hackathon.tracks.map(t => (t.id === track.id ? res.data.track || initialHackathonTrack : t)),
      });
      Toaster.stopLoad(toaster, 'Track Updated!', 1);
    } else {
      Toaster.stopLoad(toaster, res.data.message || SERVER_ERROR, 0);
    }
    setMutex(false);
  };

  const handleDeleteTrack = async (trackId: string) => {
    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Deleting Track...');
    const res = await deleteHandler(`${ORG_URL}/${currentOrg.id}/hackathons/track/${trackId}`);

    if (res.statusCode === 200) {
      Toaster.stopLoad(toaster, 'Track Deleted!', 1);
      setHackathon({
        ...hackathon,
        tracks: hackathon.tracks.filter(track => track.id !== trackId),
      });
    } else {
      Toaster.stopLoad(toaster, res.data.message || SERVER_ERROR, 0);
    }
    setMutex(false);
  };

  const handleAddPrize = async (data: HackathonPrize) => {
    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Adding Track...');
    const res = await postHandler(`${ORG_URL}/${currentOrg.id}/hackathons/${hackathon.id}/prize`, data);
    if (res.statusCode === 201) {
      Toaster.stopLoad(toaster, 'Track Added!', 1);
      const track = res.data.track;
      setHackathon({
        ...hackathon,
        tracks: [...hackathon.tracks, track],
      });
    } else {
      Toaster.stopLoad(toaster, res.data.message || SERVER_ERROR, 0);
    }
    setMutex(false);
  };

  const handleEditPrize = async (prize: HackathonPrize) => {
    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Updating Prize...');
    const res = await patchHandler(`${ORG_URL}/${currentOrg.id}/hackathons/prize/${prize.id}`, prize);

    if (res.statusCode === 200) {
      setHackathon({
        ...hackathon,
        prizes: hackathon.prizes.map(p => (p.id === prize.id ? res.data.prize || initialHackathonPrize : p)),
      });
      Toaster.stopLoad(toaster, 'Prize Updated!', 1);
    } else {
      Toaster.stopLoad(toaster, res.data.message || SERVER_ERROR, 0);
    }
    setMutex(false);
  };

  const handleDeletePrize = async (prizeId: string) => {
    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Deleting Prize...');
    const res = await deleteHandler(`${ORG_URL}/${currentOrg.id}/hackathons/prize/${prizeId}`);

    if (res.statusCode === 200) {
      Toaster.stopLoad(toaster, 'Prize Deleted!', 1);
      setHackathon({
        ...hackathon,
        prizes: hackathon.prizes.filter(prize => prize.id !== prizeId),
      });
    } else {
      Toaster.stopLoad(toaster, res.data.message || SERVER_ERROR, 0);
    }
    setMutex(false);
  };

  const editHackathonField = async (field: string, value: any) => {
    if (mutex) return;
    setMutex(true);

    let data = { ...hackathon };

    if (field === 'tags') {
      data.tags = [...(hackathon.tags || []), ...value];
    } else {
      (data as any)[field] = value;
    }

    if (!eventDetailsValidator(data) || !validateTeamFormationTimes(data)) return;

    const toaster = Toaster.startLoad(`Editing ${field}...`);
    const res = await patchHandler(
      `${ORG_URL}/${currentOrg.id}/hackathons/${hackathon.id}`,
      data,
      'multipart/form-data'
    );
    if (res.statusCode === 200) {
      setHackathon(data);
      Toaster.stopLoad(toaster, `${field.charAt(0).toUpperCase() + field.slice(1)} Edited!`, 1);
    } else {
      Toaster.stopLoad(toaster, res.data.message || SERVER_ERROR, 0);
    }

    setMutex(false);
  };

  const handleTitleChange = (title: string) => {
    editHackathonField('title', title);
  };
  const handleMinTeamSizeChange = async (minTeamSize: number) => {
    await editHackathonField('minTeamSize', minTeamSize);
  };

  const handleMaxTeamSizeChange = async (maxTeamSize: number) => {
    await editHackathonField('maxTeamSize', maxTeamSize);
  };

  const handleTeamFormationStartTimeChange = async (startTime: string) => {
    await editHackathonField('teamFormationStartTime', startTime);
  };

  const handleTeamFormationEndTimeChange = async (endTime: string) => {
    await editHackathonField('teamFormationEndTime', endTime);
  };
  const handleTaglineChange = async (tagline: string) => {
    await editHackathonField('tagline', tagline);
  };

  const handleLocationChange = async (location: string) => {
    await editHackathonField('location', location);
  };

  const handleStartTimeChange = async (startTime: string) => {
    await editHackathonField('startTime', getFormattedTime(startTime));
  };

  const handleEndTimeChange = async (endTime: string) => {
    await editHackathonField('endTime', getFormattedTime(endTime));
  };

  const handleDescriptionChange = async (description: string) => {
    await editHackathonField('description', description);
  };

  const handleTagsChange = async (updatedTags: string[]) => {
    await editHackathonField('tags', updatedTags);
  };

  const handleLinksChange = async (links: string[]) => {
    await editHackathonField('links', links);
  };

  const eventDetailsValidator = (data: Hackathon) => {
    if (data.title.trim() === '') {
      Toaster.error('Enter Title');
      return false;
    }
    if (data.tagline?.trim() === '') {
      Toaster.error('Enter Tagline');
      return false;
    }
    if (data.description.trim() === '') {
      Toaster.error('Enter Description');
      return false;
    }
    if (data.tags && data.tags.length < 3) {
      Toaster.error('Add at least 3 tags');
      return false;
    }

    const start = moment(data.startTime);
    const end = moment(data.endTime);

    if (end.isSameOrBefore(start)) {
      Toaster.error('End Time cannot be before Start Time');
      return false;
    }

    return true;
  };

  const validateRounds = (rounds: HackathonRound[]) => {
    const hackathonStart = moment(hackathon.startTime);
    const hackathonEnd = moment(hackathon.endTime);
    const teamFormationEnd = moment(hackathon.teamFormationEndTime);

    for (let i = 0; i < rounds.length; i++) {
      const round = rounds[i];
      const roundStart = moment(round.startTime);
      const roundEnd = moment(round.endTime);
      const judgingStart = moment(round.judgingStartTime);

      if (roundStart.isBefore(hackathonStart) || roundEnd.isAfter(hackathonEnd)) {
        Toaster.error(`Round ${i + 1} is outside the hackathon start or end time.`);
        return false;
      }

      if (roundStart.isBefore(teamFormationEnd)) {
        Toaster.error(`Round ${i + 1} starts before team formation ends.`);
        return false;
      }

      if (judgingStart.isBefore(roundStart) || judgingStart.isAfter(roundEnd)) {
        Toaster.error(`Judging time for round ${i + 1} is not within the round's start and end times.`);
        return false;
      }

      if (i > 0) {
        const previousRoundEnd = moment(rounds[i - 1].endTime);
        if (roundStart.isBefore(previousRoundEnd)) {
          Toaster.error(`Round ${i + 1} overlaps with the previous round.`);
          return false;
        }
      }

      if (i < rounds.length - 1) {
        const nextRoundStart = moment(rounds[i + 1].startTime);
        if (!roundEnd.isSame(nextRoundStart)) {
          Toaster.error(`The end time of round ${i + 1} should match the start time of the next round.`);
          return false;
        }
      }
    }

    return true;
  };

  const validateTeamFormationTimes = (data: Hackathon) => {
    const hackathonStart = moment(data.startTime);
    const hackathonEnd = moment(data.endTime);
    const teamFormationStart = moment(data.teamFormationStartTime);
    const teamFormationEnd = moment(data.teamFormationEndTime);

    if (!teamFormationStart.isBetween(hackathonStart, hackathonEnd)) {
      Toaster.error('Team Formation Start Time is not between hackathon timings.');
      return false;
    }

    if (!teamFormationEnd.isBetween(hackathonStart, hackathonEnd)) {
      Toaster.error('Team Formation End Time is not between hackathon timings.');
      return false;
    }

    return true;
  };

  const screens = [
    {
      title: 'Basics',
      content: (
        <div className="container mx-auto px-4 ">
          <Basics
            title={hackathon.title}
            setTitle={handleTitleChange}
            tagline={hackathon.tagline || ''}
            setTagline={handleTaglineChange}
            location={hackathon.location}
            setLocation={handleLocationChange}
            startTime={getInputFieldFormatTime(hackathon.startTime)}
            setStartTime={handleStartTimeChange}
            endTime={getInputFieldFormatTime(hackathon.endTime)}
            setEndTime={handleEndTimeChange}
            description={hackathon.description}
            setDescription={handleDescriptionChange}
            tags={hackathon.tags || []}
            setTags={handleTagsChange}
            links={hackathon.links || []}
            setLinks={handleLinksChange}
            setImage={setImage}
          />
        </div>
      ),
    },
    {
      title: 'Tracks',
      content: (
        <div className="container mx-auto px-4 ">
          <Tracks
            tracks={hackathon.tracks}
            addTrack={handleAddTrack}
            editTrack={handleEditTrack}
            deleteTrack={handleDeleteTrack}
          />
        </div>
      ),
    },
    {
      title: 'Prizes',
      content: (
        <div className="container mx-auto px-4">
          <Prizes
            prizes={hackathon.prizes}
            addPrize={handleAddPrize}
            editPrize={handleEditPrize}
            deletePrize={handleDeletePrize}
            tracks={hackathon.tracks}
          />
        </div>
      ),
    },
    {
      title: 'Teams',
      content: (
        <div className="container mx-auto px-4 ">
          <Teams
            minTeamSize={hackathon.minTeamSize}
            setMinTeamSize={handleMinTeamSizeChange}
            maxTeamSize={hackathon.maxTeamSize}
            setMaxTeamSize={handleMaxTeamSizeChange}
            teamFormationStartTime={getInputFieldFormatTime(hackathon.teamFormationStartTime)}
            setTeamFormationStartTime={handleTeamFormationStartTimeChange}
            teamFormationEndTime={getInputFieldFormatTime(hackathon.teamFormationEndTime)}
            setTeamFormationEndTime={handleTeamFormationEndTimeChange}
          />
        </div>
      ),
    },
    {
      title: 'Rounds',
      content: (
        <div className="container mx-auto px-4">
          <Rounds
            rounds={hackathon.rounds}
            addRound={handleAddRound}
            editRound={handleEditRound}
            deleteRound={handleDeleteRound}
          />
        </div>
      ),
    },
    {
      title: 'Sponsors',
      content: (
        <div className="container mx-auto px-4">
          <Sponsors
            sponsors={hackathon.sponsors}
            addSponsor={handleAddSponsor}
            editSponsor={handleEditSponsor}
            deleteSponsor={handleDeleteSponsor}
          />
        </div>
      ),
    },
    {
      title: 'FAQs',
      content: (
        <div className="container mx-auto px-4">
          <FAQs faqs={hackathon.faqs} addFAQ={handleAddFAQ} editFAQ={handleEditFAQ} deleteFAQ={handleDeleteFaq} />
        </div>
      ),
    },
  ];

  return (
    <BaseWrapper title={`Events | ${currentOrg.title}`}>
      <OrgSidebar index={12} />
      <MainWrapper>
        <div className="w-full bg-gray-50 dark:bg-neutral-900 h-full flex flex-col gap-2 px-6 pb-10 justify-between">
          <Timeline data={screens} />
        </div>
      </MainWrapper>
    </BaseWrapper>
  );
};

export default EditHackathon;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query;

  return {
    props: { id },
  };
}
