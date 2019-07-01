import * as React from 'react';

import * as T from './types';
import {importLangFile} from './utils';
import {LoadingResult} from './LoadingResult';

type Props = {
    lang?:T.Lang;
    shred?:string;
    alias?:string;
    filesPath?:string;
    children?:React.ReactNode;
    getLangCode:T.LangCodeGetter;
    load?:T.LangLoader|T.LangLoader[];
};

export const Localizer = (props:Props) => {
    checkProps(props);

    const [lang, setLang] = React.useState(null);
    const [isImporting, setIsImporting] = React.useState(false);

    React.useEffect(() => {
        importData()
            .catch(e => console.warn(e));
    }, []);

    const importData = async () => {
        if (lang || isImporting) return;

        setIsImporting(true);

        const {load, filesPath, getLangCode} = props;

        const res = await importLangFile({
            load,
            filesPath,
            getLangCode
        });

        setLang(res);
        setIsImporting(false);
    };

    return <Content lang={lang} props={props}/>;
};

const Content = ({lang, props}) => {
    if (!lang)
        return null;

    return (
        <LoadingResult
            loadedLang={lang}
            shred={props.shred}
            parentLang={props.lang}
            loadedLangAlias={props.alias}>
            {props.children}
        </LoadingResult>
    );
};

const checkProps = (props:Props):void|never => {
    if (!props.getLangCode)
        throw new Error(`Got invalid 'getLangCode' property.`);
};