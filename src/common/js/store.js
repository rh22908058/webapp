/*数据的存取*/
/*存储数据，保存id商家下的一组键值对*/
export function saveToLocal(id, key, val) {
    /*获取localStorage的seller属性，这是一个JSON字符串*/
    let seller = localStorage.__seller__

    /*数据结构是seller对象下保存有所有以所有商家id为键的对象，其对象下面保存有对应商家参数属性的键值对*/
    /*如果localstorge中没有seller，初始化；如果有，追加*/
    if (!seller) {
        seller = {}
        seller[id] = {}
    } else {
        seller = JSON.parse(seller)
            /*如果是不同商家，新建商家键值对*/
        if (!seller[id]) {
            seller[id] = {}
        }
    }
    seller[id][key] = val

    /*localStorage不允许直接存储对象，必须是JSON字符串*/
    localStorage.__seller__ = JSON.stringify(seller)
}
/*读取数据，读取id商家下的一组键值对，def为默认读取*/
export function loadFromLocal(id, key, def) {
    let seller = localStorage.__seller__
    if (!seller) {
        return def
    }
    seller = JSON.parse(seller)[id]
    if (!seller) {
        return def
    }
    let ret = seller[key]
    return ret || def
}