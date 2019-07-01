export type LangLoader = (langCode:string)=>Promise<string|Lang|any>;
export type Lang = {[key:string]:any};
export type LangCodeGetter = ()=>Promise<string>;