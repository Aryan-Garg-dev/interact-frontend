import React from 'react';
import Image from 'next/image';
import { Profile, Organization } from '@/types';
import renderContentWithLinks from '@/utils/funcs/render_content_with_links';
import { Buildings, CalendarBlank, Certificate, Envelope, MapPin, Phone } from '@phosphor-icons/react';
import { USER_PROFILE_PIC_URL } from '@/config/routes';

interface Props {
  profile: Profile;
  org?: boolean;
  organizations: Organization[];
}

const About: React.FC<Props> = ({ profile, org = false, organizations }) => {
  const hasBasicInfo = profile.email || profile.phoneNo || profile.location;
  const hasEducation = profile.school || profile.degree;
  const hasOrganizations = organizations && organizations.length > 0;
  const hasDescription = profile.description;
  const hasCollaborationAreas = profile.areasOfCollaboration && profile.areasOfCollaboration.length > 0;
  const hasHobbies = profile.hobbies && profile.hobbies.length > 0;

  return (
    <div className="w-[640px] max-md:w-screen text-primary_black mx-auto flex flex-col gap-4 max-md:px-6 pb-8 animate-fade_third">
      {!org && (
        <>
          <div className="w-full flex flex-col gap-2">
            {profile.school && (
              <div className="w-full flex justify-between items-center flex-wrap gap-4">
                <div className="flex gap-2 items-center text-xl font-medium">
                  <Buildings weight="bold" size={24} />
                  <div>{profile.school}</div>
                </div>
                {profile.yearOfGraduation && (
                  <div className="flex gap-1 items-center">
                    <div>{profile.yearOfGraduation}</div>
                    <CalendarBlank weight="bold" size={20} />
                  </div>
                )}
              </div>
            )}
            {profile.degree && (
              <div className="flex gap-2 items-center text-lg">
                <Certificate weight="bold" size={24} />
                <div>{profile.degree}</div>
              </div>
            )}
            {hasOrganizations && (
              <div className="flex flex-col gap-2">
                <div className="text-sm font-medium">Member of:</div>
                <div className="flex flex-wrap gap-4">
                  {organizations.map((org, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Image
                        src={`${USER_PROFILE_PIC_URL}/${org.user.profilePic}`}
                        alt={org.title}
                        width={32} // Set the width of the image
                        height={32} // Set the height of the image
                        className="rounded-full"
                      />
                      <span>{org.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {(hasEducation || hasOrganizations) && (
            <div className="w-full h-[1px] border-t-[1px] border-gray-400 border-dashed"></div>
          )}
        </>
      )}
      <div className="w-full flex flex-col gap-2">
        <div className="w-full flex justify-between items-center flex-wrap gap-4">
          {profile.email && (
            <div className="flex gap-2 items-center text-xl font-medium">
              <Envelope weight="regular" size={24} />
              <div>{profile.email}</div>
            </div>
          )}
          {profile.phoneNo && (
            <div className="flex gap-2 items-center text-xl font-medium">
              <Phone weight="regular" size={24} />
              <div>{profile.phoneNo}</div>
            </div>
          )}
        </div>

        {!org && profile.location && (
          <div className="flex gap-2 items-center text-lg">
            <MapPin weight="regular" size={24} />
            <div>{profile.location}</div>
          </div>
        )}
      </div>
      {(hasBasicInfo || profile.location) && (
        <div className="w-full h-[1px] border-t-[1px] border-gray-400 border-dashed"></div>
      )}
      {hasDescription && (
        <>
          <div className="whitespace-pre-wrap">{renderContentWithLinks(profile.description)}</div>
          <div className="w-full h-[1px] border-t-[1px] border-gray-400 border-dashed"></div>
        </>
      )}
      {hasCollaborationAreas && (
        <>
          <div className="w-full flex flex-col gap-2">
            <div className="text-sm font-medium uppercase">
              {org ? 'Areas of Work' : 'Preferred Areas of Collaboration'}
            </div>
            <div className="w-full flex flex-wrap gap-4">
              {profile.areasOfCollaboration.map((el, i) => (
                <div key={i} className="border-gray-500 border-[1px] border-dashed p-2 text-sm rounded-lg flex-center">
                  {el}
                </div>
              ))}
            </div>
          </div>
          <div className="w-full h-[1px] border-t-[1px] border-gray-400 border-dashed"></div>
        </>
      )}
      {hasHobbies && (
        <div className="w-full flex flex-col gap-2">
          <div className="text-sm font-medium uppercase">{org ? 'Message Board' : 'Hobbies and Interests'}</div>
          <div className="w-full flex flex-wrap">
            {profile.hobbies.map((el, i) => (
              <div
                key={i}
                className="text-sm hover:bg-white p-3 py-2 rounded-lg cursor-default hover:scale-105 transition-ease-500"
              >
                {el}
              </div>
            ))}
          </div>
        </div>
      )}

      {!hasCollaborationAreas &&
        !hasHobbies &&
        !hasEducation &&
        !hasDescription &&
        !profile.email &&
        !profile.phoneNo &&
        !profile.location && (
          <div className="w-fit mx-auto font-medium text-xl">No Content Here</div>
        )}
    </div>
  );
};

export default About;
