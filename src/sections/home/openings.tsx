import Loader from '@/components/common/loader';
import OpeningCard from '@/components/explore/opening_card';
import { SERVER_ERROR } from '@/config/errors';
import { EXPLORE_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import { Opening } from '@/types';
import Toaster from '@/utils/toaster';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const Openings = () => {
  const [openings, setOpenings] = useState<Opening[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOpenings = async () => {
    const URL = `${EXPLORE_URL}/openings?limit=8&order=trending`;

    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      setOpenings(res.data.openings || []);
      setLoading(false);
    } else {
      if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
      else Toaster.error(SERVER_ERROR, 'error_toaster');
    }
  };

  useEffect(() => {
    fetchOpenings();
  }, []);

  return (
    <div className="w-full h-fit flex flex-col gap-6 max-md:hidden">
      {loading ? (
        <Loader />
      ) : (
        openings.length > 0 && (
          <div className="w-full h-fit flex flex-col gap-4 p-6 rounded-md text-primary_black font-primary border-gray-300 border-[1px] bg-white hover:shadow-lg transition-ease-500">
            <div className="w-full flex items-center justify-between">
              <div className="w-fit text-2xl font-semibold text-gradient">Trending Openings for You!</div>
              <Link
                href={'/explore?tab=openings'}
                className="w-fit text-xs font-medium hover-underline-animation after:bg-gray-700 cursor-pointer"
              >
                View More
              </Link>
            </div>
            <div className="w-full grid grid-cols-2 gap-2">
              {openings.map(opening => {
                return (
                  <Link key={opening.id} href={`/explore?tab=openings&oid=${opening.id}`}>
                    <OpeningCard
                      key={opening.id}
                      opening={opening}
                      org={opening?.organizationID != null}
                      short={true}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Openings;
