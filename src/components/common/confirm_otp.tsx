import { userSelector } from '@/slices/userSlice';
import { X } from '@phosphor-icons/react';
import React, { useEffect, useState } from 'react';
import OTPInput from 'react-otp-input';
import { useSelector } from 'react-redux';

interface Props {
  handleSubmit: ({}: any) => void;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  subtitle?: string;
  confirmText?: string;
}

const ConfirmOTP = ({
  handleSubmit,
  setShow,
  title = "Verify it's You",
  subtitle = 'Enter the One Time Password (OTP) sent to - ',
  confirmText = 'Confirm',
}: Props) => {
  const [OTP, setOTP] = useState('');

  const user = useSelector(userSelector);

  useEffect(() => {
    document.documentElement.style.overflowY = 'hidden';
    document.documentElement.style.height = '100vh';

    return () => {
      document.documentElement.style.overflowY = 'auto';
      document.documentElement.style.height = 'auto';
    };
  }, []);
  return (
    <>
      <div className="fixed top-48 max-md:top-20 w-1/3 max-lg:w-5/6 h-fit max-lg:h-fit backdrop-blur-2xl bg-white dark:bg-[#ffe1fc22] flex flex-col gap-2 max-lg:gap-0 rounded-lg p-8 dark:text-white font-primary overflow-y-auto border-[1px] border-primary_btn  dark:border-dark_primary_btn right-1/2 shadow-lg translate-x-1/2 animate-fade_third z-50 max-lg:z-[60]">
        <div className="w-full flex justify-end">
          <X className="cursor-pointer" onClick={() => setShow(false)} size={32} />
        </div>
        <div className="w-full max-lg:h-56 lg:flex-1 flex flex-col gap-8">
          <div className="w-full flex flex-col gap-4">
            <div className="font-bold text-5xl text-gray-800 dark:text-white">{title}</div>
            <div className="font-medium text-sm">
              {subtitle} <span className="font-semibold">{user.email}</span>
            </div>
          </div>

          <OTPInput
            value={OTP}
            onChange={(otp: string) => setOTP(otp)}
            numInputs={6}
            renderInput={props => <input {...props} />}
            inputStyle={{
              width: '52px',
              height: '64px',
              display: 'flex',
              justifyContent: 'center',
              justifyItems: 'center',
              textAlign: 'center',
              borderRadius: '20%',
              borderWidth: '2px',
              WebkitAppearance: 'none',
              MozAppearance: 'textfield',
            }}
            containerStyle="flex gap-2 mx-auto"
            inputType="number"
            shouldAutoFocus={true}
          />

          <div
            onClick={() => handleSubmit(OTP)}
            className="w-fit mx-auto text-center bg-primary_comp border-2 border-[#1f1f1f] dark:border-dark_primary_btn hover:text-white px-4 py-2 rounded-xl text-xl hover:bg-[#ab3232] cursor-pointer transition-ease-200"
          >
            {confirmText}
          </div>
        </div>
      </div>
      <div
        onClick={() => setShow(false)}
        className="bg-backdrop w-screen h-screen fixed top-0 left-0 animate-fade_third z-30 max-lg:z-[51]"
      ></div>
    </>
  );
};

export default ConfirmOTP;
