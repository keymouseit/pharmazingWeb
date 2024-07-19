"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

type Props = {
  price: number;
  setPrice: Dispatch<SetStateAction<number>>;
  setHasAlteredPrice: Dispatch<SetStateAction<boolean>>;
  textPart: {
    maxPrice?: number;
    marketingId?: number;
  };
  PriceProposal: (
    price: number,
    marketingId: number,
    hardAccept: boolean
  ) => Promise<void>;
};

const InputRange: React.FC<Props> = ({
  price,
  setPrice,
  setHasAlteredPrice,
  textPart,
  PriceProposal,
}: Props) => {
  const sliderRef = useRef<HTMLInputElement>(null);
  const [bgColor, setBgColor] = useState<string>(`linear-gradient(
    to right,
    #6056bf,
    #6056bf 0%,
    lightblue 0%,
    lightblue
  )`);

  useEffect(() => {
    const slider = sliderRef.current;
    const maxPrice = textPart.maxPrice === undefined ? 30 : textPart.maxPrice;
    const percent = (price / maxPrice) * 100;
    if (slider) {
      setBgColor(`linear-gradient(
        to right,
        #6056bf,
        #6056bf ${percent}%,
        lightblue ${percent}%,
        lightblue
      )`);
    }
  }, [price, textPart.maxPrice]);

  return (
    <input
      ref={sliderRef}
      type="range"
      value={price}
      onChange={(event) => {
        const value = parseInt(event.target.value);
        setPrice(value);
        setHasAlteredPrice(true);
      }}
      min={0}
      max={textPart.maxPrice === undefined ? 30 : textPart.maxPrice}
      step={1}
      className="custom-input-range"
      style={{ background: bgColor }}
      onMouseUp={async () => {
        if (textPart.marketingId) {
          await PriceProposal(price, textPart.marketingId, false);
        }
      }}
      onTouchEnd={async () => {
        if (textPart.marketingId) {
          await PriceProposal(price, textPart.marketingId, false);
        }
      }}
    />
  );
};

export default InputRange;
