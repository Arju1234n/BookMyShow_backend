const { Admin } = require('./collections');
const { normalizeDoc } = require('./utils');

const AdminModel = {
    create: async (adminData, callback) => {
        try {
            const doc = await Admin.create({
                name: adminData.name,
                email: adminData.email,
                password: adminData.password
            });
            callback(null, { insertId: doc._id.toString() });
        } catch (err) {
            callback(err);
        }
    },
    findByEmail: async (email, callback) => {
        try {
            const doc = await Admin.findOne({ email: email.toLowerCase() }).lean();
            if (!doc) return callback(null, []);
            const normalized = normalizeDoc(doc, 'admin_id');
            callback(null, [normalized]);
        } catch (err) {
            callback(err);
        }
    }
};

module.exports = AdminModel;
