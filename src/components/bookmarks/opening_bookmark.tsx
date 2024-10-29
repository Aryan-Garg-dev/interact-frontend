import { USER_PROFILE_PIC_URL } from '@/config/routes';
import { OpeningBookmark } from '@/types';
import { Check } from '@phosphor-icons/react';
import Image from 'next/image';
import React, { useState } from 'react';
import ConfirmDelete from '../common/confirm_delete';
import { getProjectPicHash, getProjectPicURL } from '@/utils/funcs/safe_extract';

interface Props {
  bookmark: OpeningBookmark;
  setClick: React.Dispatch<React.SetStateAction<boolean>>;
  setBookmark: React.Dispatch<React.SetStateAction<OpeningBookmark>>;
  handleEdit: (bookmarkID: string, title: string) => Promise<number>;
  handleDelete: (bookmarkID: string) => Promise<void>;
}

const OpeningBookmarkComponent = ({ bookmark, setClick, setBookmark, handleEdit, handleDelete }: Props) => {
  let count = 0;
  const [clickedOnSettings, setClickedOnSettings] = useState(false);
  const [clickedOnEdit, setClickedOnEdit] = useState(false);
  const [clickedOnDelete, setClickedOnDelete] = useState(false);

  const [title, setTitle] = useState(bookmark.title);

  const handleSubmit = async (el: React.FormEvent<HTMLFormElement>) => {
    el.preventDefault();
    const status = await handleEdit(bookmark.id, title);
    if (status == 1) setClickedOnEdit(false);
  };
  return (
    <div className="w-96 max-md:w-80 max-md:h-[28rem] h-108 font-primary dark:text-white animate-fade_third">
      {clickedOnDelete && (
        <ConfirmDelete
          setShow={setClickedOnDelete}
          handleDelete={async () => {
            await handleDelete(bookmark.id);
            setClickedOnDelete(false);
          }}
        />
      )}
      <div
        onClick={() => {
          setBookmark(bookmark);
          setClick(true);
        }}
        className="group relative cursor-pointer"
      >
        <div className="w-full h-full absolute p-2 top-2 left-2 hidden group-hover:flex gap-4 animate-fade_third z-20 rounded-lg cursor-pointer">
          <div
            onClick={el => {
              el.stopPropagation();
              setClickedOnSettings(prev => !prev);
            }}
            className="h-8 w-8 flex-center glassMorphism rounded-full dark:text-white p-1"
          >
            •••
          </div>
          {clickedOnSettings && (
            <div className="w-1/2 h-fit rounded-2xl glassMorphism dark:text-white p-2">
              <div
                onClick={el => {
                  el.stopPropagation();
                  setClickedOnEdit(prev => !prev);
                  setClickedOnSettings(false);
                }}
                className="w-full px-4 py-3 hover:bg-[#ffffff] dark:hover:bg-[#ffffff19] transition-ease-100 rounded-lg"
              >
                {clickedOnEdit ? 'Cancel' : 'Edit'}
              </div>
              <div
                onClick={el => {
                  el.stopPropagation();
                  setClickedOnDelete(true);
                }}
                className="w-full px-4 py-3 hover:bg-[#ffffff] dark:hover:bg-[#ffffff19] transition-ease-100 rounded-lg"
              >
                Delete
              </div>
            </div>
          )}
        </div>
        <div className="w-full h-full rounded-lg text-sm text-white absolute top-0 left-0 bg-white bg-opacity-50 opacity-0 group-hover:opacity-100 transition-ease-300"></div>
        {bookmark.openingItems &&
          (bookmark.openingItems.length == 0 ? (
            <div className="p-2">
              <div className="w-full h-[368px] max-md:h-[304px] bg-gray-300 dark:bg-[#c578bf63] rounded-md"></div>
            </div>
          ) : bookmark.openingItems.length == 1 ? (
            bookmark.openingItems[0].opening.project?.images ? (
              <div className="p-2">
                <Image
                  crossOrigin="anonymous"
                  className="w-full h-[368px] max-md:h-[304px] rounded-md object-cover"
                  width={500}
                  height={500}
                  alt=""
                  src={getProjectPicURL(bookmark.openingItems[0].opening?.project)}
                  placeholder="blur"
                  blurDataURL={getProjectPicHash(bookmark.openingItems[0].opening?.project)}
                />
              </div>
            ) : bookmark.openingItems[0].opening.organization?.user.profilePic ? (
              <div className="p-2">
                <Image
                  crossOrigin="anonymous"
                  className="w-full h-[368px] max-md:h-[304px] rounded-md object-cover"
                  width={500}
                  height={500}
                  alt=""
                  src={`${USER_PROFILE_PIC_URL}/${bookmark.openingItems[0].opening.organization?.user.profilePic}`}
                  placeholder="blur"
                  blurDataURL={bookmark.openingItems[0].opening.organization?.user.profilePicBlurHash || 'no-hash'}
                />
              </div>
            ) : (
              <div className="p-2">
                <div className="w-full h-96 max-md:h-80 bg-gray-300 dark:bg-[#c578bf63] rounded-md"></div>
              </div>
            )
          ) : (
            <div className="w-full h-96 max-md:h-80 flex flex-wrap gap-2 p-2 items-center justify-center">
              {bookmark.openingItems.map(openingItem => {
                if (
                  count >= 4 ||
                  (!openingItem.opening.project?.images && !openingItem.opening.organization?.user.profilePic)
                ) {
                  return <></>;
                }
                count++;
                return openingItem.opening.project?.images ? (
                  <Image
                    key={openingItem.openingID}
                    crossOrigin="anonymous"
                    className="w-[48%] h-[49%] object-cover rounded-md"
                    width={500}
                    height={500}
                    alt=""
                    src={getProjectPicURL(openingItem.opening.project)}
                    placeholder="blur"
                    blurDataURL={getProjectPicHash(openingItem.opening.project)}
                  />
                ) : (
                  <Image
                    key={openingItem.openingID}
                    crossOrigin="anonymous"
                    className="w-[48%] h-[49%] object-cover rounded-md"
                    width={500}
                    height={500}
                    alt=""
                    src={`${USER_PROFILE_PIC_URL}/${openingItem.opening.organization?.user.profilePic}`}
                    placeholder="blur"
                    blurDataURL={openingItem.opening.organization?.user.profilePicBlurHash || 'no-hash'}
                  />
                );
              })}
              {[...Array(4 - count)].map((_, index) => (
                <div key={index} className="w-[48%] h-[49%] bg-gray-300 dark:bg-[#c578bf63] rounded-md"></div>
              ))}
            </div>
          ))}
      </div>
      <div className="w-full flex flex-col p-4">
        {clickedOnEdit ? (
          <form onSubmit={handleSubmit} className="w-full flex gap-2 items-center mb-2">
            <input
              value={title}
              onChange={el => setTitle(el.target.value)}
              className="w-full bg-transparent text-xl font-semibold border-[1px] p-2 rounded-md border-primary_btn  dark:border-dark_primary_btn focus:outline-none"
            />
            <button type="submit">
              <Check className="cursor-pointer" size={32} />
            </button>
          </form>
        ) : (
          <div className="w-full text-3xl font-semibold">{bookmark.title}</div>
        )}
        <div>
          {bookmark.openingItems.length || 0} Opening{bookmark.openingItems.length != 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
};

export default OpeningBookmarkComponent;
