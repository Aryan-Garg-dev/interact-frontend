import React, { useEffect, useState } from 'react';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import OrgSidebar from '@/components/common/org_sidebar';
import {
  Event,
  HackathonTrack,
  HackathonPrize,
  HackathonRound,
  HackathonSponsor,
  HackathonFAQ,
  HackathonRoundScoreMetric,
} from '@/types';

import { currentOrgSelector } from '@/slices/orgSlice';
import { useSelector } from 'react-redux';
import Toaster from '@/utils/toaster';
import { SERVER_ERROR } from '@/config/errors';
import postHandler from '@/handlers/post_handler';
import moment from 'moment';
import TextArea from '@/components/form/textarea';
import Time from '@/components/form/time';
import { PencilSimple, TrashSimple } from '@phosphor-icons/react';
import Input from '@/components/form/input';
import Tags from '@/components/form/tags';
import Links from '@/components/form/links';
import SecondaryButton from '@/components/buttons/secondary_btn';
import Select from '@/components/form/select';
import { ORG_URL } from '@/config/routes';
import { getFormattedTime, getInputFieldFormatTime } from '@/utils/funcs/time';
import CoverPic from '@/components/utils/new_cover';
import { Timeline } from '@/components/ui/timeline';
import GlowButton from '@/components/buttons/glow_btn';
import { Button } from '@/components/ui/button';

const NewHackathon = () => {
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
  const [image, setImage] = useState<File>();
  const [minTeamSize, setMinTeamSize] = useState(2);
  const [maxTeamSize, setMaxTeamSize] = useState(5);

  const [tracks, setTracks] = useState<HackathonTrack[]>([]);
  const [prizes, setPrizes] = useState<HackathonPrize[]>([]);
  const [rounds, setRounds] = useState<HackathonRound[]>([]);
  const [sponsors, setSponsors] = useState<HackathonSponsor[]>([]);
  const [faqs, setFaqs] = useState<HackathonFAQ[]>([]);

  const [mutex, setMutex] = useState(false);

  const currentOrg = useSelector(currentOrgSelector);

  const eventDetailsValidator = () => {
    if (title.trim() == '') {
      Toaster.error('Enter Title');
      return false;
    }
    if (tagline.trim() == '') {
      Toaster.error('Enter Tagline');
      return false;
    }
    if (description.trim() == '') {
      Toaster.error('Enter Description');
      return false;
    }
    if (tags.length < 3) {
      Toaster.error('Add at least 3 tags');
      return false;
    }
    if (startTime == '') {
      Toaster.error('Enter Start Time');
      return false;
    }
    if (endTime == '') {
      Toaster.error('Enter End Time');
      return false;
    }
    // if (!image) {
    //   Toaster.error('Add a Cover Picture');
    //   return false;
    // }

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
      rounds: rounds.map(round => {
        return {
          ...round,
          startTime: getFormattedTime(round.startTime),
          endTime: getFormattedTime(round.endTime),
          judgingStartTime: getFormattedTime(round.judgingStartTime),
        };
      }),
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
    } else if (res.statusCode == 413) {
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
  }, []);

  const validateRounds = () => {
    const hackathonStart = moment(startTime);
    const hackathonEnd = moment(endTime);
    const teamFormationEnd = moment(teamFormationEndTime);

    for (let i = 0; i < rounds.length; i++) {
      const round = rounds[i];
      const roundStart = moment(round.startTime);
      const roundEnd = moment(round.endTime);
      const judgingStart = moment(round.judgingStartTime);

      // 1. Check if the round is within hackathon start and end times
      if (roundStart.isBefore(hackathonStart) || roundEnd.isAfter(hackathonEnd)) {
        Toaster.error(`Round ${round.index + 1} is outside the hackathon start or end time.`);
        return false;
      }

      // 2. Check if the round is after the team formation end time
      if (roundStart.isBefore(teamFormationEnd)) {
        Toaster.error(`Round ${round.index + 1} starts before team formation ends.`);
        return false;
      }

      // 3. Check if judging time is within the round time
      if (judgingStart.isBefore(roundStart) || judgingStart.isAfter(roundEnd)) {
        Toaster.error(`Judging time for round ${round.index + 1} is not within the round's start and end times.`);
        return false;
      }

      // 4. Check for overlapping rounds
      if (i > 0) {
        const previousRoundEnd = moment(rounds[i - 1].endTime);
        if (roundStart.isBefore(previousRoundEnd)) {
          Toaster.error(`Round ${round.index + 1} overlaps with the previous round.`);
          return false;
        }
      }

      // 5. Check if round end time matches the next round's start time (for all except last round)
      if (i < rounds.length - 1) {
        const nextRoundStart = moment(rounds[i + 1].startTime);
        if (!roundEnd.isSame(nextRoundStart)) {
          Toaster.error(`The end time of round ${round.index + 1} should match the start time of the next round.`);
          return false;
        }
      }
    }

    return true;
  };

  const validateTeamFormationTimes = () => {
    const hackathonStart = moment(startTime);
    const hackathonEnd = moment(endTime);
    const teamFormationStart = moment(teamFormationEndTime);
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
      ),
    },
    {
      title: 'Tracks',
      content: <Tracks tracks={tracks} setTracks={setTracks} />,
    },
    {
      title: 'Prizes',
      content: <Prizes prizes={prizes} setPrizes={setPrizes} tracks={tracks} />,
    },
    {
      title: 'Teams',
      content: (
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
      ),
    },
    {
      title: 'Rounds',
      content: <Rounds rounds={rounds} setRounds={setRounds} teamFormationEndTime={teamFormationEndTime} />,
    },
    {
      title: 'Sponsors',
      content: <Sponsors sponsors={sponsors} setSponsors={setSponsors} />,
    },
    {
      title: 'FAQs',
      content: <FAQs faqs={faqs} setFaqs={setFaqs} />,
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

const Basics = ({
  title,
  setTitle,
  tagline,
  setTagline,
  location,
  setLocation,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  description,
  setDescription,
  tags,
  setTags,
  links,
  setLinks,
  setImage,
}: any) => {
  return (
    <div className="w-full flex flex-col gap-8 max-lg:gap-4">
      {/* <div className="w-full">
        <CoverPic setSelectedFile={setImage} picType="Hackathon" />
      </div> */}
      <Input label="Title" val={title} setVal={setTitle} maxLength={25} required={true} />
      <Input label="Tagline" val={tagline} setVal={setTagline} maxLength={50} required={true} />
      <Input label="Location" val={location} setVal={setLocation} maxLength={25} placeholder="Online" />
      <div className="w-full flex justify-between gap-4">
        <div className="w-1/2">
          <Time label="Start Time" val={startTime} setVal={setStartTime} required={true} />
        </div>
        <div className="w-1/2">
          <Time label="End Time" val={endTime} setVal={setEndTime} required={true} />
        </div>
      </div>
      <TextArea label="Description" val={description} setVal={setDescription} maxLength={2500} />
      <Tags label="Tags" tags={tags} setTags={setTags} maxTags={10} required={true} />
      <Links label="Links" links={links} setLinks={setLinks} maxLinks={5} />
    </div>
  );
};

const Tracks = ({ tracks, setTracks }: any) => {
  const [trackName, setTrackName] = useState('');
  const [trackDescription, setTrackDescription] = useState('');
  const [isEditing, setIsEditing] = useState<number | null>(null);

  const addTrack = () => {
    if (!trackName.trim() || !trackDescription.trim()) return;
    if (isEditing !== null) {
      setTracks((prev: HackathonTrack[]) =>
        prev.map((track, idx) =>
          idx === isEditing ? { ...track, title: trackName, description: trackDescription } : track
        )
      );
      setIsEditing(null);
    } else {
      setTracks((prev: HackathonTrack[]) => [...prev, { title: trackName, description: trackDescription }]);
    }
    setTrackName('');
    setTrackDescription('');
  };

  const editTrack = (index: number) => {
    setTrackName(tracks[index].title);
    setTrackDescription(tracks[index].description);
    setIsEditing(index);
  };

  const deleteTrack = (index: number) => {
    setTracks((prev: HackathonTrack[]) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Input label="Track Title" val={trackName} setVal={setTrackName} maxLength={50} />
        <TextArea label="Track Description" val={trackDescription} setVal={setTrackDescription} maxLength={250} />
        <SecondaryButton label={isEditing !== null ? 'Save' : 'Add'} onClick={addTrack} />
      </div>
      {tracks?.length > 0 ? (
        <div className="w-full flex flex-wrap gap-4">
          {tracks.map((track: HackathonTrack, idx: number) => (
            <div key={idx} className="bg-gray-200 rounded-lg px-4 py-4 flex flex-col w-full">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{track.title}</h3>
                  <p className="text-gray-600">{track.description}</p>
                </div>
                <div className="flex gap-2">
                  <PencilSimple className="cursor-pointer text-blue-500" size={24} onClick={() => editTrack(idx)} />
                  <TrashSimple className="cursor-pointer text-red-500" size={24} onClick={() => deleteTrack(idx)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>Minimum 1 Track is required.</div>
      )}
    </div>
  );
};

const Prizes = ({ prizes, setPrizes, tracks }: any) => {
  const [prizeName, setPrizeName] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [trackID, setTrackID] = useState<string>('');
  const [isEditing, setIsEditing] = useState<number | null>(null);

  const addPrize = () => {
    if (!prizeName.trim() || !amount.trim()) return;

    if (isEditing !== null) {
      setPrizes((prev: HackathonPrize[]) =>
        prev.map((prize, idx) =>
          idx === isEditing ? { ...prize, title: prizeName, amount: Number(amount), description, trackID } : prize
        )
      );
      setIsEditing(null);
    } else {
      setPrizes((prev: HackathonPrize[]) => [
        ...prev,
        { title: prizeName, amount: Number(amount), description, trackID },
      ]);
    }

    setPrizeName('');
    setAmount('');
    setDescription('');
    setTrackID('');
  };

  const editPrize = (index: number) => {
    const prize = prizes[index];
    setPrizeName(prize.title);
    setAmount(prize.amount);
    setDescription(prize.description);
    setTrackID(prize.trackID || null);
    setIsEditing(index);
  };

  const deletePrize = (index: number) => {
    setPrizes((prev: HackathonPrize[]) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Input label="Prize Title" val={prizeName} setVal={setPrizeName} maxLength={50} />
        <TextArea label="Description" val={description} setVal={setDescription} maxLength={250} />
        <Input label="Amount" val={amount} setVal={setAmount} type="number" maxLength={-1} />
        {/* <div>
          <div className="text-xs ml-1 font-medium uppercase text-gray-500">Select Track (Optional)</div>

          <select
            onChange={el => setTrackID(el.target.value)}
            value={trackID}
            className="w-full max-lg:w-full h-11 border-[1px] border-primary_btn  dark:border-dark_primary_btn dark:text-white bg-primary_comp dark:bg-dark_primary_comp focus:outline-nonetext-sm rounded-lg block p-2"
          >
            {tracks?.map((c: HackathonTrack, i: number) => {
              return (
                <option className="bg-primary_comp_hover" key={i} value={c.id}>
                  {c.title}
                </option>
              );
            })}
          </select>
        </div> */}
        <SecondaryButton label={isEditing !== null ? 'Save' : 'Add'} onClick={addPrize} />
      </div>

      {prizes.length > 0 && (
        <div className="w-full flex flex-wrap gap-4">
          {prizes.map((prize: HackathonPrize, idx: number) => (
            <div key={idx} className="bg-gray-200 rounded-lg px-4 py-4 flex flex-col w-full">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{prize.title}</h3>
                  <p className="text-gray-600">{prize.description}</p>
                  <p className="text-gray-600">${prize.amount}</p>
                  {prize.trackID && (
                    <p className="text-sm text-gray-500">
                      Track: {tracks.find((track: HackathonTrack) => track.id === prize.trackID)?.title}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <PencilSimple className="cursor-pointer text-blue-500" size={24} onClick={() => editPrize(idx)} />
                  <TrashSimple className="cursor-pointer text-red-500" size={24} onClick={() => deletePrize(idx)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Rounds = ({ rounds, setRounds }: any) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [judgingStartTime, setJudgingStartTime] = useState('');
  const [metrics, setMetrics] = useState<HackathonRoundScoreMetric[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);

  const addRound = () => {
    if (startTime == '' || endTime == '' || judgingStartTime == '') {
      Toaster.error('Invalid Round Timings');
      return;
    }

    if (metrics.some(m => m.title == '')) {
      Toaster.error('Metric title cannot be empty');
      return;
    }

    const newRound: HackathonRound = {
      id: '',
      hackathonID: '',
      index: rounds.length,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      judgingStartTime: new Date(judgingStartTime),
      metrics,
    };

    if (isEditing !== null) {
      setRounds((prev: HackathonRound[]) => prev.map((round, idx) => (idx === isEditing ? newRound : round)));
      setIsEditing(null);
    } else {
      setRounds((prev: HackathonRound[]) => [...prev, newRound]);
    }

    resetForm(getInputFieldFormatTime(new Date(endTime)));
  };

  const resetForm = (newStartTime?: string) => {
    setStartTime(newStartTime ? newStartTime : '');
    setEndTime('');
    setJudgingStartTime('');
    setMetrics([]);
  };

  const editRound = (index: number) => {
    const round = rounds[index];
    setStartTime(round.startTime.toISOString().split('T')[0]);
    setEndTime(round.endTime.toISOString().split('T')[0]);
    setJudgingStartTime(round.judgingStartTime.toISOString().split('T')[0]);
    setMetrics(round.metrics);
    setIsEditing(index);
  };

  const deleteRound = (index: number) => {
    setRounds((prev: HackathonRound[]) => prev.filter((_, i) => i !== index));
  };

  const addMetric = () => {
    setMetrics((prev: HackathonRoundScoreMetric[]) => [
      ...prev,
      { hackathonRoundID: '', title: '', type: '', options: [] },
    ]);
  };

  const updateMetric = (index: number, key: string, value: any) => {
    setMetrics((prev: HackathonRoundScoreMetric[]) =>
      prev.map((metric, idx) => (idx === index ? { ...metric, [key]: value } : metric))
    );
  };

  const deleteMetric = (index: number) => {
    setMetrics((prev: HackathonRoundScoreMetric[]) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Time label="Start Time" val={startTime} setVal={setStartTime} includeDate={true} />
        <Time label="End Time" val={endTime} setVal={setEndTime} includeDate={true} />
        <Time
          label="Judging Start Time (within hackathon times)"
          val={judgingStartTime}
          setVal={setJudgingStartTime}
          includeDate={true}
        />

        <div className="w-full flex flex-col gap-4">
          <h4 className="font-bold">Metrics</h4>
          {metrics.map((metric, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <Input
                label="Metric Title"
                val={metric.title}
                setVal={val => updateMetric(idx, 'title', val)}
                maxLength={50}
              />
              <TextArea
                label="Metric Description"
                val={metric.description || ''}
                setVal={val => updateMetric(idx, 'description', val)}
                maxLength={250}
              />
              <Select
                label="Metric Type"
                options={['text', 'number', 'select', 'boolean']}
                val={metric.type}
                setVal={(val: any) => updateMetric(idx, 'type', val)}
              />
              {metric.type === 'select' && (
                <TextArea
                  label="Options (comma separated)"
                  val={metric.options?.join(', ') || ''}
                  setVal={val =>
                    updateMetric(
                      idx,
                      'options',
                      (val as string).split(',').map(opt => opt.trim())
                    )
                  }
                  maxLength={250}
                />
              )}
              <TrashSimple className="cursor-pointer text-red-500" size={24} onClick={() => deleteMetric(idx)} />
            </div>
          ))}
          <SecondaryButton label="Add Metric" onClick={addMetric} />
        </div>

        <SecondaryButton label={isEditing !== null ? 'Save' : 'Add'} onClick={addRound} />
      </div>

      {rounds.length > 0 && (
        <div className="w-full flex flex-wrap gap-4">
          {rounds.map((round: HackathonRound, idx: number) => (
            <div key={idx} className="bg-gray-200 rounded-lg px-4 py-4 flex flex-col w-full">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Start: {moment(round.startTime).format('YYYY-MM-DD HH:mm')}</p>
                  <p className="text-sm text-gray-500">End: {moment(round.endTime).format('YYYY-MM-DD HH:mm')}</p>
                  <p className="text-sm text-gray-500">
                    Judging: {moment(round.judgingStartTime).format('YYYY-MM-DD HH:mm')} -{' '}
                    {moment(round.endTime).format('YYYY-MM-DD HH:mm')}
                  </p>
                </div>
                <div className="flex gap-2">
                  {/* <PencilSimple className="cursor-pointer text-blue-500" size={24} onClick={() => editRound(idx)} /> */}
                  <TrashSimple className="cursor-pointer text-red-500" size={24} onClick={() => deleteRound(idx)} />
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-bold">Metrics:</h4>
                {round.metrics.map((metric: HackathonRoundScoreMetric, idx: number) => (
                  <div key={idx} className="text-sm">
                    <p className="font-bold">{metric.title}</p>
                    <p>{metric.description}</p>
                    <p className="text-gray-500">Type: {metric.type}</p>
                    {metric.type === 'select' && <p className="text-gray-500">Options: {metric.options?.join(', ')}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Teams = ({
  minTeamSize,
  setMinTeamSize,
  maxTeamSize,
  setMaxTeamSize,
  teamFormationStartTime,
  setTeamFormationStartTime,
  teamFormationEndTime,
  setTeamFormationEndTime,
}: any) => {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full">
        <div className="text-xs ml-1 font-medium uppercase text-gray-500">Min Team Size*</div>
        <input
          value={minTeamSize}
          onChange={el => setMinTeamSize(Number(el.target.value))}
          type="number"
          className="w-full font-medium bg-transparent focus:outline-none border-[1px] border-gray-400 rounded-lg p-2"
        />
      </div>
      <div className="w-full">
        <div className="text-xs ml-1 font-medium uppercase text-gray-500">Min Team Size*</div>
        <input
          value={maxTeamSize}
          onChange={el => setMaxTeamSize(Number(el.target.value))}
          type="number"
          className="w-full font-medium bg-transparent focus:outline-none border-[1px] border-gray-400 rounded-lg p-2"
        />
      </div>
      <Time
        label="Team Formation Start Time"
        val={teamFormationStartTime}
        setVal={setTeamFormationStartTime}
        includeDate={true}
      />
      <Time
        label="Team Formation End Time"
        val={teamFormationEndTime}
        setVal={setTeamFormationEndTime}
        includeDate={true}
      />
    </div>
  );
};

const Sponsors = ({ sponsors, setSponsors }: any) => {
  const [sponsorName, setSponsorName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [isEditing, setIsEditing] = useState<number | null>(null);

  const addSponsor = () => {
    if (!sponsorName.trim() || !title.trim() || !description.trim() || !link.trim()) return;

    const newSponsor = {
      name: sponsorName,
      title,
      description,
      link,
    };

    if (isEditing !== null) {
      setSponsors((prev: HackathonSponsor[]) => prev.map((sponsor, idx) => (idx === isEditing ? newSponsor : sponsor)));
      setIsEditing(null);
    } else {
      setSponsors((prev: HackathonSponsor[]) => [...prev, newSponsor]);
    }

    resetFields();
  };

  const editSponsor = (index: number) => {
    const sponsor = sponsors[index];
    setSponsorName(sponsor.name);
    setTitle(sponsor.title);
    setDescription(sponsor.description);
    setLink(sponsor.link);
    setIsEditing(index);
  };

  const resetFields = () => {
    setSponsorName('');
    setTitle('');
    setDescription('');
    setLink('');
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col items-center gap-4">
        <Input label="Sponsor Name" val={sponsorName} setVal={setSponsorName} maxLength={50} />
        <Input label="Title" val={title} setVal={setTitle} maxLength={50} />
        <TextArea label="Description" val={description} setVal={setDescription} maxLength={250} />
        <Input label="Link" val={link} setVal={setLink} maxLength={100} />
        <SecondaryButton label={isEditing !== null ? 'Update' : 'Add'} onClick={addSponsor} />
      </div>
      {sponsors.length > 0 && (
        <div className="w-full flex flex-wrap gap-4">
          {sponsors.map((sponsor: HackathonSponsor, idx: number) => (
            <div key={idx} className="bg-gray-200 rounded-lg px-4 py-2 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-bold">{sponsor.name}</span>
                <span>{sponsor.title}</span>
                <span>{sponsor.description}</span>
                <a href={sponsor.link} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                  {sponsor.link}
                </a>
              </div>
              <div className="flex gap-2">
                <PencilSimple className="cursor-pointer text-yellow-500" size={24} onClick={() => editSponsor(idx)} />
                <TrashSimple
                  className="cursor-pointer text-red-500"
                  size={24}
                  onClick={() => setSponsors((prev: HackathonSponsor[]) => prev.filter((_, i) => i !== idx))}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const FAQs = ({ faqs, setFaqs }: any) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const addFAQ = () => {
    if (!question.trim() || !answer.trim()) return;
    setFaqs((prev: HackathonFAQ[]) => [...prev, { question, answer }]);
    setQuestion('');
    setAnswer('');
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col items-center gap-4">
        <Input label="Question" val={question} setVal={setQuestion} maxLength={50} />
        <TextArea label="Answer" val={answer} setVal={setAnswer} maxLength={250} />
        <SecondaryButton label="Add" onClick={addFAQ} />
      </div>
      {faqs.length > 0 && (
        <div className="w-full flex flex-wrap gap-4">
          {faqs.map((faq: HackathonFAQ, idx: number) => (
            <div key={idx} className="bg-gray-200 rounded-lg px-4 py-2 flex items-center justify-between">
              <span>{faq.question}</span>
              <span>{faq.answer}</span>
              <TrashSimple
                className="cursor-pointer text-red-500"
                size={24}
                onClick={() => setFaqs((prev: HackathonFAQ[]) => prev.filter((_, i) => i !== idx))}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
