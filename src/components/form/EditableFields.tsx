import React, { Dispatch, SetStateAction, useState } from 'react';
import { useSelector } from 'react-redux';
import { SERVER_ERROR } from '@/config/errors';
import { ORG_URL } from '@/config/routes';
import deleteHandler from '@/handlers/delete_handler';
import patchHandler from '@/handlers/patch_handler';
import postHandler from '@/handlers/post_handler';
import { Hackathon, HackathonPrize, HackathonSponsor, HackathonTrack, HackathonFAQ } from '@/types';
import Toaster from '@/utils/toaster';
import { FloppyDisk, Link, PencilSimple, Trash, Plus } from '@phosphor-icons/react';
import { currentOrgSelector } from '@/slices/orgSlice';
import { initialHackathon } from '@/types/initials';
const boxWrapperClass = 'w-full px-4 py-2 bg-[#E6E7EB70] relative rounded-md';

export function EditableTrackBox({
  val,
  setVal,
  track,
  index,
}: {
  val: Hackathon;
  track: HackathonTrack;
  index: number;
  setVal: Dispatch<SetStateAction<Hackathon>>;
}) {
  const [isEditable, setIsEditable] = useState(false);
  const [trackData, setTrackData] = useState(track);
  const [mutex, setMutex] = useState(false);
  const currentOrg = useSelector(currentOrgSelector);
  const [hackathon, setHackathon] = useState<Hackathon>(initialHackathon);
  const handleEditTrack = async () => {
    if (mutex) return;
    setMutex(true);
    const toaster = Toaster.startLoad('Updating track...');
    try {
      const res = await patchHandler(`${ORG_URL}/${currentOrg.id}/hackathons/track/${track.id}`, trackData);
      if (res.statusCode === 200) {
        setVal(prev => ({
          ...prev,
          tracks: prev.tracks.map(t => (t.id === track.id ? res.data.track : t)),
        }));
        Toaster.stopLoad(toaster, 'Track updated!', 1);
      } else {
        Toaster.stopLoad(toaster, res.data.message || SERVER_ERROR, 0);
      }
    } catch (error) {
      Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
    setMutex(false);
    setIsEditable(false);
  };
  function SelectAllInput() {
    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      event.target.select();
    };
  }
  const handleDeleteTrack = async () => {
    if (mutex) return;
    setMutex(true);
    const toaster = Toaster.startLoad('Deleting track...');
    try {
      const res = await deleteHandler(`${ORG_URL}/${currentOrg.id}/hackathons/track/${track.id}`);
      if (res.statusCode === 204) {
        setVal(prev => ({
          ...prev,
          tracks: prev.tracks.filter(t => t.id !== track.id),
        }));
        Toaster.stopLoad(toaster, 'Track deleted!', 1);
      } else {
        Toaster.stopLoad(toaster, res.data.message || SERVER_ERROR, 0);
      }
    } catch (error) {
      Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
    setMutex(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          {isEditable ? (
            <input
              className="w-full text-xl font-semibold px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={trackData.title}
              placeholder="Track name"
              onChange={e => setTrackData({ ...trackData, title: e.target.value })}
            />
          ) : (
            <h3 className="text-xl font-semibold text-gray-900">{trackData.title}</h3>
          )}
        </div>
        <div className="flex gap-2 ml-4">
          <button
            className="p-2 text-gray-600 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
            onClick={() => {
              if (isEditable) handleEditTrack();
              else setIsEditable(true);
            }}
            disabled={mutex}
          >
            {!isEditable ? <PencilSimple size={18} /> : <FloppyDisk size={18} />}
          </button>
          <button
            className="p-2 text-gray-600 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
            onClick={handleDeleteTrack}
            disabled={mutex}
          >
            <Trash size={18} />
          </button>
        </div>
      </div>

      {isEditable ? (
        <textarea
          className="w-full h-24 px-3 py-2 text-gray-700 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={trackData.description}
          placeholder="Track description"
          onChange={e => setTrackData({ ...trackData, description: e.target.value })}
        />
      ) : (
        <p className="text-gray-600 leading-relaxed">{trackData.description}</p>
      )}
    </div>
  );
}

export function EditableBox({
  val,
  setVal,
  placeholder,
  type = 'text',
  maxLength = 50,
  className,
  field,
}: {
  val: Hackathon;
  setVal: Dispatch<SetStateAction<Hackathon>>;
  placeholder: string;
  type?: 'text' | 'number' | 'email';
  maxLength?: number;
  className?: string;
  field: keyof Hackathon;
}) {
  const [isEditable, setIsEditable] = useState(false);
  const [mutex, setMutex] = useState(false);
  const currentOrg = useSelector(currentOrgSelector);

  const handleEditDetail = async () => {
    if (mutex) return;
    setMutex(true);
    const toaster = Toaster.startLoad('Updating Details...');

    try {
      const res = await patchHandler(`${ORG_URL}/${currentOrg.id}/hackathons/`, { [field]: val[field] });
      if (res.statusCode === 200) {
        Toaster.stopLoad(toaster, 'Details Updated!', 1);
      } else {
        Toaster.stopLoad(toaster, res.data.message || SERVER_ERROR, 0);
      }
    } catch (error) {
      Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
    setMutex(false);
    setIsEditable(false);
  };

  return (
    <div className={`${boxWrapperClass}`}>
      <button
        className="bg-white rounded-md text-black p-1 absolute top-2 right-2 border-[1px] border-[#dedede]"
        disabled={mutex}
        onClick={() => {
          if (isEditable) {
            handleEditDetail();
          } else {
            setIsEditable(true);
          }
        }}
      >
        {!isEditable && <PencilSimple size={16} />}
        {isEditable && <FloppyDisk size={16} />}
      </button>

      {isEditable ? (
        <input
          value={val[field]?.toString() || ''}
          onChange={e => setVal(prev => ({ ...prev, [field]: e.target.value }))}
          placeholder={placeholder}
          type={type}
          maxLength={maxLength}
          className={`w-full h-full bg-transparent border-0 outline-none focus:outline-none focus:border-0 ${className}`}
        />
      ) : (
        <span className={`w-full h-full ${className}`}>{val[field]?.toString() || ''}</span>
      )}
    </div>
  );
}

export function EditableSponsorBox({
  val,
  setVal,
  sponsor,
  index,
}: {
  val: Hackathon;
  sponsor: HackathonSponsor;
  index: number;
  setVal: Dispatch<SetStateAction<Hackathon>>;
}) {
  const [isEditable, setIsEditable] = useState(false);
  const [sponsorData, setSponsorData] = useState(sponsor);
  const [mutex, setMutex] = useState(false);
  const currentOrg = useSelector(currentOrgSelector);

  const handleEditSponsor = async () => {
    if (mutex) return;
    setMutex(true);
    const toaster = Toaster.startLoad('Updating the Sponsor...');

    try {
      const res = await patchHandler(`${ORG_URL}/${currentOrg.id}/hackathons/sponsor/${sponsor.id}`, sponsorData);
      if (res.statusCode === 200) {
        setVal(prev => ({
          ...prev,
          sponsors: prev.sponsors.map(s => (s.id === sponsor.id ? res.data.sponsor : s)),
        }));
        Toaster.stopLoad(toaster, 'Sponsor Updated!', 1);
      } else {
        Toaster.stopLoad(toaster, res.data.message || SERVER_ERROR, 0);
      }
    } catch (error) {
      Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
    setMutex(false);
    setIsEditable(false);
  };

  const handleDeleteSponsor = async () => {
    if (mutex) return;
    setMutex(true);
    const toaster = Toaster.startLoad('Deleting Sponsor...');

    try {
      const res = await deleteHandler(`${ORG_URL}/${currentOrg.id}/hackathons/sponsor/${sponsor.id}`);
      if (res.statusCode === 204) {
        setVal(prev => ({
          ...prev,
          sponsors: prev.sponsors.filter(s => s.id !== sponsor.id),
        }));
        Toaster.stopLoad(toaster, 'Sponsor Deleted!', 1);
      } else {
        Toaster.stopLoad(toaster, res.data.message || SERVER_ERROR, 0);
      }
    } catch (error) {
      Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
    setMutex(false);
  };

  return (
    <div className={`${boxWrapperClass}`}>
      <div className="flex items-center gap-1 absolute top-2 right-2">
        <button
          className="bg-white rounded-md text-black p-1 border-[1px] border-[#dedede]"
          onClick={() => {
            if (isEditable) {
              handleEditSponsor();
            } else {
              setIsEditable(true);
            }
          }}
          disabled={mutex}
        >
          {!isEditable && <PencilSimple size={16} />}
          {isEditable && <FloppyDisk size={16} />}
        </button>
        <button
          className="bg-white rounded-md text-black p-1 border-[1px] border-[#dedede]"
          onClick={handleDeleteSponsor}
          disabled={mutex}
        >
          <Trash size={16} />
        </button>
      </div>
      {isEditable ? (
        <section className="w-full h-full flex flex-col gap-1">
          <input
            className="font-semibold text-base bg-[#dedede] p-1"
            value={sponsorData.name}
            placeholder="Sponsor name"
            onChange={e => setSponsorData({ ...sponsorData, name: e.target.value })}
          />
          <input
            className="font-semibold text-sm bg-[#dedede] p-1"
            value={sponsorData.link}
            placeholder="Link"
            onChange={e => setSponsorData({ ...sponsorData, link: e.target.value })}
          />
          <input
            className="font-semibold text-sm bg-[#dedede] p-1"
            value={sponsorData.title}
            placeholder="Sponsor title"
            onChange={e => setSponsorData({ ...sponsorData, title: e.target.value })}
          />
          <textarea
            value={sponsorData.description}
            className="text-xs bg-[#dedede] p-1"
            onChange={e => setSponsorData({ ...sponsorData, description: e.target.value })}
          ></textarea>
        </section>
      ) : (
        <section className="w-full h-full">
          <span className="flex items-center gap-1">
            <p className="font-semibold text-lg">{sponsorData.name}</p>
            <a href={sponsorData.link} target="_blank" rel="noopener noreferrer">
              <Link size={20} />
            </a>
          </span>
          <p className="text-sm -mt-1">{sponsorData.title}</p>
          <p className="text-xs">
            {sponsorData?.description && sponsorData?.description?.length > 50
              ? sponsorData?.description?.slice(0, 30) + '...'
              : sponsorData.description}
          </p>
        </section>
      )}
    </div>
  );
}

export function EditableFAQBox({
  val,
  setVal,
  faq,
  index,
}: {
  val: Hackathon;
  faq: HackathonFAQ;
  index: number;
  setVal: Dispatch<SetStateAction<Hackathon>>;
}) {
  const [isEditable, setIsEditable] = useState(false);
  const [faqData, setFaqData] = useState(faq);
  const [mutex, setMutex] = useState(false);
  const currentOrg = useSelector(currentOrgSelector);

  const handleEditFAQ = async () => {
    if (mutex) return;
    setMutex(true);
    const toaster = Toaster.startLoad('Updating the FAQ...');

    try {
      const res = await patchHandler(`${ORG_URL}/${currentOrg.id}/hackathons/faq/${faq.id}`, faqData);
      if (res.statusCode === 200) {
        setVal(prev => ({
          ...prev,
          faqs: prev.faqs.map(f => (f.id === faq.id ? res.data.faq : f)),
        }));
        Toaster.stopLoad(toaster, 'FAQ Updated!', 1);
      } else {
        Toaster.stopLoad(toaster, res.data.message || SERVER_ERROR, 0);
      }
    } catch (error) {
      Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
    setMutex(false);
    setIsEditable(false);
  };

  const handleDeleteFaq = async () => {
    if (mutex) return;
    setMutex(true);
    const toaster = Toaster.startLoad('Deleting FAQ...');

    try {
      const res = await deleteHandler(`${ORG_URL}/${currentOrg.id}/hackathons/faq/${faq.id}`);
      if (res.statusCode === 204) {
        setVal(prev => ({
          ...prev,
          faqs: prev.faqs.filter(f => f.id !== faq.id),
        }));
        Toaster.stopLoad(toaster, 'FAQ Deleted!', 1);
      } else {
        Toaster.stopLoad(toaster, res.data.message || SERVER_ERROR, 0);
      }
    } catch (error) {
      Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
    setMutex(false);
  };

  return (
    <div className={`${boxWrapperClass}`}>
      <div className="flex items-center gap-1 absolute top-2 right-2">
        <button
          className="bg-white rounded-md text-black p-1 border-[1px] border-[#dedede]"
          disabled={mutex}
          onClick={() => {
            if (isEditable) {
              console.log(faqData);
              handleEditFAQ();
            } else {
              setIsEditable(true);
            }
          }}
        >
          {!isEditable && <PencilSimple size={16} />}
          {isEditable && <FloppyDisk size={16} />}
        </button>
        <button
          className="bg-white rounded-md text-black p-1 border-[1px] border-[#dedede]"
          onClick={handleDeleteFaq}
          disabled={mutex}
        >
          <Trash size={16} />
        </button>
      </div>
      {isEditable ? (
        <section className="w-full h-full flex flex-col gap-2">
          <div className="flex flex-col gap-0">
            <h2>Question</h2>
            <textarea
              value={faqData.question}
              className="text-xs bg-[#dedede] p-1"
              onChange={e => setFaqData({ ...faqData, question: e.target.value })}
            ></textarea>
          </div>
          <div className="flex flex-col gap-0">
            <h2>Answer</h2>
            <textarea
              value={faqData.answer}
              className="text-xs bg-[#dedede] p-1"
              onChange={e => setFaqData({ ...faqData, answer: e.target.value })}
            ></textarea>
          </div>
        </section>
      ) : (
        <section className="w-full h-full mt-8">
          <p className="font-semibold text-base">{faqData.question}</p>
          <p className="text-sm -mt-1">{faqData.answer}</p>
        </section>
      )}
    </div>
  );
}
//
export function AddTrackBox({
  val,
  setVal,
}: {
  val: Hackathon;
  setVal: React.Dispatch<React.SetStateAction<Hackathon>>;
}) {
  const [newTrack, setNewTrack] = useState<HackathonTrack>({ id: '', hackathonID: '', title: '', description: '' });
  const [mutex, setMutex] = useState(false);
  const currentOrg = useSelector(currentOrgSelector);

  const handleAddTrack = async () => {
    if (mutex) return;
    setMutex(true);
    const toaster = Toaster.startLoad('Adding new track...');

    try {
      const res = await postHandler(`${ORG_URL}/${currentOrg.id}/hackathons/${val.id}/track`, newTrack);
      if (res.statusCode === 201) {
        setVal(prev => ({
          ...prev,
          tracks: [...prev.tracks, res.data.track],
        }));
        setNewTrack({ id: '', hackathonID: '', title: '', description: '' });
        Toaster.stopLoad(toaster, 'New track added!', 1);
      } else {
        Toaster.stopLoad(toaster, res.data.message || SERVER_ERROR, 0);
      }
    } catch (error) {
      Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
    setMutex(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Add New Track</h3>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Track Title"
          value={newTrack.title}
          onChange={e => setNewTrack({ ...newTrack, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          placeholder="Track Description"
          value={newTrack.description}
          onChange={e => setNewTrack({ ...newTrack, description: e.target.value })}
          className="w-full h-24 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddTrack}
          disabled={mutex}
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Track
        </button>
      </div>
    </div>
  );
}
//
export function AddSponsorBox({ val, setVal }: { val: Hackathon; setVal: Dispatch<SetStateAction<Hackathon>> }) {
  const [newSponsor, setNewSponsor] = useState<HackathonSponsor>({
    id: '',
    hackathonID: '',
    coverPic: '',
    blurHash: '',
    name: '',
    link: '',
    title: '',
    description: '',
  });
  const [mutex, setMutex] = useState(false);
  const currentOrg = useSelector(currentOrgSelector);
  const toaster = Toaster.startLoad('Adding new sponsor...');
  const handleAddSponsor = async () => {
    if (mutex) return;
    setMutex(true);
    setNewSponsor({
      id: '',
      hackathonID: '',
      coverPic: '',
      blurHash: '',
      name: '',
      link: '',
      title: '',
      description: '',
    });

    try {
      const res = await postHandler(`${ORG_URL}/${currentOrg.id}/hackathons/sponsor`, newSponsor);
      if (res.statusCode === 201) {
        setVal(prev => ({
          ...prev,
          sponsors: [...prev.sponsors, res.data.sponsor],
        }));
        setNewSponsor({
          id: '',
          hackathonID: '',
          coverPic: '',
          blurHash: '',
          name: '',
          link: '',
          title: '',
          description: '',
        });
        Toaster.stopLoad(toaster, 'New sponsor added!', 1);
      } else {
        Toaster.stopLoad(toaster, res.data.message || SERVER_ERROR, 0);
      }
    } catch (error) {
      Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
    setMutex(false);
  };

  return (
    <div className={`${boxWrapperClass}`}>
      <h3 className="text-lg font-semibold mb-2">Add New Sponsor</h3>
      <input
        type="text"
        placeholder="Sponsor Name"
        value={newSponsor.name}
        onChange={e => setNewSponsor({ ...newSponsor, name: e.target.value })}
        className="w-full p-2 border rounded mb-2"
      />
      <input
        type="text"
        placeholder="Sponsor Link"
        value={newSponsor.link}
        onChange={e => setNewSponsor({ ...newSponsor, link: e.target.value })}
        className="w-full p-2 border rounded mb-2"
      />
      <input
        type="text"
        placeholder="Sponsor Title"
        value={newSponsor.title}
        onChange={e => setNewSponsor({ ...newSponsor, title: e.target.value })}
        className="w-full p-2 border rounded mb-2"
      />
      <textarea
        placeholder="Sponsor Description"
        value={newSponsor.description}
        onChange={e => setNewSponsor({ ...newSponsor, description: e.target.value })}
        className="w-full p-2 border rounded mb-2"
      />
      <button
        onClick={handleAddSponsor}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={mutex}
      >
        <Plus className="inline-block mr-2" />
        Add Sponsor
      </button>
    </div>
  );
}

export function AddFAQBox({ val, setVal }: { val: Hackathon; setVal: Dispatch<SetStateAction<Hackathon>> }) {
  const [newFAQ, setNewFAQ] = useState<HackathonFAQ>({ id: '', hackathonID: '', question: '', answer: '' });
  const [mutex, setMutex] = useState(false);
  const currentOrg = useSelector(currentOrgSelector);
  const handleAddFAQ = async () => {
    if (mutex) return;
    setMutex(true);
    const toaster = Toaster.startLoad('Adding new FAQ...');

    try {
      const res = await postHandler(`${ORG_URL}/${currentOrg.id}/hackathons/faq`, newFAQ);
      if (res.statusCode === 201) {
        setVal(prev => ({
          ...prev,
          faqs: [...prev.faqs, res.data.faq],
        }));
        setNewFAQ({ id: '', hackathonID: '', question: '', answer: '' });
        Toaster.stopLoad(toaster, 'New FAQ added!', 1);
      } else {
        Toaster.stopLoad(toaster, res.data.message || SERVER_ERROR, 0);
      }
    } catch (error) {
      Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
    setMutex(false);
  };

  return (
    <div className={`${boxWrapperClass}`}>
      <h3 className="text-lg font-semibold mb-2">Add New FAQ</h3>
      <textarea
        placeholder="Question"
        value={newFAQ.question}
        onChange={e => setNewFAQ({ ...newFAQ, question: e.target.value })}
        className="w-full p-2 border rounded mb-2"
      />
      <textarea
        placeholder="Answer"
        value={newFAQ.answer}
        onChange={e => setNewFAQ({ ...newFAQ, answer: e.target.value })}
        className="w-full p-2 border rounded mb-2"
      />
      <button
        onClick={handleAddFAQ}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={mutex}
      >
        <Plus className="inline-block mr-2" />
        Add FAQ
      </button>
    </div>
  );
}
