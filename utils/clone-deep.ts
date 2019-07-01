type Obj = {[key:string]:any};

export const cloneDeep = (obj:Obj) =>
    JSON.parse(JSON.stringify(obj));