import * as T from '../types';

type Props = {
    filesPath?:string;
    getLangCode:T.LangCodeGetter;
    load?:T.LangLoader|T.LangLoader[];
};

export const importLangFile = async (props:Props) => {
    checkProps(props);

    const res = await doImport(props);

    return res.default;
};

const doImport = props => {
    const {load} = props;

    if (typeof load === 'function')
        return importByHelper(props);

    if (Array.isArray(load))
        return importByByHelpers(props);

    return importByFilesPath(props);
};

const importByHelper = async ({load, getLangCode}) => {
    const lang = await getLangCode();

    return load(lang);
};

const importByByHelpers = async ({load, getLangCode}) => {
    const lang = await getLangCode();
    const promises = load.map(f => f(lang));

    const res = await Promise.all(promises);

    return {
        default: Object.assign({}, ...res)
    };
};

const importByFilesPath = async ({filesPath, getLangCode}) => {
    const lang = await getLangCode();

    return import(`${filesPath}${lang}.json`);
};

const checkProps = (props:Props):void|never => {
    if (typeof props.getLangCode !== 'function')
        throw new Error(`Got invalid 'getLangCode' property.`);
};