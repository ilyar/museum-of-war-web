import { useViewPort } from "@hooks/useViewport";
import React from "react";
import "@dotlottie/player-component";

type ConnectYourWalletChronologyProps = {
  handleConnect: () => void;
};

const ConnectYourWalletChronology = ({
  handleConnect,
}: ConnectYourWalletChronologyProps) => {
  const { isMobile } = useViewPort();
  return isMobile ? (
    <div className="mt-8% flex flex-col justify-center">
      <div className="bg-carbon text-white px-12% py-8%">
        <p className="font-rblack text-26px leading-30px mb-20px">
          Connect your wallet to support the Project
        </p>
        <p className="font-rnarrow mb-30px">
          Під’єднай гаманець, щоб підтримати Україну{" "}
        </p>
        <div className="flex justify-center">
          <button
            className="border-2 rounded-full border-white 
        font-rblack
            px-30px py-20px mobile:text-12px
            whitespace-nowrap
            "
            onClick={() => {
              handleConnect();
            }}
          >
            Connect Wallet
          </button>
        </div>
      </div>
      <div className="pt-30px">
        <img
          alt="dots"
          src={"/img/pd-dots1.png"}
          width="80%"
          className="block m-auto mt-2%"
        />
      </div>
    </div>
  ) : (
    <div className="mt-8% flex flex-col justify-center laptop:px-10%">
      <div className="bg-carbon text-white p-6% flex flex-row items-center justify-between">
        <div className="laptop:w-60% tablet:w-70% mobile:w-70% mr-30%">
          <p className="font-rblack mobile:text-22px tablet:text-22px laptop:text-30px desktpo:text-34px">
            Connect your wallet to support the Project
          </p>
          <p className="font-rnarrow">
            Під’єднай гаманець, щоб підтримати Україну{" "}
          </p>
        </div>
        <div className="">
          <button
            className="border-2 rounded-full border-white 
        font-rblack flex justify-center
            laptop:px-25px laptop:py-10px laptop:text-14px 
            tablet:px-20px tablet:py-10px tablet:text-12px
            mobile:px-15px mobile:py-5px mobile:text-12px
            whitespace-nowrap
            "
            onClick={handleConnect}
          >
            Connect Wallet
          </button>
        </div>
      </div>
      <div className="pt-20px">
        <img
          alt="dots"
          src={"/img/pd-dots1.png"}
          width="40%"
          className="block m-auto mt-2%"
        />
      </div>
    </div>
  );
};

export default ConnectYourWalletChronology;
