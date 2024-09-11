import React, { useEffect, useState } from 'react';
import getHandler from '@/handlers/get_handler';
import Image from 'next/image';
import Toaster from '@/utils/toaster';
import { SERVER_ERROR } from '@/config/errors';

interface HackathonProps {
  hackathonID: string;
}

interface UserProfile {
  id: string;
  name: string;
  username: string;
  profilePic: string;
  profilePicBlurHash: string;
  coverPic: string;
  coverPicBlurHash: string;
  bio: string;
  title: string;
  tagline: string;
  tags: string[] | null;
  links: string[] | null;
  topics: string[] | null;
  githubUsername: string;
  noFollowing: number;
  noFollowers: number;
  totalNoViews: number;
  noImpressions: number;
  noImpressionsUntilLastMonth: number;
  noProjects: number;
  noCollaborativeProjects: number;
  isVerified: boolean;
  isOnboardingComplete: boolean;
  isOrganization: boolean;
  profile: {
    id: string;
    userID: string;
    school: string;
    degree: string;
    yearOfGraduation: number;
    description: string;
    areasOfCollaboration: string[] | null;
    hobbies: string[] | null;
    email: string;
    phoneNo: string;
    location: string;
    achievements: string[] | null;
  };
  projects: string[] | null;
  posts: string[] | null;
  memberships: string[] | null;
  applications: string[] | null;
  postBookmarks: string[] | null;
  projectBookmarks: string[] | null;
  openingBookmarks: string[] | null;
  eventBookmarks: string[] | null;
  notifications: string[] | null;
  lastViewedProjects: string[] | null;
  lastViewedOpenings: string[] | null;
}

interface Organization {
  id: string;
  userID: string;
  user: UserProfile;
  title: string;
  memberships: string[] | null;
  invitations: string[] | null;
  teams: string[] | null;
  history: string[] | null;
  events: string[] | null;
  noMembers: number;
  noEvents: number;
  noProjects: number;
  createdAt: string;
}

interface Meeting {
  id: string;
  dyteID: string;
  title: string;
  description: string;
  tags: string[] | null;
  startTime: string;
  endTime: string;
  frequency: string;
  day: string;
  date: number;
  isOnline: boolean;
  isOpenForMembers: boolean;
  isLive: boolean;
  allowExternalParticipants: boolean;
  organizationID: string | null;
  organization: Organization;
  eventID: string | null;
  applicationID: string | null;
  userID: string;
  user: UserProfile;
  participants: string[] | null;
  rsvp: string[] | null;
  noParticipants: number;
  nextSessionTime: string;
  createdAt: string;
}

interface Sponsor {
  id: string;
  hackathonID: string;
  name: string;
  title: string;
  coverPic: string;
  description: string;
  link: string;
}

interface HackathonMetric {
  hackathonRoundID: string;
  id: string;
  title: string;
  description: string;
  type: string;
  options: string[];
}

interface HackathonRound {
  id: string;
  hackathonID: string;
  title: string;
  index: number;
  isIdeation: boolean;
  startTime: string;
  endTime: string;
  judgingStartTime: string;
  judgingEndTime: string;
  metrics: HackathonMetric[];
}

interface Hackathon {
  id: string;
  title: string;
  tagline: string;
  coverPic: string;
  blurHash: string;
  description: string;
  links: string[];
  tags: string[];
  noViews: number;
  noLikes: number;
  noShares: number;
  noComments: number;
  startTime: string;
  endTime: string;
  location: string;
  category: string;
  noImpressions: number;
  organizationID: string;
  organization: Organization;
  meetingID: string | null;
  meeting: Meeting;
  hackathonID: string;
  hackathon: {
    id: string;
    organizationID: string;
    organization: Organization;
    title: string;
    tagline: string;
    coverPic: string;
    blurHash: string;
    description: string;
    tags: string[] | null;
    links: string[] | null;
    startTime: string;
    endTime: string;
    isEnded: boolean;
    location: string;
    minTeamSize: number;
    maxTeamSize: number;
    teamFormationStartTime: string;
    teamFormationEndTime: string;
    createdAt: string;
    noParticipants: number;
    participants: string[] | null;
    coordinators: string[] | null;
    judges: string[] | null;
    eventID: string | null;
    history: string[] | null;
  };
  rounds: HackathonRound[];
  sponsors: Sponsor[];
  createdAt: string;
  coordinators: string[] | null;
  comments: string[] | null;
  coHosts: string[] | null;
}

interface FormatDate {
  (date: string): string;
}

const ProgressBar: React.FC<{ hackathon: Hackathon }> = ({ hackathon }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculateProgress = () => {
      const startTime = new Date(hackathon.startTime).getTime();
      const endTime = new Date(hackathon.endTime).getTime();
      const currentTime = new Date().getTime();

      if (currentTime < startTime) {
        setProgress(0);
      } else if (currentTime > endTime) {
        setProgress(100);
      } else {
        const totalDuration = endTime - startTime;
        const elapsedTime = currentTime - startTime;
        const progressPercentage = (elapsedTime / totalDuration) * 100;
        setProgress(progressPercentage);
      }
    };

    calculateProgress();
    const interval = setInterval(calculateProgress, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [hackathon]);

  return (
    <div className="w-full rounded-full h-3 my-4 bg-gray-300">
      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${progress}%` }}></div>
    </div>
  );
};

const formatDate: FormatDate = date => {
  const newDate = new Date(date);
  const day = newDate.getDate();
  const month = newDate.toLocaleString('default', { month: 'short' }).toUpperCase();
  const year = newDate.getFullYear();

  const daySuffix = (day: number): string => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  return `${day}${daySuffix(day)} ${month}`;
};

const Hackathon: React.FC<HackathonProps> = ({ hackathonID }) => {
  const [mockHackathon, setHackathon] = useState<Hackathon>();
  const [loading, setLoading] = useState(true);

  const fetchHackathon = () => {
    const URL = `/hackathons/${hackathonID}/participants`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          setHackathon(res.data.hackathon);
          setLoading(false);
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
    fetchHackathon();
  }, []);

  return (
    <>
      {mockHackathon && (
        <div className="flex items-start justify-start p-8 flex-col">
          <div className="relative w-full h-96">
            <Image
              src={`/${mockHackathon.coverPic}`}
              alt={mockHackathon.title}
              fill
              className="object-cover rounded-xl"
            />
          </div>
          <div className="flex flex-col lg:flex-row justify-center items-center md:justify-start md:items-start w-full">
            <div className="flex justify-center items-center lg:justify-start lg:items-start mx-4 flex-col w-full lg:w-[75%]">
              <div className="flex justify-center items-start py-8 flex-col w-full">
                <div className="flex flex-col lg:flex-row justify-center items-center lg:justify-between lg:items-end w-full">
                  <div className="flex flex-col items-start justify-center mb-4 lg:mb-0">
                    <h1 className="text-5xl font-primary font-bold">{mockHackathon.title}</h1>
                    <h3 className="text-3xl py-2 lg:py-4 font-semibold">{mockHackathon.tagline}</h3>
                  </div>
                  <div className="hidden lg:block lg:w-[16%]"></div>
                  <div className="flex flex-col lg:flex-row justify-center items-center lg:justify-end lg:items-end mt-4 lg:mt-0">
                    <div className="flex justify-center lg:justify-end items-center lg:items-end mb-4 lg:mb-0">
                      <button className="bg-[#4B9EFF] px-6 lg:px-10 py-2 lg:py-3 text-white font-bold text-lg lg:text-xl rounded-full mx-2 lg:mx-4 lg:ml-8 my-2 lg:my-4">
                        Dashboard
                      </button>
                    </div>
                    <div className="w-px h-16 lg:h-24 my-2 lg:my-4 bg-black mx-4 lg:mx-8 border border-black hidden lg:block"></div>
                    <div className="flex flex-col items-center">
                      <div className="text-center mb-2 lg:mb-4">
                        <p className="font-primary font-bold text-lg lg:text-xl">
                          {formatDate(mockHackathon.startTime)} - {formatDate(mockHackathon.endTime)}
                        </p>
                      </div>
                      <div className="text-center">
                        {mockHackathon.links && mockHackathon.links[0] && (
                          <a href={mockHackathon.links[0]} target="_blank" rel="noopener noreferrer">
                            <button className="px-6 lg:px-10 py-2 lg:py-3 bg-[#306CB1] text-white font-bold text-lg lg:text-xl rounded-full mx-2 lg:mx-4 mb-2 lg:mb-4">
                              Visit Site
                            </button>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-2xl mt-4">{mockHackathon.description}</p>
                <div className="mt-6 flex flex-col lg:flex-row justify-center items-center">
                  <div>
                    {mockHackathon.sponsors.map((sponsor, index) => (
                      <div key={index} className="flex items-start p-4">
                        <div className="w-24 h-24 relative mr-4">
                          <Image
                            src={`/${sponsor.coverPic}`}
                            alt={sponsor.name}
                            layout="fill"
                            className="object-cover rounded-full"
                          />
                        </div>
                        <div className="flex justify-center items-start flex-col mt-4">
                          <h3 className="text-3xl font-bold font-primary">{sponsor.name}</h3>
                          <p className="text-lg">{sponsor.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="w-[5px] rounded-full h-64 my-4 bg-black mx-12 border border-black hidden lg:block"></div>
                  <div className="flex flex-row items-center mt-8 space-x-12">
                    {mockHackathon.rounds.map((round, index) => (
                      <div key={index} className="flex flex-col items-center mb-8">
                        <div className="relative flex flex-col items-center mb-4">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                            {index + 1}
                          </div>
                          {index < mockHackathon.rounds.length && (
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-px h-16 bg-gray-300"></div>
                          )}
                        </div>
                        <div className="flex flex-col items-center w-48 p-4 border rounded shadow-lg">
                          {round.title && <h3 className="text-lg font-semibold font-primary">{round.title}</h3>}
                          <p className="font-primary mt-4">{formatDate(round.startTime)}</p>
                          <p className="font-primary">{new Date(round.startTime).toLocaleTimeString()}</p>
                          <p className="font-primary my-4">to</p>
                          <p className="font-primary">{formatDate(round.endTime)}</p>
                          <p className="font-primary">{new Date(round.endTime).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-[25%] ml-0 lg:ml-12 mt-4">
              <h1 className="text-4xl font-bold mb-4">Progress</h1>
              <ProgressBar hackathon={mockHackathon} />
              <p className="my-4 text-xl">
                Progress {formatDate(mockHackathon.startTime)} - {formatDate(mockHackathon.endTime)}
              </p>
              <div className="bg-[#DFDFDF] p-8 md:mt-12">
                <Image src={`/${mockHackathon.organization.user.coverPic}`} alt="Progress" width={450} height={250} />
                <h3 className="text-3xl font-bold my-4">{mockHackathon.organization.title}</h3>
                <p className="text-xl mt-2">{mockHackathon.organization.user.bio}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Hackathon;
