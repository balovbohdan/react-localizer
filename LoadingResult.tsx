import * as React from 'react';

import * as T from './types';
import {prepareLoadedLang} from './utils';
import {PropsToChildren} from './PropsToChildern';

type Props = {
    shred?:string;
    loadedLang:T.Lang;
    parentLang?:T.Lang;
    loadedLangAlias?:string;
    children?:React.ReactNode;
};

export const LoadingResult = (props:Props) => {
    const loadedLang = prepareLoadedLang(props);

    const lang = Object.assign(
        loadedLang,
        props.parentLang
    );

    return (
        <PropsToChildren props={{lang}}>
            {props.children}
        </PropsToChildren>
    );
};