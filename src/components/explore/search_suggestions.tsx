import React, { useEffect, useRef, useState } from 'react';
import getHandler from '@/handlers/get_handler';
import Link from 'next/link';
import Toaster from '@/utils/toaster';
import { SERVER_ERROR } from '@/config/errors';
import { EXPLORE_URL } from '@/config/routes';
import { ChartLineUp, X } from '@phosphor-icons/react';

interface Props {
  search: string;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchSuggestions = ({ search, setShow }: Props) => {
  const [searches, setSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  let oldAbortController: AbortController | null = null;

  useEffect(() => {
    const abortController = new AbortController();
    if (oldAbortController) oldAbortController.abort();
    oldAbortController = abortController;
    fetchSearches(abortController);

    return () => {
      abortController.abort();
    };
  }, [search]);

  const fetchSearches = (abortController: AbortController) => {
    const URL = `${EXPLORE_URL}/trending_searches?limit=10${search != '' && '&search=' + search}`;
    getHandler(URL, abortController.signal)
      .then(res => {
        if (res.statusCode === 200) {
          setSearches(res.data.searches || []);
          // setSearches(res.data.searches || []);
          setLoading(false);
        } else if (res.status != -1) {
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

  const menuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setShow(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return !loading && searches.length > 0 ? (
    <div
      ref={menuRef}
      className="w-[640px] bg-white dark:bg-transparent backdrop-blur-lg shadow-xl dark:border-dark_primary_btn dark:border-[1px] dark:text-white fixed top-20 right-1/2 translate-x-1/2 max-md:top-14 flex flex-col gap-6 z-[52] rounded-md p-4"
    >
      <div className="w-full flex items-center justify-between">
        <div className="text-4xl max-md:text-3xl font-bold ">{search == '' ? 'Trending Searches' : 'Suggestions'}</div>
        <X onClick={() => setShow(false)} className="cursor-pointer max-md:w-6 max-md:h-6" size={32} />
      </div>
      <div className="w-full flex flex-wrap gap-2 text-lg">
        {searches.map((str, i) => {
          return (
            <Link
              href={`/explore?search=${str}`}
              key={i}
              onClick={() => {
                search = str;
                // setSearch(str);
                setShow(false);
              }}
              className="w-fit flex items-center gap-2 bg-slate-100 dark:bg-[#ff9bff39] dark:border-dark_primary_btn dark:border-[1px] rounded-lg px-4 py-1"
            >
              <div>{str}</div>
              {i < 3 && <ChartLineUp />}
            </Link>
          );
        })}
      </div>
    </div>
  ) : (
    <></>
  );
};

export default SearchSuggestions;
