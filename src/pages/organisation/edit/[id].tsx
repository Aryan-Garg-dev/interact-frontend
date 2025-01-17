// import OrgSidebar from '@/components/common/org_sidebar';
// import { currentOrgSelector } from '@/slices/orgSlice';
// import OrgMembersOnlyAndProtect from '@/utils/wrappers/org_members_only';
// import BaseWrapper from '@/wrappers/base';
// import MainWrapper from '@/wrappers/main';
// import React, { Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { useRouter } from 'next/router';
// import { FloppyDisk, Link, Medal, PencilSimple, Plus, Trash, X } from '@phosphor-icons/react';
// import Image from 'next/image';
// import Input from '@/components/form/input';
// import {
//   EditableBox,
//   EditableFAQBox,
//   EditableSponsorBox,
//   EditableTrackBox,
//   AddTrackBox,
// } from '@/components/form/EditableFields';
// import { EVENT_PIC_URL, EXPLORE_URL, ORG_URL, USER_URL } from '@/config/routes';
// import getHandler from '@/handlers/get_handler';
// import Toaster from '@/utils/toaster';
// import { SERVER_ERROR } from '@/config/errors';
// import postHandler from '@/handlers/post_handler';
// import { Hackathon, HackathonRound } from '@/types';
// import { initialHackathon } from '@/types/initials';
// import { AddRoundForm } from '@/sections/organization/hackathons/AddRoundForm';

// const boxWrapperClass = 'w-full px-4 py-2 bg-[#E6E7EB70] relative rounded-md';

// interface ScoreMetricSchema {
//   name: string;
//   weightage: number;
// }

// interface RoundSchema {
//   startTime: string;
//   endTime: string;
//   judgingStartTime: string;
//   judgingEndTime: string;
//   metrics: ScoreMetricSchema[];
// }

// function EditEvent() {
//   const router = useRouter();
//   const { id } = router.query;
//   const [mutex, setMutex] = useState(false);
//   const [hackathon, setHackathon] = useState<Hackathon>(initialHackathon);
//   const [errorMessage, setErrorMessage] = useState<string>('');

//   const currentOrg = useSelector(currentOrgSelector);

//   const [round, setRound] = useState<RoundSchema>({
//     startTime: 'aa',
//     endTime: 'aa',
//     judgingStartTime: 'aa',
//     judgingEndTime: 'aa',
//     metrics: [],
//   });
//   const [newMetric, setNewMetric] = useState<ScoreMetricSchema>({ name: '', weightage: 0 });

// const getEvent = () => {
//   const URL = `${EXPLORE_URL}/events/${id}`;
//   getHandler(URL)
//     .then(res => {
//       if (res.statusCode === 200) {
//         setHackathon(res.data.event.hackathon);
//         console.log(res.data.event);
//       } else {
//         if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
//         else {
//           Toaster.error(SERVER_ERROR, 'error_toaster');
//         }
//       }
//     })
//     .catch(err => {
//       Toaster.error(SERVER_ERROR, 'error_toaster');
//     });
// };
// useEffect(() => {
//   if (id) {
//     getEvent();
//   }
// }, [id]);

// const handleCreateFAQ = async (data: { question: string; answer: string }) => {
//   if (mutex) return;
//   setMutex(true);
//   const toaster = Toaster.startLoad('Creating a FAQ...');
//   const res = await postHandler(
//     `${ORG_URL}/${currentOrg.id}/hackathons/10fb4b82-0e73-4956-a648-d0f66214bdb9/faq`,
//     data
//   );
//   if (res.statusCode === 201) {
//     const faq = res.data.faq;
//     Toaster.stopLoad(toaster, 'FAQ Added!', 1);
//     setHackathon({
//       ...hackathon,
//       faqs: [...(hackathon.faqs || []), faq],
//     });
//   } else {
//     if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
//     else Toaster.stopLoad(toaster, SERVER_ERROR, 0);
//   }
//   setMutex(false);
// };

// const handleAddSponsor = async (data: { name: string; link: string; title: string; description: string }) => {
//   if (mutex) return;
//   setMutex(true);
//   const toaster = Toaster.startLoad('Adding Sponsor...');
//   const res = await postHandler(
//     `${ORG_URL}/${currentOrg.id}/hackathons/10fb4b82-0e73-4956-a648-d0f66214bdb9/sponsor`,
//     data
//   );
//   if (res.statusCode === 201) {
//     Toaster.stopLoad(toaster, 'Sponsor Added!', 1);
//     const sponsor = res.data.sponsor;
//     setHackathon({
//       ...hackathon,
//       sponsors: [...hackathon.sponsors, sponsor],
//     });
//   } else {
//     if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
//     else Toaster.stopLoad(toaster, SERVER_ERROR, 0);
//   }
//   setMutex(false);
// };

// const handleAddTrack = async (data: { title: string; description: string }) => {
//   if (mutex) return;
//   setMutex(true);
//   const toaster = Toaster.startLoad('Adding Track...');
//   const res = await postHandler(`${ORG_URL}/${currentOrg.id}/hackathons/${hackathon.id}/track`, data);
//   if (res.statusCode === 201) {
//     Toaster.stopLoad(toaster, 'Track Added!', 1);
//     const track = res.data.track;
//     setHackathon({
//       ...hackathon,
//       tracks: [...hackathon.tracks, track],
//     });
//   } else {
//     if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
//     else Toaster.stopLoad(toaster, SERVER_ERROR, 0);
//   }
//   setMutex(false);
// };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setRound({ ...round, [name]: value });

//     if (name === 'startTime') {
//       const currentDate = new Date();
//       const selectedDate = new Date(value);
//       if (selectedDate < currentDate) {
//         setErrorMessage('Start time cannot be in the past');
//       } else {
//         setErrorMessage('');
//       }
//     }
//   };

//   const handleMetricChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setNewMetric({ ...newMetric, [e.target.name]: e.target.value });
//   };

//   const addMetric = () => {
//     setRound({ ...round, metrics: [...round.metrics, newMetric] });
//     setNewMetric({ name: '', weightage: 0 });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (mutex || errorMessage) return;
//     setMutex(true);

//     const toaster = Toaster.startLoad('Adding new round...');

//     try {
//       const res = await postHandler(`${ORG_URL}/${currentOrg.id}/hackathons/${hackathon.id}/round`, round);
//       if (res.statusCode === 201) {
//         Toaster.stopLoad(toaster, 'Round added successfully!', 1);
//         setHackathon({
//           ...hackathon,
//           rounds: [...(hackathon.rounds || []), res.data.round],
//         });
//         setRound({
//           startTime: '',
//           endTime: '',
//           judgingStartTime: '',
//           judgingEndTime: '',
//           metrics: [],
//         });
//       } else {
//         Toaster.stopLoad(toaster, res.data.message || SERVER_ERROR, 0);
//       }
//     } catch (error) {
//       Toaster.stopLoad(toaster, SERVER_ERROR, 0);
//     }

//     setMutex(false);
//   };

//   if (!id) {
//     return <div>Loading...</div>;
//   }
//   return (
//     <BaseWrapper title={`Events | ${currentOrg.title}`}>
//       <OrgSidebar index={12} />
//       <MainWrapper>
//         <div className="w-full flex flex-col items- pl-4 gap-4 max-md:px-2 p-base_padding  pb-12 ">
//           <div
//             className="w-full  h-40 bg-white border-[2px] border-[#dedede] rounded-xl "
//             style={{
//               background:
//                 'linear-gradient(-90deg,rgba(131, 58, 180, 1) 0%,rgba(253, 29, 29, 1) 50%,rgba(252, 176, 69, 1) 100%)',
//             }}
//           >
//             {!hackathon.coverPic && (
//               <section className="h-full w-full flex items-center justify-center gap-4">
//                 <span className="bg-white/10 text-black h-8 w-8 flex items-center justify-center rounded-lg">
//                   <Plus size={24} />
//                 </span>
//                 <p className="text-lg font-semibold text-white">Change Cover Image</p>
//               </section>
//             )}
//             {hackathon.coverPic && (
//               <Image
//                 src={`${EVENT_PIC_URL}/${hackathon.coverPic}`}
//                 alt=""
//                 width={1000}
//                 height={600}
//                 className="w-full h-full object-cover"
//               />
//             )}
//           </div>
//           <div className="w-full flex items-start justify-between gap-4">
//             <section className="--main-details w-[75%] h-full flex flex-col gap-2">
//               <div className="w-full flex items-center flex-wrap gap-2">
//                 {hackathon.tags &&
//                   hackathon.tags?.map((tag, index) => (
//                     <span
//                       className="bg-primary_text text-white rounded-full px-4 py-2 text-xs flex items-center gap-3"
//                       key={index}
//                     >
//                       <p>{tag}</p>
//                       <button
//                         className="bg-white rounded-full text-black p-[1px]  border-[1px] border-[#dedede]"
//                         onClick={() => {
//                           if (hackathon.tags) {
//                             setHackathon({
//                               ...hackathon,
//                               tags: hackathon.tags.filter((_, i) => i !== index),
//                             });
//                           }
//                         }}
//                       >
//                         <X size={10} />
//                       </button>
//                     </span>
//                   ))}
//                 <button className=" bg-[#dedede] p-2 text-sm w-fit flex gap-2 rounded-full items-center justify-center ">
//                   <Plus size={16} weight="bold" />
//                   <p className="font-semibold">Add Tag</p>
//                 </button>
//               </div>
//               <div className="w-full flex items-start gap-2 ">
//                 <div className="flex flex-col gap-2 w-full">
//                   <EditableBox
//                     val={hackathon}
//                     setVal={setHackathon}
//                     field="title"
//                     placeholder={hackathon.title}
//                     maxLength={100}
//                     className="text-4xl font-semibold"
//                   />
//                   <EditableBox
//                     val={hackathon}
//                     setVal={setHackathon}
//                     field="tagline"
//                     placeholder={hackathon.tagline || ''}
//                     className="text-2xl font-semibold"
//                   />
//                   <EditableBox
//                     val={hackathon}
//                     setVal={setHackathon}
//                     field="location"
//                     placeholder="Enter a location for hackathon"
//                     className="text-base font-semibold"
//                   />
//                 </div>
//                 <div className="w-1/5 h-40  bg-[#E6E7EB70] rounded-md"></div>
//               </div>

//               <EditableBox
//                 val={hackathon}
//                 setVal={setHackathon}
//                 field="description"
//                 placeholder="Enter a detailed description for the hackathon (max 1000 characters)"
//                 className="text-base font-semibold"
//                 maxLength={1000}
//               />
//               <div className="w-full flex items-start gap-2">
//                 <div className={boxWrapperClass}>
//                   <h1 className="text-xl font-semibold mb-2">Sponsors</h1>
//                   <div className="w-full grid grid-cols-3 gap-2">
//                     {hackathon.sponsors.map((sponsor, index) => (
//                       <EditableSponsorBox
//                         val={hackathon}
//                         sponsor={sponsor}
//                         index={index}
//                         key={index}
//                         setVal={setHackathon}
//                       />
//                     ))}
//                     <button
//                       className=" bg-white/20 p-2 rounded-lg w-full flex flex-col items-center justify-center "
//                       onClick={() => {
//                         handleAddSponsor({
//                           name: 'Sponsor Name',
//                           link: 'Sponsor Link',
//                           title: 'Sponsor Title',
//                           description: 'Sponsor Description',
//                         });
//                       }}
//                     >
//                       <Plus size={24} weight="bold" />
//                       <p className="text-base font-semibold">Add Sponsor</p>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//               <div className={`${boxWrapperClass}`}>
//                 <div className="w-full">
//                   <h1 className="text-xl font-semibold">Team Details</h1>
//                   <span className="flex items-center gap-2 w-full">
//                     <span className="flex items-center gap-1 w-1/2 relative">
//                       <EditableBox
//                         val={hackathon}
//                         setVal={setHackathon}
//                         field="minTeamSize"
//                         placeholder="MIN"
//                         className="text-base font-semibold"
//                       />
//                       <p className="absolute top-1/2 -translate-y-1/2 right-12 text-sm">Min. Members</p>
//                     </span>
//                     <span className="flex items-center gap-1 w-1/2 relative">
//                       <EditableBox
//                         val={hackathon}
//                         setVal={setHackathon}
//                         field="maxTeamSize"
//                         placeholder="MIN"
//                         className="text-base font-semibold"
//                       />
//                       <p className="absolute top-1/2 -translate-y-1/2 right-12 text-sm">Max. Members</p>
//                     </span>
//                   </span>
//                 </div>
//               </div>
//               <div className="w-full flex items-start gap-2">
//                 <div className={boxWrapperClass}>
//                   <h1 className="text-xl font-semibold mb-2">FAQs</h1>
//                   <div className="w-full grid grid-cols-3 gap-2">
//                     {hackathon.faqs?.map((faq, index) => (
//                       <EditableFAQBox val={hackathon} faq={faq} index={index} key={index} setVal={setHackathon} />
//                     ))}
//                     <button
//                       className=" bg-[#dedede] p-2 rounded-lg w-full flex flex-col items-center justify-center "
//                       onClick={() => {
//                         handleCreateFAQ({ question: 'Question New', answer: 'Answer New' });
//                       }}
//                     >
//                       <Plus size={24} weight="bold" />
//                       <p className="text-base font-semibold">Add FAQ</p>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </section>
//             <aside className="--tracks-details w-[25%] h-full">
//               <h1 className="text-2xl font-semibold">Tracks</h1>
//               <div className="flex flex-col gap-2 mt-2 max-h-[80vh] overflow-y-auto">
//                 {hackathon.tracks.map((track, index) => (
//                   <EditableTrackBox val={hackathon} track={track} index={index} key={index} setVal={setHackathon} />
//                 ))}
//                 <AddTrackBox val={hackathon} setVal={setHackathon} />
//               </div>
//             </aside>
//           </div>
//           <div className={boxWrapperClass}>
//             <h1 className="text-xl font-semibold mb-2">Add Round</h1>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
//                   Start Time
//                 </label>
//                 <input
//                   id="startTime"
//                   name="startTime"
//                   type="datetime-local"
//                   value={round.startTime}
//                   onChange={handleInputChange}
//                   required
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                 />
//                 {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
//               </div>
//               <div>
//                 <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
//                   End Time
//                 </label>
//                 <input
//                   id="endTime"
//                   name="endTime"
//                   type="datetime-local"
//                   value={round.endTime}
//                   onChange={handleInputChange}
//                   required
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="judgingStartTime" className="block text-sm font-medium text-gray-700">
//                   Judging Start Time
//                 </label>
//                 <input
//                   id="judgingStartTime"
//                   name="judgingStartTime"
//                   type="datetime-local"
//                   value={round.judgingStartTime}
//                   onChange={handleInputChange}
//                   required
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="judgingEndTime" className="block text-sm font-medium text-gray-700">
//                   Judging End Time
//                 </label>
//                 <input
//                   id="judgingEndTime"
//                   name="judgingEndTime"
//                   type="datetime-local"
//                   value={round.judgingEndTime}
//                   onChange={handleInputChange}
//                   required
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Metrics</label>
//                 {round.metrics.map((metric, index) => (
//                   <div key={index} className="flex items-center space-x-2 mt-2">
//                     <input
//                       value={metric.name}
//                       disabled
//                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-100"
//                     />
//                     <input
//                       value={metric.weightage}
//                       disabled
//                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-100"
//                     />
//                   </div>
//                 ))}
//                 <div className="flex items-center space-x-2 mt-2">
//                   <input
//                     name="name"
//                     placeholder="Metric name"
//                     value={newMetric.name}
//                     onChange={handleMetricChange}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                   />
//                   <input
//                     name="weightage"
//                     type="number"
//                     placeholder="Weightage"
//                     value={newMetric.weightage}
//                     onChange={handleMetricChange}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                   />
//                   <button
//                     type="button"
//                     onClick={addMetric}
//                     className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                   >
//                     Add Metric
//                   </button>
//                 </div>
//               </div>
//               <button
//                 type="submit"
//                 disabled={mutex}
//                 className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Add Round
//               </button>
//             </form>
//           </div>
//         </div>
//       </MainWrapper>
//     </BaseWrapper>
//   );
// }

// export default OrgMembersOnlyAndProtect(EditEvent);
import React, { useEffect, useState } from 'react';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import OrgSidebar from '@/components/common/org_sidebar';
import { Event, HackathonTrack, HackathonPrize, HackathonRound, HackathonSponsor, HackathonFAQ } from '@/types';
import { initialHackathon } from '@/types/initials';
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
import { Hackathon } from '@/types';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import getHandler from '@/handlers/get_handler';
import { EVENT_PIC_URL, EXPLORE_URL, USER_URL } from '@/config/routes';
import patchHandler from '@/handlers/patch_handler';
import deleteHandler from '@/handlers/delete_handler';
import { data } from 'autoprefixer';

interface Prize {
  title: string;
  amount: number;
  description: string;
  trackID?: string;
}
interface Props {
  id: string;
}
const EditHackathon: React.FC<Props> = ({ id }) => {
  const [mutex, setMutex] = useState(false);
  const [hackathon, setHackathon] = useState<Hackathon>(initialHackathon);
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
  const getEvent = () => {
    const URL = `${EXPLORE_URL}/events/7875cce4-0245-4ba6-98fe-408010e982b4`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          setHackathon(res.data.event.hackathon);
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

  const handleAddFAQ = async (data: { question: string; answer: string }) => {
    if (mutex) return;
    setMutex(true);
    const toaster = Toaster.startLoad('Adding FAQ...');
    const res = await postHandler(
      `${ORG_URL}/${currentOrg.id}/hackathons/10fb4b82-0e73-4956-a648-d0f66214bdb9/faq`,
      data
    );
    if (res.statusCode === 201) {
      Toaster.stopLoad(toaster, 'FAQ Added!', 1);
      const faq = res.data.faq;
      setHackathon({
        ...hackathon,
        faqs: [...hackathon.faqs, faq],
      });
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
    setMutex(false);
  };

  const handleEditFAQ = async (
    faqID: string,
    data: {
      question: string;
      answer: string;
    }
  ) => {
    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Updating FAQ...');
    const res = await patchHandler(`${ORG_URL}/${currentOrg.id}/hackathons/faq/${faqID}`, data);

    if (res.statusCode === 200) {
      Toaster.stopLoad(toaster, 'FAQ Updated!', 1);
      setHackathon({
        ...hackathon,
        faqs: hackathon.faqs.map(faq => (faq.id === faqID ? res.data.faq : faq)),
      });
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else Toaster.stopLoad(toaster, SERVER_ERROR, 0);
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

  const handleAddSponsor = async (data: { name: string; link: string; title: string; description: string }) => {
    if (mutex) return;
    setMutex(true);
    const toaster = Toaster.startLoad('Adding Sponsor...');
    const res = await postHandler(
      `${ORG_URL}/${currentOrg.id}/hackathons/10fb4b82-0e73-4956-a648-d0f66214bdb9/sponsor`,
      data
    );
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

  const handleEditSponsor = async (
    sponsorId: string,
    data: {
      name: string;
      description: string;
      image: string;
      website: string;
    }
  ) => {
    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Updating Sponsor...');
    const res = await patchHandler(`${ORG_URL}/${currentOrg.id}/hackathons/sponsor/${sponsorId}`, data);

    if (res.statusCode === 200) {
      Toaster.stopLoad(toaster, 'Sponsor Updated!', 1);
      setHackathon({
        ...hackathon,
        sponsors: hackathon.sponsors.map(sponsor => (sponsor.id === sponsorId ? res.data.sponsor : sponsor)),
      });
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else Toaster.stopLoad(toaster, SERVER_ERROR, 0);
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
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
    setMutex(false);
  };
  const handleAddRound = async (data: HackathonRound) => {
    if (mutex) return;
    setMutex(true);
    const toaster = Toaster.startLoad('Adding Round...');
    const res = await postHandler(`${ORG_URL}/${currentOrg.id}/hackathons/${hackathon.id}/round`, data);
    if (res.statusCode === 201) {
      Toaster.stopLoad(toaster, 'Round Added!', 1);
      const round = res.data.round;
      setHackathon({
        ...hackathon,
        rounds: [...hackathon.rounds, round],
      });
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
    setMutex(false);
  };

  const handleEditRound = async (roundId: string) => {
    if (mutex) return;
    setMutex(true);
    const toaster = Toaster.startLoad('Updating Round...');
    const res = await patchHandler(`${ORG_URL}/${currentOrg.id}/hackathons/round/${roundId}`, data);

    if (res.statusCode === 200) {
      Toaster.stopLoad(toaster, 'Round Updated!', 1);
      setHackathon(prevHackathon => ({
        ...prevHackathon,
        rounds: prevHackathon.rounds.map(round => (round.id === roundId ? { ...round, ...res.data.round } : round)),
      }));
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else Toaster.stopLoad(toaster, SERVER_ERROR, 0);
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
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
    setMutex(false);
  };

  const handleAddTrack = async (data: { title: string; description: string }) => {
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
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
    setMutex(false);
  };

  const handleEditTrack = async (trackId: string, data: { title: string; description: string }) => {
    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Updating Track...');
    const res = await patchHandler(`${ORG_URL}/${currentOrg.id}/hackathons/track/${trackId}`, data);

    if (res.statusCode === 200) {
      Toaster.stopLoad(toaster, 'Track Updated!', 1);
      setHackathon({
        ...hackathon,
        tracks: hackathon.tracks.map(track => (track.id === trackId ? res.data.track : track)),
      });
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else Toaster.stopLoad(toaster, SERVER_ERROR, 0);
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
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
    setMutex(false);
  };
  const handleAddPrize = async (data: { data: Prize }) => {
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
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
    setMutex(false);
  };
  const handleEditPrize = async (prizeId: string, data: HackathonPrize) => {
    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Updating Prize...');
    const res = await patchHandler(`${ORG_URL}/${currentOrg.id}/hackathons/prize/${prizeId}`, data);

    if (res.statusCode === 200) {
      Toaster.stopLoad(toaster, 'Prize Updated!', 1);
      setHackathon({
        ...hackathon,
        prizes: hackathon.prizes.map(prize => (prize.id === prizeId ? res.data.prize : prize)),
      });
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else Toaster.stopLoad(toaster, SERVER_ERROR, 0);
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
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
    setMutex(false);
  };
  const editHackathonField = async (field: string, value: any) => {
    if (mutex) return;
    setMutex(true);

    let data = { ...hackathon };

    if (field === 'tags') {
      data.tags = [...hackathon.tags, ...value]; // Append new tags to existing ones
    } else {
      data[field] = value;
    }

    const toaster = Toaster.startLoad(`Editing ${field}...`);
    const res = await patchHandler(
      `${ORG_URL}/${currentOrg.id}/hackathons/${hackathon.id}`,
      data,
      'multipart/form-data'
    );

    if (res.statusCode === 200) {
      Toaster.stopLoad(toaster, `${field.charAt(0).toUpperCase() + field.slice(1)} Edited!`, 1);
      setHackathon(data);
    } else {
      const message = res.data?.message || SERVER_ERROR;
      Toaster.stopLoad(toaster, message, 0);
    }

    setMutex(false);
  };

  const handleTitleChange = async (title: string) => {
    await editHackathonField('title', title);
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

  const handleStartTimeChange = async (startTime: Date) => {
    const date = new Date(startTime);
    const isoStartTime = date.toISOString();
    await editHackathonField('startTime', isoStartTime);
  };

  const handleEndTimeChange = async (endTime: any) => {
    const date = new Date(endTime);
    const isoEndTime = date.toISOString();
    await editHackathonField('endTime', isoEndTime);
  };

  const handleDescriptionChange = async (description: string) => {
    await editHackathonField('description', description);
  };

  const handleTagsChange = async (updatedTags: string[]) => {
    await editHackathonField('tags', updatedTags);
  };

  const handleDeleteTag = async (tagToDelete: string) => {
    const updatedTags = hackathon.tags.filter(tag => tag !== tagToDelete);
    await handleTagsChange(updatedTags);
  };

  const handleLinksChange = async (links: string[]) => {
    await editHackathonField('links', links);
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
            title={hackathon.title}
            setTitle={handleTitleChange}
            tagline={hackathon.tagline}
            setTagline={handleTaglineChange}
            location={hackathon.location}
            setLocation={handleLocationChange}
            startTime={hackathon.startTime}
            setStartTime={handleStartTimeChange}
            endTime={hackathon.endTime}
            setEndTime={handleEndTimeChange}
            description={hackathon.description}
            setDescription={handleDescriptionChange}
            tags={hackathon.tags}
            setTags={handleTagsChange}
            links={hackathon.links}
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
            setMinTeamSize={handleMinTeamSizeChange} // passing the handler
            maxTeamSize={hackathon.maxTeamSize}
            setMaxTeamSize={handleMaxTeamSizeChange} // passing the handler
            teamFormationStartTime={hackathon.teamFormationStartTime}
            setTeamFormationStartTime={handleTeamFormationStartTimeChange} // passing the handler
            teamFormationEndTime={hackathon.teamFormationEndTime}
            setTeamFormationEndTime={handleTeamFormationEndTimeChange} // passing the handler
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
            teamFormationEndTime={hackathon.teamFormationEndTime}
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

export default EditHackathon;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query;

  return {
    props: { id },
  };
}
