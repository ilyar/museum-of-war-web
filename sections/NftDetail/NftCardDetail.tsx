import { useEffect, useState } from 'react';
import ScaledImage from '@components/ScaledImage';
import BidsHistoryTable from '@components/BidsHistoryTable';
import Button from '@components/Button';
import { useWeb3Modal } from '@hooks/useWeb3Modal';
import { useViewPort } from '@hooks/useViewport';
import { calculateTimeLeft } from '@sections/AboutProject/ContentTop/CountdownBanner';
import {
  AuctionCollections,
  AuctionCollectionType,
  AuctionItemType,
  BidInfo,
} from '@sections/types';
import { useAppRouter } from '@hooks/useAppRouter';
import AuctionData from '@sections/Auction/AuctionData';
import NftCard from '@components/NftCard';
import { usePopup } from 'providers/PopupProvider';
import { isAnimated, truncateAddress } from '@sections/utils';
import { usePreloader } from '@providers/PreloaderProvider';
import AuctionCollectionData from '@sections/Auction/AuctionCollectionData';

type NftCardDetailProps = {
  item: AuctionItemType;
};

type BidCardProps = {
  isMobile?: boolean;
  endsIn: Date;
  currentBid: string;
  proposedBids: string[];
  contractAddress: string;
  tokenId: number;
  isSale: boolean;
  buyNowPrice?: string;
};

const getUsdPriceFromETH = async (
  ethPrice: string | number,
): Promise<string> => {
  return await fetch(
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum',
  )
    .then((res) => res.json())
    .then((json) => json[0].current_price as number)
    .then((usdPrice) => (usdPrice * +ethPrice).toFixed(0));
};

const BidCard = ({
  currentBid,
  proposedBids,
  isMobile,
  endsIn,
  contractAddress,
  tokenId,
  isSale,
  buyNowPrice,
}: BidCardProps) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(`${endsIn}`));
  const [usdPrice, setUsdPrice] = useState<string | null>(null);
  const { showPopup } = usePopup();
  const { makeBid } = useWeb3Modal();

  useEffect(() => {
    getUsdPriceFromETH(currentBid).then(setUsdPrice);
  }, [currentBid]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(`${endsIn}`));
    }, 1000);
    return () => clearInterval(interval);
  }, [endsIn]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const price = await getUsdPriceFromETH(currentBid);
      if (price) setUsdPrice(price);
    }, 10000);
    return () => clearInterval(interval);
  }, [currentBid]);

  return (
    <>
      <div className="flex items-start justify-between mobile:flex-col tablet:flex-row mobile:mt-20px tablet:mt-[0px]">
        <div>
          <p className="font-rlight text-14px opacity-70 tablet:mb-12px">
            {isSale ? 'Current price' : 'Current bid'}
          </p>
          <p className="mobile:text-27px tablet:text-32px font-rblack">
            {currentBid} ETH
          </p>
          {!!usdPrice && (
            <p className="font-rlight mobile:text-14px tablet:text-16px">
              ${usdPrice}
            </p>
          )}
        </div>
        {timeLeft.isLeft && (
          <>
            <div className="self-end tablet:h-60px mobile:h-4px tablet:w-[4px] mobile:w-full mobile:my-20px tablet:my-[0px] bg-carbon dark:bg-white" />
            <div>
              <p className="font-rlight text-14px opacity-70 tablet:mb-12px">
                Ends in
              </p>
              <div className="flex -mx-10px">
                <div className="text-center px-10px">
                  <p className="mobile:text-27px tablet:text-32px font-rblack">
                    {timeLeft.days}
                  </p>
                  <p className="font-rlight mobile:text-14px tablet:text-16px">
                    days
                  </p>
                </div>
                <div className="text-center px-10px">
                  <p className="mobile:text-27px tablet:text-32px font-rblack">
                    {timeLeft.hours}
                  </p>
                  <p className="font-rlight mobile:text-14px tablet:text-16px">
                    hours
                  </p>
                </div>
                <div className="text-center px-10px">
                  <p className="mobile:text-27px tablet:text-32px font-rblack">
                    {timeLeft.minutes}
                  </p>
                  <p className="font-rlight mobile:text-14px tablet:text-16px">
                    minutes
                  </p>
                </div>
                <div className="text-center px-10px">
                  <p className="font-rblack mobile:text-27px tablet:text-32px font-rblack">
                    {timeLeft.seconds}
                  </p>
                  <p className="mobile:text-14px tablet:text-16px">seconds</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {!isMobile && (
        <Button
          mode="custom"
          label={isSale ? 'Buy Now' : 'Place Bid'}
          onClick={() => {
            if (isSale) {
              try {
                makeBid(contractAddress, tokenId, buyNowPrice!);
              } catch (error: any) {
                console.error(error?.message ?? error);
              }
            } else {
              showPopup('bid', { proposedBids, contractAddress, tokenId });
            }
          }}
          className="bg-white text-carbon w-100% mt-24px"
        />
      )}
    </>
  );
};

const NftCardDetail = ({ item }: NftCardDetailProps) => {
  const { isTablet, isMobile } = useViewPort();
  const { activePopupName, showPopup } = usePopup();
  const { push } = useAppRouter();
  const { makeBid, getAuctionInfo, getOwnerOfNFT } = useWeb3Modal();
  const { hidePreloader, showPreloader } = usePreloader();

  const [isSold, setSold] = useState<boolean>(false);
  const [tokenOwner, setTokenOwner] = useState<string>('');
  const [collectionData, setCollectionData] = useState<AuctionCollectionType>(
    AuctionCollectionData[AuctionCollections.firstDrop],
  );
  const [currentBid, setCurrentBid] = useState<{
    bid: string;
    proposedBids: string[];
    fullInfo: any;
    bidHistory: BidInfo[];
    buyNowPrice?: string;
  }>({ bid: '0', proposedBids: ['0'], fullInfo: '', bidHistory: [] });

  useEffect(() => {
    showPreloader();

    return () => {
      hidePreloader();
    };
  }, []);

  useEffect(() => {
    setCollectionData(AuctionCollectionData[item.category]);
  }, [item.category]);

  useEffect(() => {
    getAuctionInfo(collectionData.contractAddress, item.tokenId)
      .then(async (i) => {
        setCurrentBid({ ...i });
        setSold(i.isSold);
        if (i.isSold)
          setTokenOwner(
            await getOwnerOfNFT(collectionData.contractAddress, item.tokenId),
          );
      })
      .catch((error) => console.log(`NftCardDetail ${error}`))
      .finally(() => {
        hidePreloader();
      });
  }, [collectionData.contractAddress, item.tokenId]);

  const handleToAuction = () => push('/auction');

  return (
    <>
      <div>
        {(isTablet || isMobile) && !isSold && !activePopupName && (
          <div className="tablet:border-[5px] fixed bg-[#212121] text-white bottom-20px left-[2%] right-[2%] tablet:p-48px w-[96%] z-50 ">
            {isTablet ? (
              <BidCard
                endsIn={collectionData.endsIn}
                proposedBids={currentBid.proposedBids}
                currentBid={currentBid.bid}
                contractAddress={collectionData.contractAddress}
                tokenId={item.tokenId}
                isSale={item.isSale}
              />
            ) : (
              <Button
                mode="custom"
                label={item.isSale ? 'Buy Now' : 'Place Bid'}
                onClick={() => {
                  if (item.isSale) {
                    try {
                      makeBid(
                        collectionData.contractAddress,
                        item.tokenId,
                        currentBid.buyNowPrice!,
                      );
                    } catch (error: any) {
                      console.error(error?.message ?? error);
                    }
                  } else {
                    showPopup('bid', {
                      proposedBids: currentBid.proposedBids,
                      contractAddress: collectionData.contractAddress,
                      tokenId: item.tokenId,
                    });
                  }
                }}
                className="bg-white text-carbon w-100%"
              />
            )}
          </div>
        )}
        <div className="flex mt-40px mobile:flex-col desktop:flex-row justify-between">
          <div className="desktop:w-[48%] mobile: w-full">
            <ScaledImage
              alt={item.name}
              src={item.imageSrc}
              breakpoints={[
                {
                  lowerBound: 'desktop',
                  ratio: 0.5,
                },
              ]}
              postLoadOriginal={isAnimated(item.imageSrc)}
            />
          </div>
          <div className="desktop:w-[48%] mobile: w-full">
            {isSold ? (
              <p className="mobile:text-27px tablet:text-32px font-rblack  mobile:mt-20px desktop:mt-[0px]">
                Sold
              </p>
            ) : isTablet ? (
              <></>
            ) : (
              <BidCard
                isMobile={isMobile}
                endsIn={collectionData.endsIn}
                proposedBids={currentBid.proposedBids}
                currentBid={currentBid.bid}
                contractAddress={collectionData.contractAddress}
                tokenId={item.tokenId}
                isSale={item.isSale}
              />
            )}
            <p className="font-rlight whitespace-pre-wrap mobile:text-14px tablet:text-16px mobile:mt-40px leading-[150%] tablet:mt-48px">
              {item.descriptionEnglish}
            </p>
            <p className="font-rlight whitespace-pre-wrap mobile:text-14px tablet:text-16px leading-[150%] mt-24px">
              {item.descriptionUkrainian}
            </p>
            <div className="font-rlight flex mobile:flex-col desktop:flex-col tablet:flex-row mobile:mt-40px tablet:mt-48px">
              <div className="flex mobile:flex-col tablet:flex-row text-16px">
                <div className="flex">
                  {item.artist?.length > 0 && (
                    <>
                      <p>Artist:</p>
                      <p className=" tablet:ml-[8px]">{item.artist}</p>
                    </>
                  )}
                </div>
                <div className="flex mobile:ml-[0px] tablet:ml-48px mobile:my-[20px] tablet:my-[0px]">
                  <p>Edition:</p>
                  <p className="ml-[8px]">1 of 1</p>
                </div>
              </div>
              {isSold && (
                <div className="flex text-16px desktop:mt-24px tablet:ml-48px desktop:ml-[0px]">
                  <p>Owner:</p>
                  <p className="ml-[8px]" title={tokenOwner}>
                    {truncateAddress(tokenOwner, 13)}
                  </p>
                </div>
              )}
            </div>
            {isSold && false /*TODO*/ && (
              <div className="mobile:mt-60px tablet:mt-72px desktop:mt-96px">
                <p className="mobile:text-27px tablet:text-32px font-rblack mobile:mb-30px tablet:mb-36px">
                  Bids history
                </p>
                <BidsHistoryTable bids={currentBid.bidHistory} />
              </div>
            )}
            <div className="desktop:mt-96px mobile:my-60px tablet:mt-72px">
              <div className="flex items-center mobile:mb-[20px] tablet:mb-24px">
                <p className="mobile:text-27px tablet:text-32px font-rblack">
                  More auctions
                </p>
                {!isMobile && (
                  <p
                    onClick={handleToAuction}
                    className="text-[14px] font-rblack ml-32px  hover:cursor-pointer"
                  >
                    See all auctions
                  </p>
                )}
              </div>
              <div className="flex flex-wrap -mx-24px">
                {AuctionData.slice(0, 2).map((item, index) => (
                  <div
                    className={`tablet:w-1/2 mobile:w-full flex flex-col p-14px`}
                    key={item.index}
                  >
                    <NftCard
                      breakpoints={[
                        {
                          lowerBound: 'tablet',
                          ratio: 0.5,
                        },
                        {
                          lowerBound: 'desktop',
                          ratio: 0.25,
                        },
                      ]}
                      orderIndex={index}
                      index={item.index}
                      imageSrc={item.imageSrc}
                      name={item.name}
                      startsAt={collectionData.startsAt}
                      endsIn={collectionData.endsIn}
                      contractAddress={collectionData.contractAddress}
                      tokenId={item.tokenId}
                      isSale={item.isSale}
                      type="small"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NftCardDetail;
