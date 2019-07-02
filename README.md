# About
`react-localizer` was developed to allow developers to create localization in quick and easy way.
The only manual work you have to perform: create language files and simple `loaders`.
This module was tested within several big projects in **AMAKids.Dev** company and showed great results.
We have formed some good practices in implementing localization using this module, and they will be described below.

# Installation
```bash
npm i --save react-localizer
```

# API
### Localizer.tsx
|Property|Required|Type|Description|
|-|-|-|-|
|load|Yes|LangLoader|Function that loads language data (async).|
|getLangCode|Yes|LangCodeGetter|Function that returns language code (async).|
|lang|Not|Lang|Language data.|
|shred|Not|string|Name of language data shred to use as language data. This is simply name of sub-object to use as language data.|
|alias|Not|string|Language data will appear in resulting language object as sub-object with this name.|

### PageLocalizer.tsx
|Property|Required|Type|Description|
|-|-|-|-|
|page|Yes|string|Page name.|
|load|Yes|Loader|Function that loads language data (async).|
|getLangCode|Yes|LangCodeGetter|Function that returns language code (async).|
|shred|No|string|Name of language data shred to use as language data. This is simply name of sub-object to use as language data.|

# Usage
Let's look at several usage variants that may be useful for you projects.
<br>
Here are some notes you have to remember:
* Language modules must be as independent as possible (i.e. 'isolated'). This means you have to create
language modules that are appropriate to some components. Such components are reusable
and can be used for creating your own multilanguage components library.
* Sometimes it is useful to create language modules for pages. In this case one language
module is bound with one page. This must be created for some non-reusable components.
But isolated components with isolated language modules are preferable.

### Isolated language modules
You have to prefer this method in most of cases because it allows you and your team
to create isolated components that are easy to reuse.
<br>
Imagine you have `Header` component and this folders structure:
```
.
├── index.ts
└── components
    └── header
        ├── Header.tsx
        ├── index.ts
        └── lang
            ├── en.json
            ├── fr.json
            └── ...
```
Simple code of `Header` component might look like:
```typescript
// @components/header/Header.tsx

import * as React from 'react';
import {Localizer, Lang} from 'react-localizer';

import {getLangCode} from '@lib';

type Props = {
    lang?:Lang;
    user:{
        name:string;
    };
};

export const Header = (props:Props) =>
    <Loc>
        <Body {...props}/>
    </Loc>;
    
const Loc = () => {
    const load = (langCode:string) =>
        import(`./lang/${langCode}`);
    
    return (
        <Localizer load={load} getLangCode={getLangCode}>
            {props.children}
        </Localizer>
    );
};
    
const Body = (props:Props) =>
    <div className='Header'>
        <h1>{props.lang.header}</h1>
        <h2>{props.user.name}</h2>
    </div>;
```
Let's understand this code.
<br>
* `Body` component is header you want to render.
* `Loc` is component that provides localization. It will add `lang` property
to `Body`'s <i>props</i>.
* `Header` is container component that combines `Loc` and `Body`.
<br>
Rather easy and clear. Is it?

### Page language modules
If you need you can create language modules bound to pages. We highly recommend
implement your own `PageLoc` component using `react-localizer`'s `PageLocalizer`
component. This is good practice. Let's look at simple example.
<br>
Firstly you have to create `assets` directory with language files appropriate to pages.
```
.
└── assets
    └── lang
        └── pages
            ├── main
            |   ├── en.json
            |   ├── fr.json
            |   └── ...
            └── payments
                ├── en.json
                ├── fr.json
                └── ...
```
Next you have to implement `PageLoc` component.
```typescript
// @components/PageLoc.tsx

import * as React from 'react';
import {PageLocalizer} from 'react-localizer';

import {getLangCode} from '@lib';

type Props = {
    page:string;
    shred?:string;
    children?:React.ReactNode;
};

export const PageLoc = (props:Props) =>
    <Localizer {...props} load={load} getLangCode={getLangCode}>
        {props.children}
    </Localizer>;

const load = ({page, langCode}) =>
    import(`@assets/lang/pages/${page}/${langCode}`);
```
Now imagine you have `Main.tsx` component that is root component for the _main_ page.
You will have similar files structure:
```
.
├──components
|  ├── PageLoc.tsx
|  └── ...
└── pages
    ├── main
    |   ├── Main.tsx
    |   ├── Loc.tsx
    |   └── ...
    └── payments
        ├── Payments.tsx
        ├── Loc.tsx
        └── ...
```
Your next aim is to create localizer component for the main page.
```typescript
// @pages/main/Loc.tsx

import * as React from 'react';

import {PageLoc} from '@components';

type Props = {
    children:React.ReactNode;
};

export const Loc = (props:Props) =>
    <PageLoc page='main'>
        {props.children}
    </PageLoc>;
```
Now we are ready to implement multilanguage `Main.tsx` component that is root component for
the _main_ page. Let's go.
```typescript
// @pages/main/Main.tsx

import * as React from 'react';
import {Lang} from 'react-localizer';

import {Loc} from './Loc';

type Props = {
    lang?:Lang;
    user:{
        name:string;
    };
};

export const Main = (props:Props) =>
    <Loc>
        <Body {...props}/>
    </Loc>;
    
const Body = (props:Props) =>
    <div className='Main'>
        <h1>{props.lang.hello}</h1>
        <h2>{props.lang.user}: {props.user.name}</h2>
    </div>;
```

## Language code getter
As you can see `react-localizer` requires `getLangCode` function that provides
current language code of your application. Notice that this function must be _async_.
It is easy to implement. Better place for this function is root _lib_ directory.
(We always create `@lib` alias for this one for quick access.)
```
.
└── lib
    ├── lang-code-getter.ts
    └── ...
```
```typescript
// @lib/lang-code-getter.ts

export const getLangCode = async () =>
    window.localStorage.getItem('langCode')
        || 'en';
```
In some cases language code getter might be rather complicated. For example, there
is one of our `getLangCode` function we use in `NeuroClub` project.
```typescript
import {Config} from 'global-config';

import {store} from '@store';
import {Utils} from '@lib/page-router';

export const getLangCodeAsync = async () =>
    getLangCode();

export const getLangCode = () =>
    Utils.hasBaseData()
        ? getForPageWithBaseData()
        : getForPageWithNoBaseData();

const getForPageWithNoBaseData = () => {
    try {
        return window.localStorage.getItem(Config.LOCAL_LANG_CODE_NAME)
            || Config.DEF_LANG_CODE;
    } catch (e) {
        return Config.DEF_LANG_CODE;
    }
};

const getForPageWithBaseData = () => {
    try {
        const state = store.getState();
        const {langCode} = state.user.user;

        return langCode || Config.DEF_LANG_CODE;
    } catch (e) {
        return Config.DEF_LANG_CODE;
    }
};

export default getLangCode;
```

# GitHub repository
https://github.com/balovbohdan/ts-react-loc

# Contributing
Pull requests and forks are welcome. You can use this code freely for
your own projects and/or experiments. If you have some questions or proposals
feel free to write message.

# License
[MIT](https://choosealicense.com/licenses/mit/)