import React, { useEffect, useState } from 'react';
import getHandler from '@/handlers/get_handler';
import Image from 'next/image';
import Toaster from '@/utils/toaster';
import { EVENT_PIC_URL, EXPLORE_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import { SERVER_ERROR } from '@/config/errors';
import type { Hackathon } from '@/types';
import { formatDate } from '@/utils/funcs/get_formatted_time';
import Loader from '@/components/common/loader';

interface HackathonProps {
  hackathonID: string;
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

const Hackathon: React.FC<HackathonProps> = ({ hackathonID }) => {
  const [hackathon, setHackathon] = useState<Hackathon>();
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
    setLoading(false);
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        hackathon && (
          <div className="flex items-start justify-start p-8 flex-col">
            <div className="relative w-full h-96">
              <Image
                src={`${EVENT_PIC_URL}/${hackathon.coverPic}`}
                alt={hackathon.title}
                fill
                className="object-cover rounded-xl"
              />
            </div>
            <div className="flex flex-col lg:flex-row justify-center items-center md:justify-start md:items-start w-full">
              <div className="flex justify-center items-center lg:justify-start lg:items-start mx-4 flex-col w-full lg:w-[75%]">
                <div className="flex justify-center items-start py-8 flex-col w-full">
                  <div className="flex flex-col lg:flex-row justify-center items-center lg:justify-between lg:items-end w-full">
                    <div className="flex flex-col items-start justify-center mb-4 lg:mb-0">
                      <h1 className="text-5xl font-primary font-bold">{hackathon.title}</h1>
                      <h3 className="text-3xl py-2 lg:py-4 font-semibold">{hackathon.tagline}</h3>
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
                            {formatDate(hackathon.startTime)} - {formatDate(hackathon.endTime)}
                          </p>
                        </div>
                        <div className="text-center">
                          {hackathon.links && hackathon.links[0] && (
                            <a href={hackathon.links[0]} target="_blank" rel="noopener noreferrer">
                              <button className="px-6 lg:px-10 py-2 lg:py-3 bg-[#306CB1] text-white font-bold text-lg lg:text-xl rounded-full mx-2 lg:mx-4 mb-2 lg:mb-4">
                                Visit Site
                              </button>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-2xl mt-4">{hackathon.description}</p>
                  <div className="mt-6 flex flex-col lg:flex-row justify-center items-center">
                    <div>
                      {hackathon.sponsors.map((sponsor, index) => (
                        <div key={index} className="flex items-start p-4">
                          {/* <div className="w-24 h-24 relative mr-4">
                            <Image
                              src={`/${sponsor.coverPic}`}
                              alt={sponsor.name}
                              layout="fill"
                              className="object-cover rounded-full"
                            />
                          </div> */}
                          <div className="flex justify-center items-start flex-col mt-4">
                            <h3 className="text-3xl font-bold font-primary">{sponsor.name}</h3>
                            <p className="text-lg">{sponsor.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="w-[5px] rounded-full h-64 my-4 bg-black mx-12 border border-black hidden lg:block"></div>
                    <div className="flex flex-row items-center mt-8 space-x-12">
                      {hackathon.rounds.map((round, index) => (
                        <div key={index} className="flex flex-col items-center mb-8">
                          <div className="relative flex flex-col items-center mb-4">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                              {index + 1}
                            </div>
                            {index < hackathon.rounds.length && (
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
                  <div className="w-full mt-8">
                    <h2 className="text-4xl font-bold font-primary mb-6 text-center">Tracks</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {hackathon.tracks.map((track, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                          <h3 className="text-2xl font-bold font-primary mb-4">{track.title}</h3>
                          <p className="text-lg text-gray-700">{track.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-[25%] ml-0 lg:ml-12 mt-4">
                <h1 className="text-4xl font-bold mb-4">Progress</h1>
                <ProgressBar hackathon={hackathon} />
                <p className="my-4 text-xl">
                  Progress {formatDate(hackathon.startTime)} - {formatDate(hackathon.endTime)}
                </p>
                <div className="bg-[#DFDFDF] p-8 md:mt-12">
                  <Image
                    src={`${USER_PROFILE_PIC_URL}/${hackathon.organization.user.coverPic}`}
                    alt="Progress"
                    width={450}
                    height={250}
                  />
                  <h3 className="text-3xl font-bold my-4">{hackathon.organization.title}</h3>
                  <p className="text-xl mt-2">{hackathon.organization.user.bio}</p>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default Hackathon;
