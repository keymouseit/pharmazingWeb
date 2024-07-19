import { LoadingIcon } from "../icons/LoadingIcon";
import Lottie from "lottie-react";
import voiceToText from "@/assets/animations/voice-to-text.json";

export default function Loading({loadingText="Processing Audio . . ."}:{loadingText:string}) {
  return (
          <div className="fixed inset-0 flex items-center justify-center bg-white z-999">
            <Lottie
                animationData={voiceToText}
                loop={true}
                autoPlay={true}
                style={{ width: '200px', height: '200px' }}
            />
        </div>
  );
}
