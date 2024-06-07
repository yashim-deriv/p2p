import { memo } from 'react';
import { TAdvertsTableRowRenderer } from 'types';
import { AdvertsTableRow, Table } from '@/components';
import { ADVERT_TYPE, BUY_SELL } from '@/constants';
import { api } from '@/hooks';
import { TSortByValues } from '@/utils';
import { DerivLightIcCashierNoAdsIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { ActionScreen, Loader, Text } from '@deriv-com/ui';

const columns = [
    { header: 'Advertisers' },
    { header: 'Limits' },
    { header: 'Rate (1 USD)' },
    { header: 'Payment methods' },
];

const headerRenderer = (header: string) => <span>{header}</span>;

type TBuySellTableRowRendererProps = {
    activeTab: string;
    searchValue: string;
    selectedCurrency: string;
    selectedPaymentMethods: string[];
    shouldUseClientLimits: boolean;
    sortDropdownValue: TSortByValues;
};

const BuySellTableRenderer = ({
    activeTab,
    searchValue,
    selectedCurrency,
    selectedPaymentMethods,
    shouldUseClientLimits,
    sortDropdownValue,
}: TBuySellTableRowRendererProps) => {
    const { localize } = useTranslations();

    const {
        data,
        isFetching,
        isPending: isLoading,
        loadMoreAdverts,
    } = api.advert.useGetList({
        advertiser_name: searchValue,
        counterparty_type: activeTab === ADVERT_TYPE.BUY ? BUY_SELL.BUY : BUY_SELL.SELL,
        local_currency: selectedCurrency,
        payment_method: selectedPaymentMethods.length > 0 ? selectedPaymentMethods : undefined,
        sort_by: sortDropdownValue,
        use_client_limits: shouldUseClientLimits ? 1 : 0,
    });

    if (isLoading) {
        return <Loader className='mt-80' />;
    }

    if ((!data && !searchValue) || (data?.length === 0 && !searchValue)) {
        return (
            <div className='mt-[5.5rem] lg:mt-10'>
                <ActionScreen
                    icon={<DerivLightIcCashierNoAdsIcon height='128px' width='128px' />}
                    title={
                        <Text weight='bold'>
                            <Localize i18n_default_text='No ads for this currency at the moment 😞' />
                        </Text>
                    }
                />
            </div>
        );
    }

    return (
        <Table
            columns={columns}
            data={data || []}
            emptyDataMessage={localize('There are no matching ads.')}
            isFetching={isFetching}
            loadMoreFunction={loadMoreAdverts}
            renderHeader={headerRenderer}
            rowRender={(data: unknown) => <AdvertsTableRow {...(data as TAdvertsTableRowRenderer)} />}
            tableClassname=''
        />
    );
};

export default memo(BuySellTableRenderer);
