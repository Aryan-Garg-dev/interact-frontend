// BookmarkComponent.tsx
import React, { useState } from 'react';
import { Check } from '@phosphor-icons/react';
import Image from 'next/image';
import ConfirmDelete from '../common/confirm_delete';

export interface BookmarkConfig {
  itemsKey: string;
  itemIDKey: string;
  itemCountLabel: string;
  getImageSrc: (item: any) => string;
  getBlurDataURL?: (item: any) => string;
}

interface BookmarkProps<T> {
  bookmark: T;
  setClick: React.Dispatch<React.SetStateAction<boolean>>;
  setBookmark: React.Dispatch<React.SetStateAction<T>>;
  handleEdit: (bookmarkID: string, title: string) => Promise<number>;
  handleDelete: (bookmarkID: string) => Promise<void>;
  config: BookmarkConfig;
}

const BookmarkComponent = <T extends { id: string; title: string; [key: string]: any }>({
  bookmark,
  setClick,
  setBookmark,
  handleEdit,
  handleDelete,
  config,
}: BookmarkProps<T>) => {
  const [clickedOnSettings, setClickedOnSettings] = useState(false);
  const [clickedOnEdit, setClickedOnEdit] = useState(false);
  const [clickedOnDelete, setClickedOnDelete] = useState(false);

  const [title, setTitle] = useState(bookmark.title);
  const items = bookmark[config.itemsKey] || [];

  const handleSubmit = async (el: React.FormEvent<HTMLFormElement>) => {
    el.preventDefault();
    const status = await handleEdit(bookmark.id, title);
    if (status === 1) setClickedOnEdit(false);
  };

  return (
    <div className="w-96 h-108 max-md:w-80 max-md:h-[28rem] font-primary dark:text-white">
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
        {items.length === 0 ? (
          <div className="p-2">
            <div className="w-full h-[368px] max-md:h-[304px] bg-gray-300 dark:bg-[#c578bf63] rounded-md"></div>
          </div>
        ) : items.length === 1 ? (
          <div className="p-2">
            <Image
              crossOrigin="anonymous"
              className="w-full h-[368px] max-md:h-[304px] rounded-md object-cover"
              width={500}
              height={500}
              alt=""
              src={config.getImageSrc(items[0])}
              placeholder="blur"
              blurDataURL={config.getBlurDataURL ? config.getBlurDataURL(items[0]) : ''}
            />
          </div>
        ) : (
          <div className="w-full h-96 max-md:h-80 flex flex-wrap gap-2 p-2 items-center justify-center">
            {items.slice(0, 4).map((item: any) => (
              <Image
                key={item[config.itemIDKey]}
                crossOrigin="anonymous"
                className="w-[48%] h-[49%] object-cover rounded-md"
                width={500}
                height={500}
                alt=""
                src={config.getImageSrc(item)}
                placeholder="blur"
                blurDataURL={config.getBlurDataURL ? config.getBlurDataURL(item) : ''}
              />
            ))}
            {[...Array(4 - items.length)].map((_, index) => (
              <div key={index} className="w-[48%] h-[49%] bg-gray-300 dark:bg-[#c578bf63] rounded-md"></div>
            ))}
          </div>
        )}
      </div>
      <div className="w-full flex flex-col p-4">
        {clickedOnEdit ? (
          <form onSubmit={handleSubmit} className="w-full flex gap-2 items-center mb-2">
            <input
              value={title}
              onChange={el => setTitle(el.target.value)}
              className="w-full bg-transparent text-xl font-semibold border-[1px] p-2 rounded-md border-primary_btn dark:border-dark_primary_btn focus:outline-none"
            />
            <button type="submit">
              <Check className="cursor-pointer" size={32} />
            </button>
          </form>
        ) : (
          <div className="w-full text-3xl font-semibold">{bookmark.title}</div>
        )}
        <div>
          {items.length || 0} {config.itemCountLabel}
          {items.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
};

export default BookmarkComponent;
