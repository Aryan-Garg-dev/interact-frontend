import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  width?: string | number;
  top?: string | number;
  z?: number;
  modalStyles?: React.CSSProperties;
  bgStyles?: React.CSSProperties;
  blur?: boolean;
}

const ModalWrapper = ({
  children,
  setShow,
  width = '1/3',
  top = 32,
  z = 40,
  modalStyles,
  bgStyles,
  blur = false,
}: Props) => {
  const z_variants = ['z-10', 'z-20', 'z-30', 'z-40', 'z-50'];
  const top_variants = ['top-32', 'top-56', 'top-1/2'];
  const w_variants = ['w-2/3', 'w-1/2', 'w-1/3', 'w-1/4'];
  const h_variants = ['h-1/2', 'h-fit'];

  return (
    <>
      <div
        style={modalStyles}
        className={`fixed top-${top} w-${width} max-lg:w-5/6 max-h-5/6 overflow-y-auto flex flex-col items-center gap-2 right-1/2 translate-x-1/2 rounded-lg p-4 dark:text-white font-primary bg-white backdrop-blur-lg border-2 border-primary_btn animate-fade_third z-${
          z + 10
        }`}
      >
        {children}
      </div>
      <div
        onClick={() => setShow(false)}
        style={bgStyles}
        className={`bg-backdrop w-screen h-screen ${
          blur && 'backdrop-blur-sm'
        } fixed top-0 right-0 animate-fade_third z-${z}`}
      ></div>
    </>
  );
};

export default ModalWrapper;
