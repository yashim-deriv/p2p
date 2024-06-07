import { useEffect, useState } from 'react';
import { RadioGroupFilterModal } from '@/components/Modals';
import { ADVERT_TYPE, getSortByList } from '@/constants';
import { api } from '@/hooks';
import { useModalManager, useQueryString } from '@/hooks/custom-hooks';
import { TSortByValues } from '@/utils';
import { useTranslations } from '@deriv-com/translations';
import { BuySellHeader } from '../BuySellHeader';
import { BuySellTableRenderer } from './BuySellTableRenderer';
import './BuySellTable.scss';

const BuySellTable = () => {
    const { localize } = useTranslations();
    const { hideModal, isModalOpenFor, showModal } = useModalManager({ shouldReinitializeModals: false });
    const { data: p2pSettingsData } = api.settings.useSettings();
    const { queryString } = useQueryString();

    const [activeTab, setActiveTab] = useState<string>(queryString.tab || ADVERT_TYPE.BUY);
    const [selectedCurrency, setSelectedCurrency] = useState<string>(p2pSettingsData?.localCurrency || '');
    const [sortDropdownValue, setSortDropdownValue] = useState<TSortByValues>('rate');
    const [searchValue, setSearchValue] = useState<string>('');
    const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([]);
    const [shouldUseClientLimits, setShouldUseClientLimits] = useState<boolean>(true);

    const onToggle = (value: string) => {
        setSortDropdownValue(value as TSortByValues);
        hideModal();
    };

    useEffect(() => {
        if (p2pSettingsData?.localCurrency) setSelectedCurrency(p2pSettingsData.localCurrency);
    }, [p2pSettingsData?.localCurrency]);

    return (
        <div className='buy-sell-table h-full w-full relative flex flex-col'>
            <BuySellHeader
                activeTab={activeTab}
                searchValue={searchValue}
                selectedCurrency={selectedCurrency}
                selectedPaymentMethods={selectedPaymentMethods}
                setActiveTab={setActiveTab}
                setIsFilterModalOpen={() => showModal('RadioGroupFilterModal')}
                setSearchValue={setSearchValue}
                setSelectedCurrency={setSelectedCurrency}
                setSelectedPaymentMethods={setSelectedPaymentMethods}
                setShouldUseClientLimits={setShouldUseClientLimits}
                setSortDropdownValue={setSortDropdownValue}
                shouldUseClientLimits={shouldUseClientLimits}
                sortDropdownValue={sortDropdownValue}
            />
            <BuySellTableRenderer
                activeTab={activeTab}
                searchValue={searchValue}
                selectedCurrency={selectedCurrency}
                selectedPaymentMethods={selectedPaymentMethods}
                shouldUseClientLimits={shouldUseClientLimits}
                sortDropdownValue={sortDropdownValue}
            />

            {isModalOpenFor('RadioGroupFilterModal') && (
                <RadioGroupFilterModal
                    isModalOpen
                    list={getSortByList(localize)}
                    onRequestClose={hideModal}
                    onToggle={onToggle}
                    selected={sortDropdownValue as string}
                />
            )}
        </div>
    );
};

export default BuySellTable;
