import { useState } from "react";

const MDL_LIME = "#b0ff00";

const ColumnSelectorContainer = ({ children, onClick, isOpen, disabled }) => {
  return (
    <div className="">
      <button
        disabled={disabled}
        onClick={onClick}
        className={`w-full border-2 border-solid border-neutral-800 ${
          isOpen ? "bg-black" : "bg-black"
        } cursor-pointer px-5 py-3 min-w-32 flex items-center justify-between disabled:hover:bg-black disabled:border-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed`}
      >
        Select fields
        <div className="w-5 h-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlSpace="preserve"
            viewBox="0 0 12.4 10.6"
          >
            {isOpen ? (
              <path
                fill={MDL_LIME}
                d="M6.2 10.6 12.3.1H.2z"
                transform="rotate(180)"
                transform-box="fill-box"
                transformOrigin="center"
              />
            ) : (
              <path
                fill={disabled ? "oklch(0.556 0 0)" : MDL_LIME}
                d="M6.2 10.6 12.3.1H.2z"
              />
            )}
          </svg>
        </div>
      </button>
      <div
        className={`bg-black ${
          isOpen ? "border-solid border-2 border-t-0 border-neutral-800" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
};

const ColumnSelector = ({
  includedFields,
  toggleField,
  disabled,
  selectAllFields,
  deselectAllFields,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen((prev) => !prev);
  const allSelected = includedFields.filter((row) => !row.include) < 1;

  return (
    <ColumnSelectorContainer
      onClick={toggleOpen}
      isOpen={!disabled && isOpen}
      disabled={disabled}
    >
      {isOpen && (
        <div className="flex flex-col gap-2 p-4">
          <div className="flex flex-row gap-2">
            <input
              type="checkbox"
              id={"select-all"}
              name={"select-all"}
              value={"select-all"}
              checked={allSelected}
              onChange={() => {
                if (allSelected) {
                  deselectAllFields();
                } else {
                  selectAllFields();
                }
              }}
              className={"cursor-pointer accent-mdslime"}
            />
            <label htmlFor={"select-all"}>Select all</label>
          </div>

          <div className="w-full">
            <table className="w-full">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Records</th>
                </tr>
              </thead>

              <tbody>
                {includedFields &&
                  includedFields.map((row) => {
                    return (
                      <tr key={row.key}>
                        <td>
                          <div className="flex flex-row gap-2">
                            <input
                              type="checkbox"
                              id={row.key}
                              name={row.key}
                              value={row.key}
                              checked={row.include}
                              onChange={() => toggleField(row.key)}
                              className={"cursor-pointer accent-mdslime"}
                            />
                            <label htmlFor={row.key}>{row.key}</label>
                          </div>
                        </td>
                        <td>{row.count}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </ColumnSelectorContainer>
  );
};

export default ColumnSelector;
