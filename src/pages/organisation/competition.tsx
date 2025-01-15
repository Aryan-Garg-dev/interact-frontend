import React, { useEffect, useState } from 'react';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import OrgSidebar from '@/components/common/org_sidebar';
import { Event, HackathonTrack, HackathonPrize, HackathonRound, HackathonSponsor, HackathonFAQ } from '@/types';

import { currentOrgSelector } from '@/slices/orgSlice';
import { useSelector } from 'react-redux';
import Toaster from '@/utils/toaster';
import { SERVER_ERROR } from '@/config/errors';
import postHandler from '@/handlers/post_handler';
import moment from 'moment';
import TextArea from '@/components/form/textarea';
import Time from '@/components/form/time';
import Input from '@/components/form/input';
import Tags from '@/components/form/tags';
import Links from '@/components/form/links';
import { ORG_URL } from '@/config/routes';
import { getFormattedTime } from '@/utils/funcs/time';
import { Timeline } from '@/components/ui/timeline';
import GlowButton from '@/components/buttons/glow_btn';
import { Button } from '@/components/ui/button';
import Tracks from '@/sections/organization/hackathons/Track';
import Prizes from '@/sections/organization/hackathons/Prize';
import Rounds from '@/sections/organization/hackathons/Round';
import FAQs from '@/sections/organization/hackathons/FAQ';
import Sponsors from '@/sections/organization/hackathons/Sponsor';
import Teams from '@/sections/organization/hackathons/Teams';
import Basics from '@/sections/organization/hackathons/Basics';
interface Prize {
  title: string;
  amount: number;
  description: string;
  trackID?: string;
}

const NewHackathon: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagline, setTagline] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [links, setLinks] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [teamFormationStartTime, setTeamFormationStartTime] = useState('');
  const [teamFormationEndTime, setTeamFormationEndTime] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [minTeamSize, setMinTeamSize] = useState(2);
  const [maxTeamSize, setMaxTeamSize] = useState(5);

  const [tracks, setTracks] = useState<HackathonTrack[]>([]);
  const [prizes, setPrizes] = useState<HackathonPrize[]>([]);
  const [rounds, setRounds] = useState<HackathonRound[]>([]);
  const [sponsors, setSponsors] = useState<HackathonSponsor[]>([]);
  const [faqs, setFaqs] = useState<HackathonFAQ[]>([]);

  const currentOrg = useSelector(currentOrgSelector);

  const addFAQ = (faq: HackathonFAQ) => {
    setFaqs(prev => [...prev, faq]);
  };

  const editFAQ = (index: number, updatedFAQ: HackathonFAQ) => {
    setFaqs(prev => prev.map((faq, idx) => (idx === index ? updatedFAQ : faq)));
  };

  const deleteFAQ = (index: number) => {
    setFaqs(prev => prev.filter((_, idx) => idx !== index));
  };

  const addRound = (round: HackathonRound) => {
    setRounds(prev => [...prev, { ...round, id: Date.now().toString(), hackathonID: 'your-hackathon-id' }]);
  };

  const addSponsor = (sponsor: HackathonSponsor) => {
    setSponsors(prev => [...prev, sponsor]);
  };

  const editSponsor = (index: number, updatedSponsor: HackathonSponsor) => {
    setSponsors(prev => prev.map((sponsor, idx) => (idx === index ? updatedSponsor : sponsor)));
  };

  const deleteSponsor = (index: number) => {
    setSponsors(prev => prev.filter((_, idx) => idx !== index));
  };

  const editRound = (index: number, updatedRound: HackathonRound) => {
    setRounds(prev =>
      prev.map((round, idx) =>
        idx === index ? { ...updatedRound, id: round.id, hackathonID: round.hackathonID } : round
      )
    );
  };

  const deleteRound = (index: number) => {
    setRounds(prev => prev.filter((_, idx) => idx !== index));
  };

  const addTrack = (title: string, description: string = '') => {
    setTracks(prev => [...prev, { title, description: description }]);
  };

  const editTrack = (index: number, title: string, description: string = '') => {
    setTracks(prev =>
      prev.map((track, idx) => (idx === index ? { ...track, title, description: description || '' } : track))
    );
  };

  const deleteTrack = (index: number) => {
    setTracks(prev => prev.filter((_, idx) => idx !== index));
  };

  const addPrize = (prize: Prize) => {
    setPrizes(prev => [...prev, prize]);
  };

  const editPrize = (index: number, updatedPrize: Prize) => {
    setPrizes(prev => prev.map((prize, idx) => (idx === index ? updatedPrize : prize)));
  };

  const deletePrize = (index: number) => {
    setPrizes(prev => prev.filter((_, idx) => idx !== index));
  };

  const eventDetailsValidator = () => {
    if (title.trim() === '') {
      Toaster.error('Enter Title');
      return false;
    }
    if (tagline.trim() === '') {
      Toaster.error('Enter Tagline');
      return false;
    }
    if (description.trim() === '') {
      Toaster.error('Enter Description');
      return false;
    }
    if (tags.length < 3) {
      Toaster.error('Add at least 3 tags');
      return false;
    }
    if (startTime === '') {
      Toaster.error('Enter Start Time');
      return false;
    }
    if (endTime === '') {
      Toaster.error('Enter End Time');
      return false;
    }

    const start = moment(startTime);
    const end = moment(endTime);

    if (start.isSameOrBefore(moment())) {
      Toaster.error('Start Time cannot be before current time.');
      return false;
    }
    if (end.isSameOrBefore(start)) {
      Toaster.error('End Time cannot be before Start Time');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!eventDetailsValidator() || !validateRounds() || !validateTeamFormationTimes()) return;

    const formData = {
      title,
      tagline,
      description,
      tags,
      links,
      location,
      startTime: getFormattedTime(startTime),
      endTime: getFormattedTime(endTime),
      teamFormationStartTime: getFormattedTime(teamFormationStartTime),
      teamFormationEndTime: getFormattedTime(teamFormationEndTime),
      minTeamSize: Number(minTeamSize),
      maxTeamSize: Number(maxTeamSize),
      tracks,
      prizes,
      rounds: rounds.map(round => ({
        ...round,
        startTime: getFormattedTime(round.startTime),
        endTime: getFormattedTime(round.endTime),
        judgingStartTime: getFormattedTime(round.judgingStartTime),
        judgingEndTime: getFormattedTime(round.judgingEndTime),
      })),
      sponsors,
      faqs,
    };

    const toaster = Toaster.startLoad('Adding the event...');

    const URL = `${ORG_URL}/${currentOrg.id}/hackathons`;

    const res = await postHandler(URL, formData);

    if (res.statusCode === 201) {
      const event: Event = res.data.event;
      localStorage.removeItem(`hackathon-draft-${currentOrg.id}`);
      Toaster.stopLoad(toaster, 'Competition Created!', 1);
    } else if (res.statusCode === 413) {
      Toaster.stopLoad(toaster, 'Image too large', 0);
    } else {
      if (res.data.message) {
        Toaster.stopLoad(toaster, res.data.message, 0);
      } else {
        Toaster.stopLoad(toaster, SERVER_ERROR, 0);
      }
    }
  };

  const handleSaveDraft = () => {
    const formData = {
      title,
      description,
      tagline,
      tags,
      links,
      location,
      startTime,
      endTime,
      teamFormationStartTime,
      teamFormationEndTime,
      minTeamSize,
      maxTeamSize,
      tracks,
      prizes,
      rounds,
      sponsors,
      faqs,
    };

    localStorage.setItem(`hackathon-draft-${currentOrg.id}`, JSON.stringify(formData));
    Toaster.success('Draft saved!');
  };

  useEffect(() => {
    const savedData = localStorage.getItem(`hackathon-draft-${currentOrg.id}`);
    if (savedData) {
      const formData = JSON.parse(savedData);
      setTitle(formData.title || '');
      setDescription(formData.description || '');
      setTagline(formData.tagline || '');
      setTags(formData.tags || []);
      setLinks(formData.links || []);
      setLocation(formData.location || '');
      setStartTime(formData.startTime || '');
      setEndTime(formData.endTime || '');
      setTeamFormationStartTime(formData.teamFormationStartTime || '');
      setTeamFormationEndTime(formData.teamFormationEndTime || '');
      setMinTeamSize(Number(formData.minTeamSize) || 2);
      setMaxTeamSize(Number(formData.maxTeamSize) || 5);
      setTracks(formData.tracks || []);
      setPrizes(formData.prizes || []);
      setRounds(formData.rounds || []);
      setSponsors(formData.sponsors || []);
      setFaqs(formData.faqs || []);
    }
  }, [currentOrg.id]);

  const validateRounds = () => {
    const hackathonStart = moment(startTime);
    const hackathonEnd = moment(endTime);
    const teamFormationEnd = moment(teamFormationEndTime);

    for (let i = 0; i < rounds.length; i++) {
      const round = rounds[i];
      const roundStart = moment(round.startTime);
      const roundEnd = moment(round.endTime);
      const judgingStart = moment(round.judgingStartTime);
      const judgingEnd = moment(round.judgingEndTime);

      if (roundStart.isBefore(hackathonStart) || roundEnd.isAfter(hackathonEnd)) {
        Toaster.error(`Round ${i + 1} is outside the hackathon start or end time.`);
        return false;
      }

      if (roundStart.isBefore(teamFormationEnd)) {
        Toaster.error(`Round ${i + 1} starts before team formation ends.`);
        return false;
      }

      if (judgingStart.isBefore(roundStart) || judgingEnd.isAfter(roundEnd)) {
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

  const validateTeamFormationTimes = () => {
    const hackathonStart = moment(startTime);
    const hackathonEnd = moment(endTime);
    const teamFormationStart = moment(teamFormationStartTime);
    const teamFormationEnd = moment(teamFormationEndTime);

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
            title={title}
            setTitle={setTitle}
            tagline={tagline}
            setTagline={setTagline}
            location={location}
            setLocation={setLocation}
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
            description={description}
            setDescription={setDescription}
            tags={tags}
            setTags={setTags}
            links={links}
            setLinks={setLinks}
            setImage={setImage}
          />
        </div>
      ),
    },
    {
      title: 'Tracks',
      content: (
        <div className="container mx-auto px-4 ">
          <Tracks tracks={tracks} addTrack={addTrack} editTrack={editTrack} deleteTrack={deleteTrack} />
        </div>
      ),
    },
    {
      title: 'Prizes',
      content: (
        <div className="container mx-auto px-4">
          <Prizes prizes={prizes} addPrize={addPrize} editPrize={editPrize} deletePrize={deletePrize} tracks={tracks} />
        </div>
      ),
    },
    {
      title: 'Teams',
      content: (
        <div className="container mx-auto px-4 ">
          <Teams
            minTeamSize={minTeamSize}
            setMinTeamSize={setMinTeamSize}
            maxTeamSize={maxTeamSize}
            setMaxTeamSize={setMaxTeamSize}
            teamFormationStartTime={teamFormationStartTime}
            setTeamFormationStartTime={setTeamFormationStartTime}
            teamFormationEndTime={teamFormationEndTime}
            setTeamFormationEndTime={setTeamFormationEndTime}
          />
        </div>
      ),
    },
    {
      title: 'Rounds',
      content: (
        <div className="container mx-auto px-4">
          <Rounds
            rounds={rounds}
            addRound={addRound}
            editRound={editRound}
            deleteRound={deleteRound}
            teamFormationEndTime={teamFormationEndTime}
          />
        </div>
      ),
    },
    {
      title: 'Sponsors',
      content: (
        <div className="container mx-auto px-4">
          <Sponsors
            sponsors={sponsors}
            addSponsor={addSponsor}
            editSponsor={editSponsor}
            deleteSponsor={deleteSponsor}
          />
        </div>
      ),
    },
    {
      title: 'FAQs',
      content: (
        <div className="container mx-auto px-4">
          <FAQs faqs={faqs} addFAQ={addFAQ} editFAQ={editFAQ} deleteFAQ={deleteFAQ} />
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
          <div className="w-full flex items-center justify-between">
            <Button onClick={handleSaveDraft} className="w-fit">
              Save this Draft
            </Button>
            <GlowButton label="Submit Your Competition" onClick={handleSubmit} />
          </div>
        </div>
      </MainWrapper>
    </BaseWrapper>
  );
};

export default NewHackathon;
