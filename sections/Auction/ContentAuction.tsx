import { useEffect, useMemo, useState } from 'react';
import Button from '@components/Button';
import DropdownSelect from '@components/DropdownSelect';
import NftCard from '@components/NftCard';
import PriceRange from '@components/PriceRange';
import { useViewPort } from '@hooks/useViewport';
import TabletDrawer from './TabletDrawer';
import AuctionData from '@sections/Auction/AuctionData';
import {
  FilterSvg,
  FILTER_OPTIONS_CATEGORIES,
  FILTER_OPTIONS_SORT_TYPE,
  FILTER_OPTIONS_TYPES,
  EMPTY_NFT_SELLER,
} from './cosntants';
import { useWeb3Modal } from '@hooks/useWeb3Modal';
import { useAppRouter } from '@hooks/useAppRouter';
import AuctionCollectionData from '@sections/Auction/AuctionCollectionData';
import { AuctionCollections } from '@sections/types';

type ContentAuctionProps = {
  collection?: AuctionCollections;
};

const ContentAuction = ({ collection }: ContentAuctionProps) => {
  const { isTablet, isMobile, isDesktop, isLaptop } = useViewPort();
  const [data, setData] = useState<any[]>([]);
  const [isCollection, setIsCollection] = useState<boolean>(false);
  const { getAuctionInfo } = useWeb3Modal();
  const { push } = useAppRouter();

  useEffect(() => {
    setIsCollection(!!collection);
    setSelectedCategory(collection ?? FILTER_OPTIONS_CATEGORIES[0]?.value);
  }, [collection]);

  useEffect(() => {
    const getEnrichedData = async () => {
      const filteredData = AuctionData.filter((d) =>
        collection ? d.category === collection : true,
      );
      try {
        const response = await Promise.all(
          filteredData.map((datum) => {
            return AuctionCollectionData[datum.category].contractAddress
              ? getAuctionInfo(
                  AuctionCollectionData[datum.category].contractAddress,
                  datum.tokenId,
                )
              : {};
          }),
        );

        setData(
          response.map((datum, index) => ({
            ...AuctionCollectionData[filteredData[index]!.category],
            ...filteredData[index],
            ...datum,
          })),
        );
      } catch (error) {
        console.error(error);
      }
    };

    getEnrichedData();
  }, [collection]);

  const [open, setOpen] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<string | undefined>(
    FILTER_OPTIONS_TYPES[FILTER_OPTIONS_TYPES.length - 1]?.value,
  );
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    FILTER_OPTIONS_CATEGORIES[0]?.value,
  );
  const [selectedSort, selSelectedSort] = useState<string | undefined>(
    FILTER_OPTIONS_SORT_TYPE[0]?.value,
  );
  const [priceRange, setPriceRange] = useState<{ from: string; to: string }>({
    from: '',
    to: '',
  });

  const filteredData = useMemo(() => {
    let result = data;

    if (data.length === 0) return [];

    if (selectedCategory !== FILTER_OPTIONS_CATEGORIES[0]?.value) {
      result = result.filter((datum) => datum.category === selectedCategory);
    }

    if (selectedType !== FILTER_OPTIONS_TYPES[2]?.value) {
      result = result.filter((datum) =>
        selectedType === 'On Sale'
          ? datum.fullInfo.nftSeller !== EMPTY_NFT_SELLER
          : datum.fullInfo.nftSeller === EMPTY_NFT_SELLER,
      );
    }

    if (priceRange.from !== '') {
      result = result.filter((datum) => +datum.bid >= +priceRange.from);
    }

    if (priceRange.to !== '') {
      result = result.filter((datum) => +datum.bid <= +priceRange.to);
    }

    if (selectedSort === FILTER_OPTIONS_SORT_TYPE[0]?.value) {
      result = result.sort((datumA, datumB) =>
        new Date(datumA.endsIn) > new Date(datumB.endsIn) ? -1 : 1,
      );
    } else if (selectedSort === FILTER_OPTIONS_SORT_TYPE[1]?.value) {
      result = result.sort((datumA, datumB) =>
        new Date(datumA.startsAt) > new Date(datumB.startsAt) ? -1 : 1,
      );
    } else if (selectedSort === FILTER_OPTIONS_SORT_TYPE[2]?.value) {
      result = result.sort((datumA, datumB) =>
        +datumA.bid < +datumB.bid ? -1 : 1,
      );
    } else if (selectedSort === FILTER_OPTIONS_SORT_TYPE[3]?.value) {
      result = result.sort((datumA, datumB) =>
        datumA.bid > datumB.bid ? -1 : 1,
      );
    }

    return result;
  }, [data, selectedType, selectedCategory, priceRange, selectedSort]);

  const handleChangeType = (v?: string) => setSelectedType(v);
  const handleChangeCategory = (v?: string) => {
    push(`/auction/collection/${v}`);
    setSelectedCategory(v);
  };
  const handleChangeSort = (v?: string) => selSelectedSort(v);
  const toggleDrawer = () => setOpen((state) => !state);
  const closeDrawer = () => setOpen(false);
  const openDrawer = () => setOpen(true);

  const getItemStyle = (index: number) => {
    const result: React.CSSProperties = {};

    if (isDesktop) {
      if (index < 2) {
        result.width = 'calc((100% - 48px) / 2)';
      } else {
        result.width = 'calc((100% - 144px) / 4)';
      }
      if (index === 0) {
        result.marginRight = 48;
      } else {
        result.marginRight = (index - 1) % 4 ? 48 : 0;
      }

      result.marginTop = 72;

      return result;
    }

    if (isTablet || isLaptop) {
      if (index === 0) {
        result.width = '100%';
        result.marginRight = 0;
      } else {
        result.width = 'calc((99% - 48px) / 2)';
        result.marginRight = index % 2 ? 48 : 0;
      }

      result.marginTop = 72;

      return result;
    }

    result.width = '100%';
    result.marginRight = 0;
    result.marginTop = 30;

    return result;
  };

  return (
    <>
      <div className="flex justify-between laptop:mt-[0px] tablet:mt-72px mobile:mt-[24px]">
        {!isTablet && !isMobile ? (
          <div className="flex tablet:mb-[57px] laptop:mb-0">
            <div className="pr-20px">
              <PriceRange value={priceRange} setValue={setPriceRange} />
            </div>
            <div className="px-20px">
              <DropdownSelect
                options={FILTER_OPTIONS_TYPES}
                selectedValue={selectedType}
                onChange={handleChangeType}
                className="w-[162px]"
              />
            </div>
            {isCollection ? null : (
              <div className="px-20px">
                <DropdownSelect
                  options={FILTER_OPTIONS_CATEGORIES}
                  selectedValue={selectedCategory}
                  onChange={handleChangeCategory}
                  className="w-[211px]"
                />
              </div>
            )}
          </div>
        ) : (
          <Button
            mode="primary"
            label={
              <div className="flex items-center justify-between">
                <span className="mr-16px">
                  {isMobile ? 'Filters and Sorting' : 'Filters'}
                </span>
                <span>
                  <FilterSvg />
                </span>
              </div>
            }
            onClick={openDrawer}
            className={isMobile ? 'mobile:w-full h-48px' : ''}
          />
        )}
        {!isMobile && (
          <DropdownSelect
            options={FILTER_OPTIONS_SORT_TYPE}
            selectedValue={selectedSort}
            onChange={handleChangeSort}
            className="w-[236px]"
          />
        )}
      </div>
      <div className="flex flex-wrap">
        {filteredData.map((item, index) => (
          <div
            className={`mobile:px-24px tablet:px-0 desktop:px-0 ${
              isDesktop ? 'zoom-hover' : ''
            }`}
            key={item.index}
            style={getItemStyle(index)}
          >
            <NftCard
              orderIndex={index}
              index={item.index}
              imageSrc={item.imageSrc}
              name={item.name}
              startsAt={item.startsAt}
              endsIn={item.endsIn}
              contractAddress={item.contractAddress}
              tokenId={item.tokenId}
              isSale={item.isSale}
            />
          </div>
        ))}
      </div>
      {(isTablet || isMobile) && (
        <TabletDrawer
          toggleDrawer={toggleDrawer}
          closeDrawer={closeDrawer}
          isOpen={open}
          selectedType={selectedType}
          handleChangeType={handleChangeType}
          selectedCategory={selectedCategory}
          handleChangeCategory={handleChangeCategory}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />
      )}
    </>
  );
};

export default ContentAuction;
