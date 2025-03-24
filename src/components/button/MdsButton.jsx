const MdsButton = ({ children, onClick, disabled }) => {
  return (
    <button
      className="border-2 border-solid border-mdslime bg-black cursor-pointer px-5 py-3 min-w-32 flex items-center justify-center hover:bg-mdslime hover:text-black disabled:hover:bg-black disabled:border-neutral-500 disabled:text-neutral-500 disabled:cursor-not-allowed"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default MdsButton;
