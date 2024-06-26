import { useCallback } from 'react';
import useAdvertiserRelations from './useAdvertiserRelations';

/** This hook unblocks advertisers of the current user by passing the advertiser id. */
const useAdvertiserRelationsRemoveBlocked = () => {
    const { data, mutate, ...rest } = useAdvertiserRelations();

    const removeBlockedAdvertiser = useCallback((id: number[]) => mutate({ remove_blocked: id }), [mutate]);

    return {
        data,
        /** Sends a request to unblock advertiser of the current user by passing the advertiser id. */
        mutate: removeBlockedAdvertiser,
        ...rest,
    };
};

export default useAdvertiserRelationsRemoveBlocked;
