import { userSelector } from '@/slices/userSlice';
import { IdentificationBadge } from '@phosphor-icons/react';
import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';

const Verify = () => {
  const user = useSelector(userSelector);
  return !user.isVerified ? (
    <div className="w-full flex justify-between">
      <div>
        <div className="flex-center gap-2 text-lg font-semibold">
          Verify Your Account <IdentificationBadge size={24} weight="duotone" />
        </div>
      </div>
      <Link
        href={'/verification'}
        className="bg-white h-fit flex-center text-sm font-medium px-3 py-1 rounded-xl border-[1px]"
      >
        Verify!
      </Link>
    </div>
  ) : (
    <></>
  );
};

export default Verify;
