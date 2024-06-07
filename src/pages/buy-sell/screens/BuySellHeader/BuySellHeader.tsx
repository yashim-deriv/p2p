import clsx from 'clsx';
import { Search } from '@/components';
import { FilterModal } from '@/components/Modals';
import { ADVERT_TYPE, BUY_SELL, getSortByList } from '@/constants';
import { api } from '@/hooks';
import { useIsAdvertiserBarred, useModalManager, useQueryString } from '@/hooks/custom-hooks';
import { TSortByValues } from '@/utils';
import { LabelPairedBarsFilterMdBoldIcon, LabelPairedBarsFilterSmBoldIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { Button, Tab, Tabs, useDevice } from '@deriv-com/ui';
import { CurrencyDropdown, SortDropdown } from '../../components';
import './BuySellHeader.scss';

type TBuySellHeaderProps = {
    activeTab: string;
    searchValue: string;
    selectedCurrency: string;
    selectedPaymentMethods: string[];
    setActiveTab: (tab: string) => void;
    setIsFilterModalOpen: () => void;
    setSearchValue: (value: string) => void;
    setSelectedCurrency: (value: string) => void;
    setSelectedPaymentMethods: (value: string[]) => void;
    setShouldUseClientLimits: (value: boolean) => void;
    setSortDropdownValue: (value: TSortByValues) => void;
    shouldUseClientLimits: boolean;
    sortDropdownValue: TSortByValues;
};

const BuySellHeader = ({
    activeTab,
    searchValue,
    selectedCurrency,
    selectedPaymentMethods,
    setActiveTab,
    setIsFilterModalOpen,
    setSearchValue,
    setSelectedCurrency,
    setSelectedPaymentMethods,
    setShouldUseClientLimits,
    setSortDropdownValue,
    shouldUseClientLimits,
    sortDropdownValue,
}: TBuySellHeaderProps) => {
    const { hideModal, isModalOpenFor, showModal } = useModalManager({ shouldReinitializeModals: false });
    const { localize } = useTranslations();
    const { isMobile } = useDevice();
    const isAdvertiserBarred = useIsAdvertiserBarred();
    const { setQueryString } = useQueryString();

    api.advert.useGetList({
        advertiser_name: searchValue,
        counterparty_type: activeTab === ADVERT_TYPE.BUY ? BUY_SELL.BUY : BUY_SELL.SELL,
        local_currency: selectedCurrency,
        payment_method: selectedPaymentMethods.length > 0 ? selectedPaymentMethods : undefined,
        sort_by: sortDropdownValue,
        use_client_limits: shouldUseClientLimits ? 1 : 0,
    });

    return (
        <div
            className={clsx('buy-sell-header', {
                'buy-sell-header--has-border': isMobile && !isAdvertiserBarred,
            })}
            data-testid='dt_buy_sell_header'
        >
            <Tabs
                TitleFontSize={isMobile ? 'md' : 'sm'}
                activeTab={activeTab}
                onChange={tab => {
                    if (tab === 0) {
                        setActiveTab('Buy');
                        setQueryString({ tab: BUY_SELL.BUY });
                    } else {
                        setActiveTab('Sell');
                        setQueryString({ tab: BUY_SELL.SELL });
                    }
                }}
                variant='primary'
                wrapperClassName='buy-sell-header__tabs'
            >
                <Tab title={localize('Buy')} />
                <Tab title={localize('Sell')} />
            </Tabs>
            <div className='buy-sell-header__row'>
                <div className='flex flex-row-reverse lg:flex-row gap-4'>
                    <CurrencyDropdown selectedCurrency={selectedCurrency} setSelectedCurrency={setSelectedCurrency} />
                    <div className='buy-sell-header__row-search'>
                        <Search
                            name='search-nickname'
                            onSearch={setSearchValue}
                            placeholder={isMobile ? localize('Search') : localize('Search by nickname')}
                        />
                    </div>
                </div>
                <SortDropdown
                    list={getSortByList(localize)}
                    onSelect={setSortDropdownValue}
                    setIsFilterModalOpen={setIsFilterModalOpen}
                    value={sortDropdownValue}
                />
                <Button
                    className='!border-[#d6dadb] border-[1px] lg:p-0 lg:h-16 lg:w-16 h-[3.2rem] w-[3.2rem]'
                    color='black'
                    icon={
                        isMobile ? (
                            <LabelPairedBarsFilterSmBoldIcon
                                className='absolute'
                                data-testid='dt_buy_sell_header_filter_button'
                            />
                        ) : (
                            <LabelPairedBarsFilterMdBoldIcon />
                        )
                    }
                    onClick={() => showModal('FilterModal')}
                    variant='outlined'
                />
            </div>
            {isModalOpenFor('FilterModal') && (
                <FilterModal
                    isModalOpen
                    isToggled={shouldUseClientLimits}
                    onRequestClose={hideModal}
                    onToggle={setShouldUseClientLimits}
                    selectedPaymentMethods={selectedPaymentMethods}
                    setSelectedPaymentMethods={setSelectedPaymentMethods}
                />
            )}
        </div>
    );
};

export default BuySellHeader;
