import {merge, cloneDeep} from 'lodash';
import React, {useState, useEffect} from 'react';

import {PropsToChildren} from '@components-common/props-to-children';

import {importLangFile} from './utils/lang-file-importer';

/**
 * @param props
 *     @param [props.lang]
 *     @param {string} [props.shred]
 *     @param {string} [props.alias]
 *     @param {string} [props.filesPath]
 *     @param {React.ReactNode} props.children
 *     @param {Function|Function[]} [props.load]
 */
export const Localizer = props => {
    const [lang, setLang] = useState(null);
    const [isImporting, setIsImporting] = useState(false);

    useEffect(() => {
        importData(props)
            .catch(e => console.error(e));
    }, []);

    const importData = async props => {
        if (lang || isImporting) return;

        setIsImporting(true);

        const {load, filesPath} = props;

        const res = await importLangFile({
            load,
            filesPath
        });

        setLang(res);
        setIsImporting(false);
    };

    if (!lang)
        return null;

    return (
        <Result
            loadedLang={lang}
            shred={props.shred}
            parentLang={props.lang}
            loadedLangAlias={props.alias}>
            {props.children}
        </Result>
    );
};

/**
 * @param props
 *     @param props.loadedLang
 *     @param [props.parentLang]
 *     @param {string} [props.shred]
 *     @param [props.loadedLangAlias]
 *     @param {React.ReactNode} props.children
 */
const Result = props => {
    const loadedLang = prepareLoadedLang(props);

    const lang = merge(
        loadedLang,
        props.parentLang
    );

    return (
        <PropsToChildren props={{lang}}>
            {props.children}
        </PropsToChildren>
    );
};

/**
 * @param props
 *     @param [props.loadedLang]
 *     @param {string} [props.shred]
 *     @param [props.loadedLangAlias]
 */
const prepareLoadedLang = ({shred, loadedLang, loadedLangAlias}) => {
    loadedLang = cloneDeep(loadedLang);

    if (shred)
        loadedLang = loadedLang[shred];

    if (loadedLangAlias)
        loadedLang = {
            [loadedLangAlias]: loadedLang
        };

    return loadedLang;
};