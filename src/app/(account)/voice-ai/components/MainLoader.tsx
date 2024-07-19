import Lottie from "lottie-react";
import bigLoadingAnimation from "@/assets/animations/bigLoading.json";


export const LoaderComp = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-999">
        <Lottie
            animationData={bigLoadingAnimation}
            loop={true}
            autoPlay={true}
            style={{ width: '200px', height: '200px' }}
        />
    </div>
);