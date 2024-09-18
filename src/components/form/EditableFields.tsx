import { HackathonEditDetails } from '@/types';
import { FloppyDisk, Link, Medal, PencilSimple, Trash } from '@phosphor-icons/react';
import { Dispatch, SetStateAction, useState } from 'react';
const boxWrapperClass = 'w-full px-4 py-2 bg-[#E6E7EB70] relative rounded-md';
export function EditableTrackBox({
  val,
  setVal,
  track,
  index,
}: {
  val: HackathonEditDetails;
  track: {
    title: string;
    description: string;
    prizes: {
      title: string;
      description: string;
      amount: number;
    }[];
  };
  index: number;
  setVal: Dispatch<SetStateAction<HackathonEditDetails>>;
}) {
  const [isEditable, setIsEditable] = useState(false);
  const [trackData, setTrackData] = useState(track);
  return (
    <div className={`${boxWrapperClass}`}>
      <div className="flex items-center gap-1 absolute top-2 right-2">
        <button
          className="bg-white rounded-md text-black p-1  border-[1px] border-[#dedede]"
          onClick={() => {
            setIsEditable(!isEditable);
          }}
        >
          {!isEditable && <PencilSimple size={16} />}
          {isEditable && <FloppyDisk size={16} />}
        </button>
        <button
          className="bg-white rounded-md text-black p-1  border-[1px] border-[#dedede]"
          onClick={() => {
            setVal({ ...val, tracks: val.tracks.filter((_, i) => i !== index) });
          }}
        >
          <Trash size={16} />
        </button>
      </div>
      {isEditable && (
        <section className=" w-full h-full flex flex-col gap-2">
          <div className="flex flex-col gap-0">
            <h2>Title</h2>
            <input
              className="text-base bg-[#dedede]  p-1"
              value={trackData.title}
              placeholder="Track name"
              onChange={e => {
                setVal({
                  ...val,
                  tracks: val.tracks.map((s, i) => (i === index ? { ...s, title: e.target.value } : s)),
                });
                setTrackData({ ...trackData, title: e.target.value });
              }}
            />
          </div>
          <div className="flex flex-col gap-0">
            <h2>Description</h2>
            <textarea
              className="text-sm bg-[#dedede]  p-1"
              value={trackData.description}
              placeholder="Track name"
              onChange={e => {
                setVal({
                  ...val,
                  tracks: val.tracks.map((s, i) => (i === index ? { ...s, description: e.target.value } : s)),
                });
                setTrackData({ ...trackData, description: e.target.value });
              }}
            />
          </div>
          <div className="flex flex-col gap-0">
            <h2>Prizes</h2>
            <div className="flex flex-col gap-1">
              {' '}
              {trackData.prizes.map((t, idx) => (
                <div className="flex flex-col" key={idx}>
                  <div className="flex w-full gap-1 items-center">
                    <input
                      className="text-sm bg-[#dedede]  p-1"
                      value={trackData.prizes[idx].title}
                      placeholder="Prize name"
                      onChange={e => {
                        setVal({
                          ...val,
                          tracks: val.tracks.map((s, i) =>
                            i === index
                              ? {
                                  ...s,
                                  prizes: trackData.prizes.map((prize, i) =>
                                    i === idx ? { ...prize, title: e.target.value } : prize
                                  ),
                                }
                              : s
                          ),
                        });
                        setTrackData({
                          ...trackData,
                          prizes: trackData.prizes.map((prize, i) =>
                            i === idx ? { ...prize, title: e.target.value } : prize
                          ),
                        });
                      }}
                    />
                    <input
                      className="text-sm bg-[#dedede]  p-1"
                      value={trackData.prizes[idx].amount}
                      type="number"
                      placeholder="Amount"
                      onChange={e => {
                        setVal({
                          ...val,
                          tracks: val.tracks.map((s, i) =>
                            i === index
                              ? {
                                  ...s,
                                  prizes: trackData.prizes.map((prize, i) =>
                                    i === idx ? { ...prize, amount: parseFloat(e.target.value) } : prize
                                  ),
                                }
                              : s
                          ),
                        });
                        setTrackData({
                          ...trackData,
                          prizes: trackData.prizes.map((prize, i) =>
                            i === idx ? { ...prize, amount: parseFloat(e.target.value) } : prize
                          ),
                        });
                      }}
                    />
                  </div>{' '}
                  <input
                    className="text-sm bg-[#dedede]  p-1 w-full"
                    value={trackData.prizes[idx].description}
                    placeholder="description"
                    onChange={e => {
                      setVal({
                        ...val,
                        tracks: val.tracks.map((s, i) =>
                          i === index
                            ? {
                                ...s,
                                prizes: trackData.prizes.map((prize, i) =>
                                  i === idx ? { ...prize, description: e.target.value } : prize
                                ),
                              }
                            : s
                        ),
                      });
                      setTrackData({
                        ...trackData,
                        prizes: trackData.prizes.map((prize, i) =>
                          i === idx ? { ...prize, description: e.target.value } : prize
                        ),
                      });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {!isEditable && (
        <section className=" w-full h-full">
          <h1 className="text-xl font-semibold">{trackData.title}</h1>
          <p>{trackData.description}</p>
          <h3 className="text-sm font-medium mt-3">Prizes</h3>
          <div className="flex flex-col gap-1">
            {trackData.prizes.map((prize, index) => (
              <div className="flex flex-col bg-[#dedede] p-1 rounded-md" key={index}>
                <section className="flex items-center gap-2 text-sm">
                  <span className="flex items-center gap-1">
                    <Medal size={16} />

                    <p>{prize.title}</p>
                  </span>
                  <p className="font-semibold">{prize.amount}</p>
                </section>
                <p className="text-xs">{prize.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
interface EditableBoxProps {
  val: HackathonEditDetails;
  setVal: Dispatch<SetStateAction<HackathonEditDetails>>;
  placeholder: string;
  type?: 'text' | 'number' | 'email';
  maxLength?: number;
  className?: string;
  field: string;
}

export function EditableBox({
  val,
  setVal,
  placeholder,
  type = 'text',
  maxLength = 50,
  className,
  field,
}: EditableBoxProps) {
  const [isEditable, setIsEditable] = useState(false);
  return (
    <div className={`${boxWrapperClass}`}>
      <button
        className="bg-white rounded-md text-black p-1 absolute top-2 right-2 border-[1px] border-[#dedede]"
        onClick={() => {
          setIsEditable(!isEditable);
        }}
      >
        {!isEditable && <PencilSimple size={16} />}
        {isEditable && <FloppyDisk size={16} />}
      </button>

      {isEditable && (
        <input
          value={val[field as keyof HackathonEditDetails]?.toString() || ''}
          onChange={e => {
            const details = { ...val, [field]: e.target.value };
            setVal(details);
          }}
          placeholder={placeholder}
          type={type}
          maxLength={maxLength}
          className={`w-full h-full bg-transparent border-0 outline-none focus:outline-none focus:border-0 ${className}`}
        />
      )}
      {!isEditable && (
        <span className={`w-full h-full  ${className}`}>
          {val[field as keyof HackathonEditDetails]?.toString() || ''}
        </span>
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
  val: HackathonEditDetails;
  sponsor: {
    name: string;
    title: string;
    description: string;
    link: string;
  };
  index: number;
  setVal: Dispatch<SetStateAction<HackathonEditDetails>>;
}) {
  const [isEditable, setIsEditable] = useState(false);
  const [sponsorData, setSponsorData] = useState(sponsor);
  return (
    <div className={`${boxWrapperClass}`}>
      <div className="flex items-center gap-1 absolute top-2 right-2">
        <button
          className="bg-white rounded-md text-black p-1  border-[1px] border-[#dedede]"
          onClick={() => {
            setIsEditable(!isEditable);
          }}
        >
          {!isEditable && <PencilSimple size={16} />}
          {isEditable && <FloppyDisk size={16} />}
        </button>
        <button
          className="bg-white rounded-md text-black p-1  border-[1px] border-[#dedede]"
          onClick={() => {
            setVal({ ...val, sponsors: val.sponsors.filter((_, i) => i !== index) });
          }}
        >
          <Trash size={16} />
        </button>
      </div>
      {isEditable && (
        <section className=" w-full h-full flex flex-col gap-1">
          <input
            className="font-semibold text-base bg-[#dedede]  p-1"
            value={sponsorData.name}
            placeholder="Sponsor name"
            onChange={e => {
              setVal({
                ...val,
                sponsors: val.sponsors.map((s, i) => (i === index ? { ...s, name: e.target.value } : s)),
              });
              setSponsorData({ ...sponsorData, name: e.target.value });
            }}
          />
          <input
            className="font-semibold text-sm bg-[#dedede]  p-1"
            value={sponsorData.link}
            placeholder="Link"
            onChange={e => {
              setVal({
                ...val,
                sponsors: val.sponsors.map((s, i) => (i === index ? { ...s, link: e.target.value } : s)),
              });
              setSponsorData({ ...sponsorData, link: e.target.value });
            }}
          />
          <input
            className="font-semibold text-sm bg-[#dedede]  p-1"
            value={sponsorData.title}
            placeholder="Sponsor title"
            onChange={e => {
              setVal({
                ...val,
                sponsors: val.sponsors.map((s, i) => (i === index ? { ...s, title: e.target.value } : s)),
              });
              setSponsorData({ ...sponsorData, title: e.target.value });
            }}
          />
          <textarea
            value={sponsorData.description}
            className="text-xs bg-[#dedede] p-1"
            onChange={e => {
              setVal({
                ...val,
                sponsors: val.sponsors.map((s, i) => (i === index ? { ...s, description: e.target.value } : s)),
              });
              setSponsorData({ ...sponsorData, description: e.target.value });
            }}
          ></textarea>
        </section>
      )}
      {!isEditable && (
        <section className=" w-full h-full">
          <span className="flex items-center gap-1">
            <p className="font-semibold text-lg">{sponsorData.name}</p>
            <a href={sponsorData.link} target="_blank">
              <Link size={20} />
            </a>
          </span>
          <p className="text-sm -mt-1">{sponsorData.title}</p>
          <p className="text-xs">
            {sponsorData.description.length > 50
              ? sponsorData.description.slice(0, 30) + '...'
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
  val: HackathonEditDetails;
  faq: {
    question: string;
    answer: string;
  };
  index: number;
  setVal: Dispatch<SetStateAction<HackathonEditDetails>>;
}) {
  const [isEditable, setIsEditable] = useState(false);
  const [faqData, setFaqData] = useState(faq);
  return (
    <div className={`${boxWrapperClass}`}>
      <div className="flex items-center gap-1 absolute top-2 right-2">
        <button
          className="bg-white rounded-md text-black p-1  border-[1px] border-[#dedede]"
          onClick={() => {
            setIsEditable(!isEditable);
          }}
        >
          {!isEditable && <PencilSimple size={16} />}
          {isEditable && <FloppyDisk size={16} />}
        </button>
        <button
          className="bg-white rounded-md text-black p-1  border-[1px] border-[#dedede]"
          onClick={() => {
            setVal({ ...val, faqs: val.faqs.filter((_, i) => i !== index) });
          }}
        >
          <Trash size={16} />
        </button>
      </div>
      {isEditable && (
        <section className=" w-full h-full flex flex-col gap-2">
          <div className="flex flex-col gap-0">
            <h2>Question</h2>
            <textarea
              value={faqData.question}
              className="text-xs bg-[#dedede] p-1"
              onChange={e => {
                setVal({
                  ...val,
                  sponsors: val.sponsors.map((s, i) => (i === index ? { ...s, answer: e.target.value } : s)),
                });
                setFaqData({ ...faqData, question: e.target.value });
              }}
            ></textarea>
          </div>
          <div className="flex flex-col gap-0">
            <h2>Answer</h2>{' '}
            <textarea
              value={faqData.answer}
              className="text-xs bg-[#dedede] p-1"
              onChange={e => {
                setVal({
                  ...val,
                  faqs: val.faqs.map((s, i) => (i === index ? { ...s, answer: e.target.value } : s)),
                });
                setFaqData({ ...faqData, answer: e.target.value });
              }}
            ></textarea>
          </div>
        </section>
      )}
      {!isEditable && (
        <section className=" w-full h-full mt-8">
          <p className="font-semibold text-base">{faqData.question}</p>
          <p className="text-sm -mt-1">{faqData.answer}</p>
        </section>
      )}
    </div>
  );
}
