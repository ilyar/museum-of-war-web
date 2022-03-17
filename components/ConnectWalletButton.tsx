import React from "react";
import { truncateAddress } from "sections/utils";

type ConnectWalletButtonProps = {
  signerAddress: string;
  handleConnect: () => void;
  handleDisconnect: () => void;
};

const ConnectWalletButton = ({
  signerAddress,
  handleConnect,
  handleDisconnect,
}: ConnectWalletButtonProps) => {
  return (
    <div>
      <button
        className="bg-carbon rounded-full text-white font-rblack px-20% tablet:py-10px mobile:py-8% whitespace-nowrap
      mobile:text-12px laptop:text-14px desktop:text-16px"
        onClick={signerAddress ? handleDisconnect : handleConnect}
      >
        {signerAddress ? truncateAddress(signerAddress) : "Connect Wallet"}
      </button>
    </div>
  );
};

export default ConnectWalletButton;
