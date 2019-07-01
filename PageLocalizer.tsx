import React from 'react';

import * as T from './types';
import {Localizer} from './Localizer';

type Props = {
    page:string;
    shred?:string;
    filesRoot?:string;
    children?:React.ReactNode;
    getLangCode:T.LangCodeGetter;
};

export const PageLocalizer = (props:Props) => {
    const load = createLoader({
        page: props.page,
        filesRoot: props.filesRoot
    });

    return (
        <Localizer {...props} load={load} getLangCode={props.getLangCode}>
            {props.children}
        </Localizer>
    );
};

const createLoader = ({page, filesRoot}) =>
    (langCode:string):Promise<T.Lang> =>
        import(`${filesRoot}${page}/${langCode}`);