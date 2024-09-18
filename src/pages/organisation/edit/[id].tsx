import OrgSidebar from '@/components/common/org_sidebar';
import { currentOrgSelector } from '@/slices/orgSlice';
import OrgMembersOnlyAndProtect from '@/utils/wrappers/org_members_only';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import React, { Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { FloppyDisk, Link, Medal, PencilSimple, Plus, Trash, X } from '@phosphor-icons/react';
import { HackathonEditDetails } from '@/types';
import Image from 'next/image';
import Input from '@/components/form/input';
import { EditableBox, EditableFAQBox, EditableSponsorBox, EditableTrackBox } from '@/components/form/EditableFields';
import { EXPLORE_URL, ORG_URL, USER_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import Toaster from '@/utils/toaster';
import { SERVER_ERROR } from '@/config/errors';
import postHandler from '@/handlers/post_handler';
const boxWrapperClass = 'w-full px-4 py-2 bg-[#E6E7EB70] relative rounded-md';
function EditEvent() {
  const router = useRouter();
  const { id } = router.query;
  const currentOrg = useSelector(currentOrgSelector);
  const [eventData, setEventData] = useState<any>(null);
  const [mutex, setMutex] = useState(false);
  const [eventDetails, setEventDetails] = useState<HackathonEditDetails>({
    hackathonID: '',
    organizationID: '',
    title: 'Hackathon Title',
    tagline: 'Hackathon Tagline',
    coverPic: '',
    location: 'Location',
    description:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit qui, accusantium molestias enim possimus saepe veniam at tempore quaerat cupiditate natus ut, facere nam accusamus, minus asperiores odio eos! Molestiae.Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit qui, accusantium molestias enim possimus saepe veniam at tempore quaerat cupiditate natus ut, facere nam accusamus, minus asperiores odio eos! Molestiae.',
    startTime: new Date('2021-09-01T10:00'),
    endTime: new Date('2021-09-01T10:00'),
    tags: ['tag1', 'tag2'],
    minTeamSize: 1,
    maxTeamSize: 4,
    rounds: [],
    sponsors: [
      {
        name: 'ABC Company',
        title: 'Main Sponsor',
        description: 'This is a description of the sponsor',
        link: 'https://www.google.com',
      },
      {
        name: 'XYZ Company',
        title: 'Food Sponsor',
        description: 'This is a description of the sponsor',
        link: 'https://www.google.com',
      },
    ],
    tracks: [
      {
        title: 'Track 1',
        description: 'This is a description of the track 1',
        prizes: [
          {
            title: 'First Prize',
            description: 'This is a description of the prize',
            amount: 1000,
          },
          {
            title: 'Second  Prize',
            description: 'This is a description of the prize',
            amount: 600,
          },
          {
            title: 'Third Prize',
            description: 'This is a description of the prize',
            amount: 200,
          },
        ],
      },
      {
        title: 'Track 2',
        description: 'This is a description of the track 2',
        prizes: [
          {
            title: 'First Prize',
            description: 'This is a description of the prize',
            amount: 1000,
          },
          {
            title: 'Second  Prize',
            description: 'This is a description of the prize',
            amount: 600,
          },
          {
            title: 'Third Prize',
            description: 'This is a description of the prize',
            amount: 200,
          },
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the eligibility criteria?',
        answer: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
      },
      {
        question: 'What is the eligibility criteria?',
        answer: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
      },
    ],
  });
  useEffect(() => {
    if (!eventData) {
      return;
    } else {
      const data = {
        ...eventDetails,
        hackathonID: eventData.hackathonID,
        organizationID: eventData.organizationID,
        title: eventData.title,
        tagline: eventData.tagline,
        coverPic: eventData.coverPic.includes('https') ? eventData.coverPic : '',
        description: eventData.description,
        tags: eventData.tags,
        startTime: new Date(eventData.startTime),
        endTime: new Date(eventData.endTime),
        minTeamSize: eventData.hackathon.minTeamSize?.toString(),
        maxTeamSize: eventData.hackathon.maxTeamSize?.toString(),
      };
      setEventDetails(data);
    }
  }, [eventData]);
  const getEvent = () => {
    const URL = `${EXPLORE_URL}/events/${id}`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          setEventData(res.data.event);
          console.log(res.data.event);
        } else {
          if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
          else {
            Toaster.error(SERVER_ERROR, 'error_toaster');
          }
        }
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      });
  };
  useEffect(() => {
    if (id) {
      getEvent();
    }
  }, [id]);
  const handleCreateFAQ = async (data: { question: string; answer: string }) => {
    if (mutex) return;
    setMutex(true);
    const toaster = Toaster.startLoad('Creating...');
    const res = await postHandler(
      `${ORG_URL}/${eventData.organizationID}/hackathons/${eventData.hackathonID}/faq`,
      data
    );
    if (res.statusCode === 201) {
      Toaster.stopLoad(toaster, 'FAQ Added!', 1);
      setEventDetails({
        ...eventDetails,
        faqs: [
          ...eventDetails.faqs,
          {
            id: res.data.faq.id,
            question: 'Question New',
            answer: 'Answer New',
          },
        ],
      });
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
    setMutex(false);
  };
  const handleAddSponsor = async (data: { name: string; link: string; title: string; description: string }) => {
    if (mutex) return;
    setMutex(true);
    const toaster = Toaster.startLoad('Adding Sponsor...');
    const res = await postHandler(
      `${ORG_URL}/${eventData.organizationID}/hackathons/${eventData.hackathonID}/sponsor`,
      data
    );
    if (res.statusCode === 201) {
      Toaster.stopLoad(toaster, 'Sponsor Added!', 1);
      setEventDetails({
        ...eventDetails,
        sponsors: [
          ...eventDetails.sponsors,
          {
            id: res.data.sponsor.id,
            name: 'Sponsor Name',
            link: 'Sponsor Link',
            title: 'Sponsor Title',
            description: 'Sponsor Description',
          },
        ],
      });
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
    setMutex(false);
  };
  if (!id) {
    return <div>Loading...</div>;
  }
  return (
    <BaseWrapper title={`Events | ${currentOrg.title}`}>
      <OrgSidebar index={12} />
      <MainWrapper>
        <div className="w-full flex flex-col items- pl-4 gap-4 max-md:px-2 p-base_padding  pb-12 bg-white">
          <div
            className="w-full  h-40 bg-white border-[2px] border-[#dedede] rounded-xl "
            style={{
              background:
                'linear-gradient(-90deg,rgba(131, 58, 180, 1) 0%,rgba(253, 29, 29, 1) 50%,rgba(252, 176, 69, 1) 100%)',
            }}
          >
            {!eventDetails.coverPic && (
              <section className="h-full w-full flex items-center justify-center gap-4">
                <span className="bg-white text-black h-8 w-8 flex items-center justify-center rounded-lg">
                  <Plus size={24} />
                </span>
                <p className="text-lg font-semibold text-white">Change Cover Image</p>
              </section>
            )}
            {eventDetails.coverPic && (
              <Image
                src={eventDetails.coverPic}
                alt=""
                width={1000}
                height={600}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="w-full flex items-start justify-between gap-4">
            <section className="--main-details w-[75%] h-full flex flex-col gap-2">
              <div className="w-full flex items-center flex-wrap gap-2">
                {eventDetails.tags &&
                  eventDetails.tags?.map((tag, index) => (
                    <span
                      className="bg-primary_text text-white rounded-full px-4 py-2 text-xs flex items-center gap-3"
                      key={index}
                    >
                      <p>{tag}</p>
                      <button
                        className="bg-white rounded-full text-black p-[1px]  border-[1px] border-[#dedede]"
                        onClick={() => {
                          if (eventDetails.tags) {
                            setEventDetails({
                              ...eventDetails,
                              tags: eventDetails.tags.filter((_, i) => i !== index),
                            });
                          }
                        }}
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                <button className=" bg-[#dedede] p-2 text-sm w-fit flex gap-2 rounded-full items-center justify-center ">
                  <Plus size={16} weight="bold" />
                  <p className="font-semibold">Add Tag</p>
                </button>
              </div>
              <div className="w-full flex items-start gap-2 ">
                <div className="flex flex-col gap-2 w-full">
                  <EditableBox
                    val={eventDetails}
                    setVal={setEventDetails}
                    field="title"
                    placeholder="Enter Hackathon Title"
                    maxLength={100}
                    className="text-4xl font-semibold"
                  />
                  <EditableBox
                    val={eventDetails}
                    setVal={setEventDetails}
                    field="tagline"
                    placeholder="Enter a tagline for hackathon"
                    className="text-2xl font-semibold"
                  />
                  <EditableBox
                    val={eventDetails}
                    setVal={setEventDetails}
                    field="location"
                    placeholder="Enter a location for hackathon"
                    className="text-base font-semibold"
                  />
                </div>
                <div className="w-1/5 h-40  bg-[#E6E7EB70] rounded-md"></div>
              </div>

              <EditableBox
                val={eventDetails}
                setVal={setEventDetails}
                field="description"
                placeholder="Enter a detailed description for the hackathon (max 1000 characters)"
                className="text-base font-semibold"
                maxLength={1000}
              />
              <div className="w-full flex items-start gap-2">
                <div className={boxWrapperClass}>
                  <h1 className="text-xl font-semibold mb-2">Sponsors</h1>
                  <div className="w-full grid grid-cols-3 gap-2">
                    {eventDetails.sponsors.map((sponsor, index) => (
                      <EditableSponsorBox
                        val={eventDetails}
                        sponsor={sponsor}
                        index={index}
                        key={index}
                        setVal={setEventDetails}
                      />
                    ))}
                    <button
                      className=" bg-[#dedede] p-2 rounded-lg w-full flex flex-col items-center justify-center "
                      onClick={() => {
                        handleAddSponsor({
                          name: 'Sponsor Name',
                          link: 'Sponsor Link',
                          title: 'Sponsor Title',
                          description: 'Sponsor Description',
                        });
                      }}
                    >
                      <Plus size={24} weight="bold" />
                      <p className="text-base font-semibold">Add Sponsor</p>
                    </button>
                  </div>
                </div>
              </div>
              <div className={`${boxWrapperClass}`}>
                <div className="w-full">
                  <h1 className="text-xl font-semibold">Team Details</h1>
                  <span className="flex items-center gap-2 w-full">
                    <span className="flex items-center gap-1 w-1/2 relative">
                      <EditableBox
                        val={eventDetails}
                        setVal={setEventDetails}
                        field="minTeamSize"
                        placeholder="MIN"
                        className="text-base font-semibold"
                      />
                      <p className="absolute top-1/2 -translate-y-1/2 right-12 text-sm">Min. Members</p>
                    </span>
                    <span className="flex items-center gap-1 w-1/2 relative">
                      <EditableBox
                        val={eventDetails}
                        setVal={setEventDetails}
                        field="maxTeamSize"
                        placeholder="MIN"
                        className="text-base font-semibold"
                      />
                      <p className="absolute top-1/2 -translate-y-1/2 right-12 text-sm">Max. Members</p>
                    </span>
                  </span>
                </div>
              </div>
              <div className="w-full flex items-start gap-2">
                <div className={boxWrapperClass}>
                  <h1 className="text-xl font-semibold mb-2">FAQs</h1>
                  <div className="w-full grid grid-cols-3 gap-2">
                    {eventDetails.faqs.map((faq, index) => (
                      <EditableFAQBox val={eventDetails} faq={faq} index={index} key={index} setVal={setEventDetails} />
                    ))}
                    <button
                      className=" bg-[#dedede] p-2 rounded-lg w-full flex flex-col items-center justify-center "
                      onClick={() => {
                        handleCreateFAQ({ question: 'Question New', answer: 'Answer New' });
                      }}
                    >
                      <Plus size={24} weight="bold" />
                      <p className="text-base font-semibold">Add FAQ</p>
                    </button>
                  </div>
                </div>
              </div>
            </section>
            <aside className="--tracks-details w-[25%] h-full">
              <h1 className="text-2xl font-semibold">Tracks</h1>
              <div className="flex flex-col gap-2 mt-2 max-h-[80vh] overflow-y-auto">
                {eventDetails.tracks.map((track, index) => (
                  <EditableTrackBox
                    val={eventDetails}
                    track={track}
                    index={index}
                    key={index}
                    setVal={setEventDetails}
                  />
                ))}{' '}
                <button
                  className=" bg-[#dedede] p-2 rounded-lg w-full flex gap-2 items-center justify-center "
                  onClick={() => {
                    setEventDetails({
                      ...eventDetails,
                      tracks: [
                        {
                          title: 'Track Title',
                          description: 'This is a description of the track',
                          prizes: [
                            {
                              title: 'First Prize',
                              description: 'This is a description of the prize',
                              amount: 100,
                            },
                            {
                              title: 'Second  Prize',
                              description: 'This is a description of the prize',
                              amount: 100,
                            },
                            {
                              title: 'Third Prize',
                              description: 'This is a description of the prize',
                              amount: 100,
                            },
                          ],
                        },
                        ...eventDetails.tracks,
                      ],
                    });
                  }}
                >
                  <Plus size={24} weight="bold" />
                  <p className="text-base font-semibold">Add Track</p>
                </button>
              </div>
            </aside>
          </div>
        </div>
      </MainWrapper>
    </BaseWrapper>
  );
}

export default OrgMembersOnlyAndProtect(EditEvent);
