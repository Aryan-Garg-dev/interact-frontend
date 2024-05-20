const NoCollaborators = () => {
  return (
    <div className="w-full max-md:w-[90%] h-fit mx-auto px-12 max-md:px-8 py-8 rounded-md font-primary dark:text-white border-gray-300 border-[1px] bg-white dark:bg-dark_primary_comp hover:shadow-lg dark:hover:shadow-2xl flex-center flex-col gap-2 cursor-pointer transition-ease-500">
      <div className="text-xl max-md:text-lg font-medium text-center">
        <span className="text-2xl font-semibold">Oh no!</span> It seems you don&apos;t have any collaborators yet.
      </div>
      <div className="flex flex-col gap-1 max-md:text-sm text-center">
        <div>Your project deserves the best minds working together to make it a success.</div>
        <div>
          <span className="font-bold text-xl max-md:text-lg text-gradient">Invite Collaborators</span> now and turn your
          vision into reality with the power of teamwork. 🌟
        </div>
      </div>
    </div>
  );
};

export default NoCollaborators;
