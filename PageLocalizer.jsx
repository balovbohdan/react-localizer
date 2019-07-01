import React from 'react';

import {Localizer} from './Localizer';

/**
 * @param props
 *     @param {string} props.page
 *     @param {string} [props.shred]
 *     @param {React.ReactNode} props.children
 */
export const PageLocalizer = props => {
    const load = createLoader(props);

    return (
        <Localizer {...props} load={load}>
            {props.children}
        </Localizer>
    );
};

const createLoader = props =>
    langCode =>
        import(`@assets/langs/pages/${props.page}/${langCode}.json`);