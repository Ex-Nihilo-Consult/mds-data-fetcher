import InputLabel from "../label/InputLabel";
import ButtonPanel from "../button/ButtonPanel";
import MdsButton from "../button/MdsButton";

const TokenSection = ({ fetchNewData, tokenInputRef }) => {
  return (
    <div className="flex flex-col gap-2">
      <InputLabel>Enter token</InputLabel>
      <input
        className="font-mono p-2 border-2 border-neutral-800 bg-black font-white focus:border-neutral-600 focus:outline-none"
        type="text"
        // Input is uncontrolled to prevent re-renders
        ref={tokenInputRef}
      />
      <ButtonPanel>
        <MdsButton onClick={fetchNewData}>Execute</MdsButton>
      </ButtonPanel>
    </div>
  );
};

export default TokenSection;
