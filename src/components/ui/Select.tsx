"use client";

import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useId, useRef, useState } from "react";
import ReactSelect from "react-select";

type Props = {
  options: any[];
  isDisabled?: boolean;
  onChange: (selectedOption: any) => void;
};

const Select: React.FC<Props> = ({ options, onChange, isDisabled }: Props) => {
  const selectInputRef = useRef<any>(null);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleInputChange = (selectedOption: any) => {
    setSelectedOption(selectedOption);
    onChange(selectedOption);
  };

  const onClear = () => {
    setSelectedOption(null);
    onChange(null);
    if (selectInputRef && selectInputRef.current) {
      selectInputRef.current.clearValue();
    }
  };

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: "#383b42",
      borderRadius: "12px",
      fontSize: "18px",
      fontWeight: "bold",
      fontFamily: "var(--font-bold)",
      outline: "none",
      appearance: "none",
      boxShadow: "none",
      borderColor: "transparent",
      "&:hover": {
        borderColor: state.isFocused ? "transparent" : "#555555",
      },
      "&:focus": {
        borderColor: state.isFocused ? "transparent" : "#555555",
      },
    }),
    input: (provided: any, state: any) => ({
      ...provided,
      color: "white",
      fontSize: "18px",
      fontWeight: "bold",
      fontFamily: "var(--font-bold)",
      outline: "none",
      appearance: "none",
      boxShadow: "none",
      borderColor: "transparent",
      cursor: "text",
      "&:hover": {
        borderColor: state.isFocused ? "transparent" : "#555555",
      },
      "&:focus": {
        borderColor: state.isFocused ? "transparent" : "#555555",
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: "#383b42",
      color: "white",
      fontSize: "18px",
      fontWeight: "bold",
      fontFamily: "var(--font-bold)",
      borderBottomLeftRadius: "12px",
      borderBottomRightRadius: "12px",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#555555" : "#383b42",
      color: "white",
      fontSize: "18px",
      fontWeight: "bold",
      fontFamily: "var(--font-bold)",
      borderRadius: "12px",
      "&:hover": {
        backgroundColor: "#555555",
      },
      cursor: "pointer",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "white",
      fontSize: "18px",
      fontWeight: "bold",
      fontFamily: "var(--font-bold)",
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "white",
      fontSize: "18px",
      fontWeight: "bold",
      fontFamily: "var(--font-bold)",
    }),
    dropdownIndicator: (provided: any, state: any) => ({
      ...provided,
      color: "#666666",
      transform: state.isFocused ? "rotate(180deg)" : "none",
      transition: "transform 0.2s ease",
    }),
  };

  return (
    <div className="relative w-full">
      <ReactSelect
        ref={selectInputRef}
        instanceId={useId()}
        options={options}
        value={selectedOption}
        onChange={handleInputChange}
        isDisabled={isDisabled}
        placeholder="Select"
        styles={customStyles}
        components={{
          IndicatorSeparator: () => null,
        }}
      />
      {selectedOption && (
        <button
          type="button"
          onClick={onClear}
          className="absolute top-1/2 right-0 transform -translate-y-1/2 mr-2"
        >
          <FontAwesomeIcon icon={faCircleXmark} color="white" size="lg" />
        </button>
      )}
    </div>
  );
};

export default Select;
