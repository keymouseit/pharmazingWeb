"use client";

import { Dispatch, SetStateAction, useState } from "react";
import Lottie from "lottie-react";
import loadingAnimation from "@/assets/animations/loader.json";
import likeAnimation from "@/assets/animations/like.json";
import dislikeAnimation from "@/assets/animations/dislike.json";
import copyAnimation from "@/assets/animations/copy.json";
import {
  MarkMarketingMessageAsClicked,
  SendPriceProposal,
  VoteMessage,
} from "@/server";
import { getAccessToken } from "@/helper";
import {
  useAppDispatch,
  useAppSelector,
  pharmazingActions,
  pharmazingActionsTypes,
  RootState,
} from "@/redux";
import { InputRange, MathJax } from "@/components";
import { Like, Dislike, Copy } from "@/assets/svg";
import { useImages } from "@/context/imagesContext";

type Props = {
  message: pharmazingActionsTypes.Message;
  messagesLength: number;
  isHistory: boolean;
  idx: number;
  showModal: (modalTrigger: string) => void;
  price: number;
  setPrice: Dispatch<SetStateAction<number>>;
  hasAlteredPrice: boolean;
  setHasAlteredPrice: Dispatch<SetStateAction<boolean>>;
  setMarketingId: Dispatch<SetStateAction<number>>;
  setShowMarketingModalNoInterest: Dispatch<SetStateAction<boolean>>;
};

const MessageBox: React.FC<Props> = ({
  message,
  messagesLength,
  isHistory,
  idx,
  showModal,
  price,
  setPrice,
  hasAlteredPrice,
  setHasAlteredPrice,
  setMarketingId,
  setShowMarketingModalNoInterest,
}: Props) => {
  const dispatch = useAppDispatch();
  const selector: RootState = useAppSelector((state) => state);
  const { loading, answer_id, question_id, voted } = selector.pharmazing;
  const { setShowImages } = useImages();
  const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null);
  const [likeMessageId, setLikeMessageId] = useState<number | null>(null);
  const [dislikeMessageId, setDislikeMessageId] = useState<number | null>(null);

  const checkLength = (string: string) => string.length;

  const containsLaTeX = (string: string) => string.includes("\\");

  const browseToLink = async (url: string, marketingId: number) => {
    window.open(url, "_blank", "noopener,noreferrer");
    const token = await getAccessToken(dispatch, selector);
    await MarkMarketingMessageAsClicked(token, marketingId);
  };

  const handleClick = async (data: any, isSessionSet: boolean) => {
    if (!isSessionSet) {
      sessionStorage.setItem("imageData", JSON.stringify(data));
      setShowImages(true);
      return;
    }
    const imageData = sessionStorage.getItem("imageData");
    if (imageData) {
      const parse = JSON.parse(imageData);
      if (parse.customAction) {
        const images = {
          images: data.images[parse.idx],
          cid: parse.cid,
        };
        sessionStorage.setItem("imageData", JSON.stringify(images));
        setShowImages(true);
      }
      if (parse.linkClicked) {
        await browseToLink(parse.link, parse.marketingId);
      }
    }
  };

  const removeATagsFromString = (htmlString: string) => {
    const regex = /<a [^>]*>(.*?)<\/a>/gi;
    return htmlString.replace(regex, "$1");
  };

  const copyToClipboard = (textToCopy: string, id: number, idx: number) => {
    navigator.clipboard
      .writeText(removeATagsFromString(textToCopy))
      .catch(() => {});
    if (!isHistory) {
      dispatch(pharmazingActions.setIconAction(idx, "COPY"));
      setCopiedMessageId(id);
      setTimeout(() => {
        dispatch(pharmazingActions.setIconAction(idx, "NONE"));
        setCopiedMessageId(null);
      }, 2500);
    }
  };

  const voteMessage = async (
    upvote: boolean,
    downvote: boolean,
    messageId: number,
    ignoreVote: boolean,
    idx: number
  ) => {
    if (!ignoreVote) {
      const token = await getAccessToken(dispatch, selector);
      await VoteMessage(token, upvote, downvote, question_id);
    }
    if (downvote) {
      dispatch(pharmazingActions.setIconAction(idx, "DOWNVOTE"));
      if (!ignoreVote) {
        dispatch(pharmazingActions.setDownvoted());
      }
      setDislikeMessageId(messageId);
      setTimeout(() => {
        dispatch(pharmazingActions.setIconAction(idx, "NONE"));
        if (!ignoreVote) {
          dispatch(pharmazingActions.setVoted(true));
        }
        dispatch(pharmazingActions.setHasVoted(idx));
        setDislikeMessageId(null);
      }, 2500);
    } else if (upvote) {
      dispatch(pharmazingActions.setIconAction(idx, "UPVOTE"));
      setLikeMessageId(messageId);
      setTimeout(() => {
        dispatch(pharmazingActions.setIconAction(idx, "NONE"));
        if (!ignoreVote) {
          dispatch(pharmazingActions.setVoted(true));
        }
        dispatch(pharmazingActions.setHasVoted(idx));
        setLikeMessageId(null);
      }, 2500);
    }
  };

  const PriceProposal = async (
    marketingId: number,
    price: number,
    hardAccept: boolean
  ) => {
    const token = await getAccessToken(dispatch, selector);
    await SendPriceProposal(token, marketingId, price, hardAccept);
  };

  return (
    <div>
      <div
        className={`max-w-80 md:max-w-[500px] lg:max-w-[800px] text-white rounded-3xl border border-black ${
          message.role === "user" ? "bg-primary" : "bg-secondary"
        } py-2 lg:py-3 px-4 lg:px-5 ${
          message.role === "system" &&
          message.loading &&
          message.id === messagesLength &&
          "flex justify-center items-center w-80 md:w-[500px] lg:w-[800px]"
        }`}
      >
        {message.role === "user" && (
          <span className="font-MathJaxRegular">{message.content}</span>
        )}
        {message.role === "system" && (
          <>
            {message.loading && message.id === messagesLength && (
              <div className="min-w-full flex justify-center items-center my-2 lg:my-4">
                <div className="w-16 lg:w-20">
                  <Lottie
                    animationData={loadingAnimation}
                    loop={true}
                    autoPlay={true}
                  />
                </div>
              </div>
            )}
            {containsLaTeX(message.content) && (
              <MathJax
                key={`mathjax-${message.id}`}
                latex={
                  message.contentImages?.length > 0
                    ? message.contentImages
                    : message.content
                }
                handleClick={() => handleClick(message, true)}
              />
            )}
            {!containsLaTeX(message.content) &&
              checkLength(message.content) > 0 &&
              !message.isPriceMarketing && (
                <>
                  {message.textParts && (
                    <>
                      {message.textParts.map(
                        (
                          textPart: {
                            idx: number;
                            word: string;
                            cid: number;
                            isUrl?: boolean;
                            marketingId?: number;
                          },
                          idx2: number
                        ) =>
                          textPart.idx >= 0 ? (
                            <span
                              key={idx2}
                              className={`${
                                textPart.idx >= 0 && "underline cursor-pointer"
                              } font-MathJaxRegular`}
                              onClick={() => {
                                if (textPart.idx >= 0) {
                                  handleClick(
                                    {
                                      images: message.images[textPart.idx],
                                      cid: textPart.cid,
                                    },
                                    false
                                  );
                                }
                              }}
                            >
                              {textPart.word}
                            </span>
                          ) : textPart.isUrl ? (
                            <span
                              key={idx2}
                              className={`${
                                textPart.idx >= 0 &&
                                "underline text-[#6056bf] cursor-pointer"
                              } font-MathJaxRegular`}
                              onClick={async () => {
                                if (textPart.marketingId) {
                                  browseToLink(
                                    textPart.word,
                                    textPart.marketingId
                                  );
                                }
                              }}
                            >
                              {textPart.word}
                            </span>
                          ) : (
                            <span
                              key={idx2}
                              className={`${
                                textPart.idx >= 0 && "underline"
                              } font-MathJaxRegular`}
                            >
                              {textPart.word}
                            </span>
                          )
                      )}
                    </>
                  )}
                </>
              )}
            {message.isPriceMarketing && (
              <span className="p-3">
                {message.textParts.map(
                  (
                    textPart: {
                      idx: number;
                      word: string;
                      cid: number;
                      isUrl?: boolean;
                      marketingId?: number;
                      maxPrice?: number;
                    },
                    idx2: number
                  ) => (
                    <span key={idx2} className="font-MathJaxRegular text-white">
                      <p>{textPart.word}</p>
                      <p>Vorgeschlagener Preis: €{price}</p>
                      <InputRange
                        key={idx2}
                        price={price}
                        setPrice={setPrice}
                        textPart={{
                          maxPrice: textPart.maxPrice,
                          marketingId: textPart.marketingId,
                        }}
                        setHasAlteredPrice={setHasAlteredPrice}
                        PriceProposal={PriceProposal}
                      />
                      <span className="flex mt-4 justify-between items-center">
                        <span
                          className="p-1 rounded bg-primary text-center w-[40%]"
                          onClick={() => {
                            if (textPart.marketingId) {
                              setMarketingId(textPart.marketingId);
                              setShowMarketingModalNoInterest(true);
                            }
                          }}
                        >
                          <p className="text-white w-full font-MathJaxRegular">
                            Kein Interesse
                          </p>
                        </span>
                        {hasAlteredPrice && (
                          <span
                            className="p-1 rounded bg-primary text-center w-[40%]"
                            onClick={async () => {
                              if (textPart.marketingId) {
                                await PriceProposal(
                                  price,
                                  textPart.marketingId,
                                  true
                                );
                              }
                            }}
                          >
                            <p className="text-white w-full font-MathJaxRegular">
                              Ich helfe gerne!
                            </p>
                          </span>
                        )}
                      </span>
                    </span>
                  )
                )}
              </span>
            )}
          </>
        )}
      </div>
      {message.role === "system" && isHistory ? (
        <div className="flex justify-start items-start ml-4 mt-2 mb-0">
          <div className="w-5 h-5 flex justify-center items-center">
            <div
              className="w-4 h-4 cursor-pointer"
              onClick={() => {
                copyToClipboard(message.content, message.id, idx);
                showModal("answer");
              }}
            >
              <Copy />
            </div>
          </div>
        </div>
      ) : (
        <>
          {message.role === "system" && idx === 1 && (
            <div className="flex justify-start items-start ml-4 mt-2 mb-0">
              {likeMessageId !== message.id && !message.loading &&
                idx === 1 &&
                !voted &&
                answer_id >= 0 && (
                  <div className="w-5 h-5 mr-1 flex justify-center items-center">
                    {(message.iconAction === "NONE" ||
                      message.iconAction === "UPVOTE") && (
                      <div
                        className="w-4 h-4 cursor-pointer"
                        onClick={() =>
                          voteMessage(true, false, message.id, false, idx)
                        }
                      >
                        <Like />
                      </div>
                    )}
                  </div>
                )}
              {likeMessageId === message.id && (
                <div className="w-5 h-5 mr-1 flex justify-center items-center">
                  {(message.iconAction === "NONE" ||
                    message.iconAction === "UPVOTE") && (
                    <Lottie animationData={likeAnimation} />
                  )}
                </div>
              )}
              {dislikeMessageId !== message.id && !message.loading &&
                idx === 1 &&
                !voted &&
                answer_id >= 0 && (
                  <div className="w-5 h-5 mr-1 flex justify-center items-center">
                    {(message.iconAction == "NONE" ||
                      message.iconAction == "DOWNVOTE") && (
                      <div
                        className="w-4 h-4 cursor-pointer"
                        onClick={() =>
                          voteMessage(false, true, message.id, false, idx)
                        }
                      >
                        <Dislike />
                      </div>
                    )}
                  </div>
                )}
              {dislikeMessageId === message.id && (
                <div className="w-5 h-5 mr-1 flex justify-center items-center">
                  {(message.iconAction === "NONE" ||
                    message.iconAction === "DOWNVOTE") && (
                    <Lottie animationData={dislikeAnimation} />
                  )}
                </div>
              )}
              {copiedMessageId !== message.id &&
                idx === 1 &&
                ((!message.loading && message.id === messagesLength) ||
                  message.id < messagesLength) && (
                  <div className="w-5 h-5 flex justify-center items-center">
                    {(message.iconAction === "NONE" ||
                      message.iconAction === "COPY") && (
                      <div
                        className="w-4 h-4 cursor-pointer"
                        onClick={() => {
                          copyToClipboard(message.content, message.id, idx);
                          showModal("answer");
                        }}
                      >
                        <Copy />
                      </div>
                    )}
                  </div>
                )}
              {copiedMessageId === message.id && (
                <div className="w-5 h-5 flex justify-center items-center">
                  {(message.iconAction === "NONE" ||
                    message.iconAction === "COPY") && (
                    <Lottie animationData={copyAnimation} />
                  )}
                </div>
              )}
            </div>
          )}
          {message.role === "system" &&
            idx > 1 &&
            ((!message.loading && message.id === messagesLength) ||
              message.id < messagesLength) &&
            (
              <div className="flex justify-start items-start ml-4 mt-2 mb-0">
                {likeMessageId !== message.id &&
                  idx > 1 &&
                  !message.hasVoted && (
                    <div className="w-5 h-5 mr-1 flex justify-center items-center">
                      {(message.iconAction === "NONE" ||
                        message.iconAction === "UPVOTE") && (
                        <div
                          className="w-4 h-4 cursor-pointer"
                          onClick={() =>
                            voteMessage(true, false, message.id, true, idx)
                          }
                        >
                          <Like />
                        </div>
                      )}
                    </div>
                  )}
                {likeMessageId === message.id && !message.hasVoted && (
                  <div className="w-5 h-5 mr-1 flex justify-center items-center">
                    {(message.iconAction === "NONE" ||
                      message.iconAction === "UPVOTE") && (
                      <Lottie animationData={likeAnimation} />
                    )}
                  </div>
                )}
                {dislikeMessageId !== message.id &&
                  idx > 1 &&
                  !message.hasVoted && (
                    <div className="w-5 h-5 mr-1 flex justify-center items-center">
                      {(message.iconAction === "NONE" ||
                        message.iconAction === "DOWNVOTE") && (
                        <div
                          className="w-4 h-4 cursor-pointer"
                          onClick={() =>
                            voteMessage(false, true, message.id, true, idx)
                          }
                        >
                          <Dislike />
                        </div>
                      )}
                    </div>
                  )}
                {dislikeMessageId === message.id && !message.hasVoted && (
                  <div className="w-5 h-5 mr-1 flex justify-center items-center">
                    {(message.iconAction === "NONE" ||
                      message.iconAction === "DOWNVOTE") && (
                      <Lottie animationData={dislikeAnimation} />
                    )}
                  </div>
                )}
                {copiedMessageId !== message.id && idx > 1 && (
                  <div className="w-5 h-5 flex justify-center items-center">
                    {(message.iconAction === "NONE" ||
                      message.iconAction === "COPY") && (
                      <div
                        className="w-4 h-4 cursor-pointer"
                        onClick={() => {
                          copyToClipboard(message.content, message.id, idx);
                          showModal("answer");
                        }}
                      >
                        <Copy />
                      </div>
                    )}
                  </div>
                )}
                {copiedMessageId === message.id && (
                  <div className="w-5 h-5 flex justify-center items-center">
                    {(message.iconAction === "NONE" ||
                      message.iconAction === "COPY") && (
                      <Lottie animationData={copyAnimation} />
                    )}
                  </div>
                )}
              </div>
            )}
        </>
      )}
    </div>
  );
};

export default MessageBox;