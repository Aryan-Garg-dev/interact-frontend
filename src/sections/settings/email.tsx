import Input from '@/components/form/input';
import { userSelector } from '@/slices/userSlice';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const Email = () => {
  const [clickedOnChange, setClickedOnChange] = useState(false);
  const user = useSelector(userSelector);

  const [newEmail, setNewEmail] = useState(user.email);

  const handleSubmit = () => {};

  return (
    <div className="w-full flex justify-between">
      <div className="w-full">
        <div className="text-lg font-semibold">Your email address</div>
        {clickedOnChange ? (
          <div className="w-full flex-center gap-4 items-center">
            <input
              value={newEmail}
              onChange={el => setNewEmail(el.target.value)}
              type="email"
              className="w-full font-medium bg-transparent focus:outline-none border-[1px] border-gray-400 rounded-lg p-2"
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
      {!clickedOnChange && (
        <div
          onClick={() => setClickedOnChange(true)}
          className="bg-white h-fit flex-center text-sm font-medium px-3 py-1 rounded-xl border-[1px] cursor-pointer"
        >
          Update
        </div>
      )}
    </div>
  );
};

export default Email;
