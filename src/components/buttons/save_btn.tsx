interface SaveBtnProps {
  setter: React.Dispatch<React.SetStateAction<boolean>>;
  field: string;
  checker: () => boolean;
  handleSubmit: (field: string) => void;
}

const SaveButton = ({ setter, field, checker, handleSubmit }: SaveBtnProps) => {
  return (
    <div className="w-full flex text-sm justify-end gap-2 mt-2">
      <div
        onClick={() => setter(false)}
        className="border-[1px] border-primary_black flex-center rounded-full w-20 p-1 cursor-pointer"
      >
        Cancel
      </div>
      {checker() ? (
        <div className="bg-primary_black bg-opacity-50 text-white flex-center rounded-full w-16 p-1 cursor-default">
          Save
        </div>
      ) : (
        <div
          onClick={() => handleSubmit(field)}
          className="bg-primary_black text-white flex-center rounded-full w-16 p-1 cursor-pointer"
        >
          Save
        </div>
      )}
    </div>
  );
};

export default SaveButton;
