import {merge} from 'lodash';

import {getLangCode} from '@lib/lang/utils/lang-code-getter';

/**
 * @param props
 *     @param {string} [props.filesPath]
 *     @param {Function|Function[]} [props.load]
 */
export const importLangFile = async props => {
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

const importByHelper = async props => {
    const lang = getLangCode();

    return props.load(lang);
};

const importByByHelpers = async props => {
    const lang = getLangCode();
    const promises = props.load.map(f => f(lang));

    const res = await Promise.all(promises);

    return {
        default: merge(...res)
    };
};

const importByFilesPath = async props => {
    const lang = getLangCode();

    return import(`${props.filesPath}${lang}.json`);
};