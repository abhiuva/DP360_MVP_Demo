const { getMySqlPromiseConnection } = require("../config/mysql.db")
const { escape } = require("mysql2")
exports.doSupplierExistDB = async (phone, tenantId) => {
    const conn = await getMySqlPromiseConnection();
    try {

        const sql = `
        SELECT phone, name FROM customers
        WHERE name = ? AND tenant_id = ?
        LIMIT 1;
        `;

        const [result] = await conn.query(sql, [phone, tenantId]);

        return result.length > 0;
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        conn.release();
    }
};

exports.addSupplierDB = async (phone, name, email, address, tenantId) => {
    const conn = await getMySqlPromiseConnection();
    try {

        const sql = `
        INSERT INTO suppliers
        (phone, name, email, address, tenant_id)
        VALUES
        (?, ?, ?, ?, ?);
        `;

        const [result] = await conn.query(sql, [phone, name, email, address, tenantId]);

        return result.insertId;
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        conn.release();
    }
};

exports.getSuppliersDB = async(page, perPage, sort, filter, tenantId) => {
    const conn = await getMySqlPromiseConnection();
    try {

        // Validate and sanitize inputs
        const currentPage = parseInt(page) || 1;
        const limit = parseInt(perPage) || 10; // Define default page size
        const offset = (currentPage - 1) * limit;
        const sortedBy = sort ? `ORDER BY ${escape(sort)}` : 'ORDER BY created_at DESC'; // Add sorting based on query param

        // Build filter query based on 'filter' param (use appropriate library for complex filters)
        const filterQuery = filter ? `WHERE (name LIKE '${filter}%' OR phone='${filter}') AND tenant_id=${tenantId}` : `WHERE tenant_id=${tenantId}`;

        const [suppliers] = await conn.execute(
            `SELECT phone, name, email, address, created_at FROM suppliers ${filterQuery} ${sortedBy} LIMIT ${limit} OFFSET ${offset} ;`
        );

        // Prepared statement for total supplier count
        const [totalSuppliers] = await conn.execute(
            `SELECT COUNT(*) AS total FROM suppliers ${filterQuery} ;`
        );

        // Prepare response data
        const response = {
            suppliers,
            currentPage,
            perPage,
            totalPages: Math.ceil(totalSuppliers[0].total / limit),
            totalSuppliers: totalSuppliers[0].total
        };

        return response;
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        conn.release();
    }
}

exports.getSupplierrDB = async(name, tenantId) => {
    const conn = await getMySqlPromiseConnection();
    try {

        const [result] = await conn.execute(
            `SELECT phone, name, email, address, created_at FROM suppliers
            WHERE name = ? AND tenant_id = ?
            LIMIT 1;`,
            [name, tenantId]
        );

        return result[0];
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        conn.release();
    }
}

exports.searchSupplierDB = async(searchString, tenantId) => {
    const conn = await getMySqlPromiseConnection();
    try {

        const [result] = await conn.execute(
            `
            SELECT phone, name, email, address, created_at FROM suppliers
            WHERE (phone LIKE ? OR name LIKE ?) AND tenant_id = ?
            LIMIT 10
            ;`,
            [`${searchString}%`, `%${searchString}%`, tenantId]
        );

        return result;
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        conn.release();
    }
}

exports.updateSupplierDB = async (phone, name, email, address, tenantId) => {
    const conn = await getMySqlPromiseConnection();
    try {

        const sql = `
        UPDATE suppliers
        SET
        name = ?, email = ?, address = ?, phone = ?
        WHERE name = ? AND tenant_id = ?
        `;

        await conn.query(sql, [name, email, address, phone, name, tenantId]);
        return;
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        conn.release();
    }
};

exports.deleteSupplierDB = async (name, tenantId) => {
    const conn = await getMySqlPromiseConnection();
    try {

        const sql = `
        DELETE FROM suppliers
        WHERE name = ? AND tenant_id = ?;
        `;

        await conn.query(sql, [name, tenantId]);

        return;
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        conn.release();
    }
};
