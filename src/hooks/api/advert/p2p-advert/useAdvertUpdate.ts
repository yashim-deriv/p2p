import { useCallback, useMemo } from 'react';
import { useP2pAdvertUpdate } from '@deriv-com/api-hooks';
import useInvalidateQuery from '../../useInvalidateQuery';

type TPayload = Parameters<ReturnType<typeof useP2pAdvertUpdate>['mutate']>[number];

/** A custom hook that updates a P2P advert. This can only be used by an approved P2P advertiser.
 * 
 * To update an advert, specify the payload arguments that should be updated, for instance:
 * @example
 *  mutate({
        "id": 1234, // required
        "is_active": 0 // optional
    });
 * 
*/
const useAdvertUpdate = () => {
    const invalidate = useInvalidateQuery();
    const {
        data,
        mutate: _mutate,
        ...rest
    } = useP2pAdvertUpdate({
        onSuccess: () => {
            invalidate('p2p_advert_list');
            invalidate('p2p_advertiser_adverts');
        },
    });

    const mutate = useCallback((payload: TPayload) => _mutate(payload), [_mutate]);

    const modified_data = useMemo(() => {
        const p2p_advert_update = data;
        if (!p2p_advert_update) return undefined;

        return {
            ...p2p_advert_update,
            /** The activation status of the advert. */
            is_active: Boolean(p2p_advert_update.is_active),
            /** Indicates if this is block trade advert or not. */
            is_block_trade: Boolean(p2p_advert_update.block_trade),
            /** Indicates that the advert has been deleted. */
            is_deleted: Boolean(p2p_advert_update.deleted),
            /** Indicates that this advert will appear on the main advert list. */
            is_visible: Boolean(p2p_advert_update.is_visible),
        };
    }, [data]);

    return {
        data: modified_data,
        mutate,
        ...rest,
    };
};

export default useAdvertUpdate;
