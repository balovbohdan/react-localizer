import * as React from 'react';

import * as T from './types';
import {Localizer} from './Localizer';

type Props = {
    load:Loader;
    page:string;
    shred?:string;
    children?:React.ReactNode;
    getLangCode:T.LangCodeGetter;
};

type Loader = (page:string)=>Promise<T.Lang>;

export const PageLocalizer = (props:Props) => {
    checkProps(props);

    const load = createLoader(props);

    return (
        <Localizer {...props} load={load}>
            {props.children}
        </Localizer>
    );
};

const createLoader = ({load, page}:Props) =>
    () => load(page);

const checkProps = (props:Props):void|null => {
    if (!props.page)
        throw new Error(`Got invalid 'page' property.`);

    if (typeof props.getLangCode !== 'function')
        throw new Error(`For invalid 'getLangCode' property.`);
};