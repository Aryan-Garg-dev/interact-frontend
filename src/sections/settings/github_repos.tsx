import { SERVER_ERROR } from '@/config/errors';
import { USER_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import Toaster from '@/utils/toaster';
import ModalWrapper from '@/wrappers/modal';
import { ArrowUpRight } from '@phosphor-icons/react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface Props {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const GithubRepos = ({ setShow }: Props) => {
  const [repoLinks, setRepoLinks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRepos = async () => {
    const URL = `${USER_URL}/me/repos`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          setRepoLinks(res.data.repos);
          setLoading(false);
        } else {
          if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
          else Toaster.error(SERVER_ERROR, 'error_toaster');
        }
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      });
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  return (
    <ModalWrapper setShow={setShow} top={'1/2'}>
      {repoLinks && repoLinks.length > 0 ? (
        repoLinks.map((repoLink, index) => {
          const link = 'https://www.github.com/' + repoLink;
          const repo = repoLink.split('/')[1];
          return (
            <div key={index} className="w-full p-2 border-[1px] rounded-lg flex items-center justify-between">
              <div className="text-sm">{repo}</div>
              <Link href={link} target="_blank">
                <ArrowUpRight />
              </Link>
            </div>
          );
        })
      ) : (
        <div>No Repositories selected</div>
      )}
    </ModalWrapper>
  );
};

export default GithubRepos;
