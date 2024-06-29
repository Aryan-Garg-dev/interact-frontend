import { SERVER_ERROR } from '@/config/errors';
import { USER_URL } from '@/config/routes';
import postHandler from '@/handlers/post_handler';
import Toaster from '@/utils/toaster';
import { X } from '@phosphor-icons/react';
import React, { useEffect, useState } from 'react';

interface Props {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const Feedback = ({ setShow }: Props) => {
  const [type, setType] = useState(-1);
  const [content, setContent] = useState('');

  const [feedbackAdded, setFeedbackAdded] = useState(false);
  const [mutex, setMutex] = useState(false);

  useEffect(() => {
    if ((document.documentElement.style.overflowY = 'auto')) {
      document.documentElement.style.overflowY = 'hidden';
      document.documentElement.style.height = '100vh';

      return () => {
        document.documentElement.style.overflowY = 'auto';
        document.documentElement.style.height = 'auto';
      };
    }
  }, []);

  const handleSubmit = async () => {
    if (type == -1) {
      Toaster.error('Select a Feedback type!');
      return;
    }
    if (content.trim() == '') {
      Toaster.error('Message cannot be empty!');
      return;
    }
    if (mutex) return;
    setMutex(true);
    const toaster = Toaster.startLoad('Submitting your Feedback');
    const res = await postHandler(`${USER_URL}/feedback`, {
      content,
      type,
    });
    if (res.statusCode === 201) {
      Toaster.stopLoad(toaster, 'Feedback Submitted!', 1);
      setShow(false);
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
    setMutex(false);
  };

  const feedbackTypes = [
    'Bug Report',
    'Feature Request',
    'Improvement Ideas',
    'Performance Issue',
    'Usability Feedback',
    'Content Feedback',
    'Accessibility Feedback',
    'General Feedback',
  ];

  function uncheckCheckbox(id: string) {
    const checkbox = document.getElementById(id) as HTMLInputElement;
    if (checkbox) checkbox.checked = false;
  }

  const handleChange = (id: number) => {
    if (type == id) setType(-1);
    else {
      uncheckCheckbox(String(type));
      setType(id);
    }
  };

  return (
    <>
      <div className="fixed top-24 max-md:top-20 w-2/3 max-md:w-5/6 h-2/3 max-md:h-5/6 backdrop-blur-2xl bg-white dark:bg-[#ffe1fc22] flex flex-col gap-2 max-md:gap-0 rounded-lg p-8 dark:text-white font-primary overflow-y-auto border-[1px] border-primary_btn  dark:border-dark_primary_btn right-1/2 shadow-lg translate-x-1/2 animate-fade_third z-50">
        <div className="w-full flex justify-end">
          <X className="cursor-pointer" onClick={() => setShow(false)} size={32} />
        </div>
        <div className="w-full max-md:h-56 md:flex-1 flex flex-col justify-between gap-4">
          <div className="w-full flex flex-col gap-8">
            <div className="font-semibold text-6xl text-gray-800 dark:text-white capitalize">Help Us Improve!</div>

            <div className="w-full flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="font-medium text-sm">Choose a feedback type and help us decode your thoughts 🕵️‍♂️</div>
                {/* <div className="font-light text-xs">( user info is not stored )</div> */}
              </div>

              <div className="w-full grid grid-cols-4 max-md:grid-cols-1 gap-4">
                {feedbackTypes.map((feedback, i) => (
                  <div key={i} className="content flex items-center gap-1">
                    <div className="w-8">
                      <label className="checkBox !border-primary_black">
                        <input onClick={() => handleChange(i + 1)} id={String(i + 1)} type="checkbox" />
                        <div className="transition-ease-300 !bg-primary_black"></div>
                      </label>
                    </div>

                    <div className="text-sm w-[calc(100%-32px)] cursor-default">{feedback}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full flex flex-col gap-2">
              <div className="font-medium text-sm flex items-center gap-1">
                Tell Us More About It. <span className="text-gray-500 text-xs">({content.trim().length}/1000)</span>
              </div>
              <textarea
                className="border-[1px] border-primary_black rounded-lg p-2 max-h-36 min-h-[72px] focus:outline-none text-sm"
                placeholder="Type here"
                maxLength={1000}
                onChange={el => setContent(el.target.value)}
              ></textarea>
            </div>
          </div>
          <div
            onClick={handleSubmit}
            className="w-1/3 max-md:w-1/2 mx-auto text-center bg-primary_comp border-2 border-[#1f1f1f] dark:border-dark_primary_btn hover:text-white py-2 rounded-xl text-xl hover:bg-primary_black cursor-pointer transition-ease-200"
          >
            Confirm
          </div>
        </div>
      </div>
      <div
        onClick={() => setShow(false)}
        className="bg-backdrop w-screen h-screen fixed top-0 left-0 animate-fade_third z-30"
      ></div>
    </>
  );
};

export default Feedback;
