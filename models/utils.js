const toIdString = (value) => {
    if (!value) return value;
    if (typeof value === 'string') return value;
    if (value.toString) return value.toString();
    return value;
};

const normalizeDoc = (doc, idField) => {
    if (!doc) return doc;
    const obj = doc.toObject ? doc.toObject({ virtuals: false }) : { ...doc };
    if (obj._id !== undefined) {
        obj[idField] = toIdString(obj._id);
        delete obj._id;
    }
    delete obj.__v;
    return obj;
};

module.exports = { toIdString, normalizeDoc };
