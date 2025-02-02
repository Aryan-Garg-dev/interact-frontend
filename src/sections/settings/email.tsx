import type React from 'react';
import { useState } from 'react';
import { userSelector } from '@/slices/userSlice';
import patchHandler from '@/handlers/patch_handler';
import postHandler from '@/handlers/post_handler';
import { Plus } from '@phosphor-icons/react';
import Toaster from '@/utils/toaster';
import { useDispatch, useSelector } from 'react-redux';
import { ALREADY_VERIFIED_ERROR, SERVER_ERROR } from '@/config/errors';

const Email = () => {
  const [clickedOnChange, setClickedOnChange] = useState(false);
  const user = useSelector(userSelector);
  const dispatch = useDispatch();
  const [secondaryEmail, setSecondaryEmail] = useState(user.secondaryEmail);
  const [otp, setOTP] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSecondaryEmailInput, setShowSecondaryEmailInput] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(true);
  const [newEmail, setNewEmail] = useState(user.email);

  const handleEmailSubmit = async (email: string) => {
    const toaster = Toaster.startLoad('Sending OTP');
    const URL = `/verification/secondary_email`;
    const res = await postHandler(URL, { email });
    if (res.statusCode === 200) {
      Toaster.stopLoad(toaster, 'OTP sent to your email', 1);
      setShowEmailInput(false);
    } else {
      if (res.data.message === ALREADY_VERIFIED_ERROR) {
        Toaster.stopLoad(toaster, 'Email already verified', 0);
        return;
      }
      Toaster.stopLoad(toaster, 'Failed to send OTP', 0);
    }
  };

  const handleOTPSubmit = async () => {
    if (otp.length !== 6) {
      Toaster.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    const toaster = Toaster.startLoad('Verifying OTP...');
    const res = await patchHandler('/verification/secondary_email', {
      email: secondaryEmail,
      otp: otp,
    });
    if (res.statusCode === 200) {
      Toaster.stopLoad(toaster, 'Email verified', 1);
      setShowEmailInput(true);
      setShowSecondaryEmailInput(false);
      setOTP('');
      setSecondaryEmail(secondaryEmail);
      user.secondaryEmail = secondaryEmail;
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else {
        Toaster.stopLoad(toaster, SERVER_ERROR, 0);
      }
    }
    setIsLoading(false);
  };

  const handleSubmit = () => {};

  return (
    <div className="w-full flex justify-between flex-col space-y-4">
      <div className="w-full">
        <div className="text-lg font-semibold">Your email address</div>
        {clickedOnChange ? (
          <div className="w-full flex-center gap-4 items-center">
            <input
              value={newEmail}
              onChange={el => setNewEmail(el.target.value)}
              type="email"
              className="w-full bg-white focus:outline-none rounded-lg p-2"
            />
            <div className="w-fit h-fit flex text-sm justify-end gap-2">
              <div
                onClick={() => {
                  setNewEmail(user.email);
                  setClickedOnChange(false);
                }}
                className="h-fit border-[1px] border-primary_black flex-center rounded-full w-20 p-1 cursor-pointer"
              >
                Cancel
              </div>
              {newEmail == user.email ? (
                <div className="h-fit bg-primary_black bg-opacity-50 text-white flex-center rounded-full w-16 p-1 cursor-default">
                  Save
                </div>
              ) : (
                <div
                  onClick={handleSubmit}
                  className="h-fit bg-primary_black text-white flex-center rounded-full w-16 p-1 cursor-pointer"
                >
                  Save
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>{user.email}</div>
        )}
      </div>
      {!user.isOrganization && (
        <div>
          {showSecondaryEmailInput ? (
            <div className="w-full flex flex-row gap-2">
              {showEmailInput ? (
                <>
                  <input
                    value={secondaryEmail}
                    onChange={e => setSecondaryEmail(e.target.value)}
                    placeholder="Secondary Email"
                    type="email"
                    className="w-full text-lg bg-white dark:bg-dark_primary_comp focus:outline-none rounded-lg p-2"
                  />
                  <button
                    onClick={() => handleEmailSubmit(secondaryEmail)}
                    disabled={isLoading || !secondaryEmail}
                    className={`bg-primary_black text-white text-md w-36 rounded-lg p-2 ${
                      isLoading || !secondaryEmail ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    Send OTP
                  </button>
                </>
              ) : (
                <>
                  <div className="flex flex-col space-y-4 w-full">
                    <div className="text-gray-500 mb-2">
                      OTP sent to {secondaryEmail}
                      <span
                        onClick={() => setShowEmailInput(true)}
                        className="text-primary_btn dark:text-dark_primary_btn ml-2 cursor-pointer"
                      >
                        Change
                      </span>
                    </div>
                    <div className="flex flex-row justify-between w-full gap-2">
                      <input
                        value={otp}
                        onChange={e => {
                          const val = e.target.value;
                          if (val === '' || (/^\d+$/.test(val) && val.length <= 6)) {
                            setOTP(val);
                          }
                        }}
                        placeholder="Enter 6-digit OTP"
                        type="text"
                        maxLength={6}
                        className="w-full text-lg bg-white dark:bg-dark_primary_comp focus:outline-none rounded-lg p-2"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={handleOTPSubmit}
                          disabled={isLoading || otp.length !== 6}
                          className={`bg-primary_black text-white text-md w-36 rounded-lg p-2 ${
                            isLoading || otp.length !== 6 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                          }`}
                        >
                          Verify OTP
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-row items-center text-primary_btn dark:text-dark_primary_btn">
              {user.secondaryEmail ? (
                <div className="text-white w-full text-xl flex flex-row justify-between items-center">
                  <div className="flex flex-col">
                    <div>Secondary Email</div> <div> {user.secondaryEmail}</div>
                  </div>
                  <div
                    onClick={() => setShowSecondaryEmailInput(true)}
                    className="bg-white flex dark:bg-dark_primary_comp h-fit flex-center text-sm font-medium px-3 py-1 rounded-xl border-[1px] cursor-pointer"
                  >
                    Edit
                  </div>
                </div>
              ) : (
                <>
                  <div className="cursor-pointer" onClick={() => setShowSecondaryEmailInput(true)}>
                    <Plus size={20} />
                  </div>
                  <span className="text-white ml-2">Add Secondary Email</span>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Email;
