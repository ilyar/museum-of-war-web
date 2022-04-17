import Blurb from '@sections/AboutProject/Blurb';
import ContentAuction from './ContentAuction';
import DropNft from './DropNft';
import { useWeb3Modal } from '@hooks/useWeb3Modal';
import { useEffect, useState } from 'react';
import { openInNewTab } from '@sections/utils';
import { MINT_LINK, OPENSEA_LINK } from '@sections/Constants';

type AuctionProps = {
  signerAddress: string;
  handleConnect: () => void;
};

const Auction = ({ signerAddress, handleConnect }: AuctionProps) => {
  const [isCanMint, setCanMint] = useState<boolean>(false);

  const { canMint } = useWeb3Modal();

  useEffect(() => {
    canMint().then((i) => setCanMint(i));
  }, []);

  const handleBuyNft = () => openInNewTab(isCanMint ? MINT_LINK : OPENSEA_LINK);

  return (
    <>
      <Blurb
        header="Auction"
        english="A limited set of rare, selected, and generative artworks by both Ukrainian and global artists. Floating price, based on bids and offers. For this time, the Museum invites art collectors to fully shape the charity fundraising. Please note that only Warline art collectors are allowed to bid in the auction."
        ukrainian="Обмежений набір рідкісних та відібраних робіт українських та світових художників. Плаваюча ціна, що базується на ставках та пропозиціях. На цей раз Музей запрошує колекціонерів мистецтва повністю сформувати благодійний збір коштів. Зверніть увагу, що лише колекціонери експонатів Warline можуть брати участь в аукціоні."
      />
      <ContentAuction />
      {isCanMint && (
        <DropNft
          desc="Meanwhile, the current drop is still on sale. The NFTs are unique but any NFT will support Ukraine. Get yours."
          buttonLabel="Buy NFT Now"
          className="laptop:mb-120px tablet:mb-96px mobile:mb-[60px] tablet:my-72px mobile:my-40px"
          handleClick={handleBuyNft}
        />
      )}
    </>
  );
};

export default Auction;
