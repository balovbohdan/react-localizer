import * as T from '../types';
import {cloneDeep} from './clone-deep';

type Props = {
    shred?:string;
    loadedLang?:T.Lang;
    loadedLangAlias?:string;
};

export const prepareLoadedLang = ({shred, loadedLang, loadedLangAlias}:Props) => {
    let data = cloneDeep(loadedLang || {});

    if (shred)
        data = data[shred];

    if (loadedLangAlias)
        data = {
            [loadedLangAlias]: data
        };

    return data;
};