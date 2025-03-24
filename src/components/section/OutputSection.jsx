import MdsButton from "../button/MdsButton";
import ButtonPanel from "../button/ButtonPanel";
import InputLabel from "../label/InputLabel";

const LARGE_MESSAGE = `Response exceeds copy/preview limit. Please download and view locally.`;

const OutputSection = ({ label, onDownload, disabled }) => {
  return (
    <div className="flex flex-col gap-2">
      <InputLabel>{label}</InputLabel>

      <ButtonPanel>
        <MdsButton onClick={onDownload} disabled={disabled}>
          Download
        </MdsButton>
      </ButtonPanel>
    </div>
  );
};

export default OutputSection;
