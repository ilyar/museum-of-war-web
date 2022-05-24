import React, { useEffect } from 'react';
import HeaderAndFooterButton from '@components/HeaderAndFooterButton';
import Button from '@components/Button';
import { truncateAddress } from '@sections/utils';
import { useAppRouter } from '@hooks/useAppRouter';
import { useViewPort } from '@hooks/useViewport';

type MenuMobileProps = {
  isDarkTheme: boolean;
  handleConnectWallet: () => void;
  handleDisconnectWallet: () => void;
  handleDisconnect: () => void;
  signerAddress: string;
  setMenuOpen: any;
};
const MenuMobile: React.FC<MenuMobileProps> = ({
  isDarkTheme,
  handleConnectWallet,
  handleDisconnectWallet,
  signerAddress,
  handleDisconnect,
  setMenuOpen,
}) => {
  const { push, route } = useAppRouter();
  const { isMobile, isTablet } = useViewPort();

  const isCollectionPage = route === '/auction/collection/[id]';

  useEffect(
    () => () => {
      setMenuOpen(false);
    },
    [],
  );

  return (
    <div
      className={`${
        isCollectionPage ? 'absolute left-0 right-0' : 'relative'
      } z-10 px-10px mobile:h-100% tablet:h-120px ${
        isDarkTheme ? 'bg-carbon' : 'bg-white'
      } mobile:left-[-24px] mobile:px-24px mobile:w-[120%]`}
    >
      <div
        className={`flex ${
          isTablet
            ? 'flex-row flex-wrap justify-start items-center  h-60px'
            : 'flex-col'
        }`}
      >
        <HeaderAndFooterButton
          label="Home"
          onClick={() => {
            push('/');
            setMenuOpen(false);
          }}
          underlined={route === '/'}
          wrapperClassName={isMobile ? 'pb-32px' : 'mr-32px'}
        />
        <HeaderAndFooterButton
          label="Warline"
          onClick={() => {
            push('/warline');
            setMenuOpen(false);
          }}
          underlined={route === '/warline'}
          wrapperClassName={isMobile ? 'pb-32px' : 'mr-32px'}
        />
        <HeaderAndFooterButton
          label="Auction"
          onClick={() => {
            push('/auction');
            setMenuOpen(false);
          }}
          underlined={route.split('/').includes('auction')}
          wrapperClassName={isMobile ? 'pb-32px' : 'mr-32px'}
        />
        <HeaderAndFooterButton
          label="The Hall"
          onClick={() => {
            push('/hall');
            setMenuOpen(false);
          }}
          underlined={route === '/hall'}
          wrapperClassName={isMobile ? 'pb-32px' : 'mr-32px'}
        />
        <HeaderAndFooterButton
          label="About Us"
          onClick={() => {
            push('/about-us');
            setMenuOpen(false);
          }}
          underlined={route === '/about-us'}
          wrapperClassName={isMobile ? 'pb-32px' : 'mr-32px'}
        />
        {signerAddress && (
          <HeaderAndFooterButton
            label="My NFTs"
            onClick={() => {
              push('/tokens');
              setMenuOpen(false);
            }}
            underlined={route === '/tokens'}
            wrapperClassName={isMobile ? 'pb-32px' : 'mr-32px'}
          />
        )}
      </div>
      <div className={`flex items-center ${isTablet ? 'h-60px' : ''}`}>
        {!signerAddress ? (
          <Button
            mode="secondary"
            label={signerAddress ? truncateAddress(signerAddress) : 'Sign In'}
            onClick={
              signerAddress ? handleDisconnectWallet : handleConnectWallet
            }
            extraStyles={
              isMobile
                ? { width: '100%' }
                : { paddingTop: 10, paddingBottom: 10 }
            }
          />
        ) : (
          <div className="flex items-center">
            <span className="font-rlight text-14px mr-16px">
              {truncateAddress(signerAddress)}
            </span>
            <Button
              mode="secondary"
              round
              label={
                <img
                  src={
                    isDarkTheme ? '/img/logout-white.svg' : '/img/logout.svg'
                  }
                  alt="Logout"
                />
              }
              onClick={handleDisconnect}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuMobile;
