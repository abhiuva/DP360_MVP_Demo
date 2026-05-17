const { doCustomerExistDB, addCustomerDB, getCustomersDB, updateCustomerDB, deleteCustomerDB, getCustomerDB, searchCustomerDB } = require("../services/customer.service");

exports.addCustomer = async (req, res) => {
    try {
        const tenantId = req.user.tenant_id;

        const phone = req.body.phone;
        const name = req.body.name;
        const email = req.body.email;
        const birthDate = req.body.birthDate;
        const gender = req.body.gender;
        const isMember = req.body.isMember;

        if(!(name)) {
            return res.status(400).json({
                success: false,
                message: "Please provide required details: Name!"
            });
        }

        const doCustomerExist = await doCustomerExistDB(email, tenantId);

        if(doCustomerExist) {
            return res.status(400).json({
                success: false,
                message: `Customer with email: ${email} Already exists!`
            });
        }

        await addCustomerDB(phone, name, email, birthDate, gender, isMember, tenantId);

        return res.status(200).json({
            success: true,
            message: `Customer: ${name} added.`
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try later!"
        });
    }
};

exports.getCustomers = async (req, res) => {
    try {
        const tenantId = req.user.tenant_id;

        const { page, perPage, sort, filter } = req.query;

        const result = await getCustomersDB(page, perPage, sort, filter, tenantId);

        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try later!"
        });
    }
};

exports.updateCustomer = async (req, res) => {
    try {
        const tenantId = req.user.tenant_id;

        const id = req.params.id;
        const phone = req.body.phone;
        const name = req.body.name;
        const email = req.body.email;
        const birthDate = req.body.birthDate;
        const gender = req.body.gender;

        if(!(name)) {
            return res.status(400).json({
                success: false,
                message: "Please provide required details: Name!"
            });
        }

        await updateCustomerDB(id, phone, name, email, birthDate, gender, tenantId);

        return res.status(200).json({
            success: true,
            message: `Customer: ${name} Details Updated.`
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try later!"
        });
    }
};


exports.deleteCustomer = async (req, res) => {
    try {
        const tenantId = req.user.tenant_id;
        const id = req.params.id;

        await deleteCustomerDB(id, tenantId);

        return res.status(200).json({
            success: true,
            message: `Customer: ${id} Deleted.`
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try later!"
        });
    }
};

exports.getCustomer = async (req, res) => {
    try {
        const tenantId = req.user.tenant_id;

        const id = req.params.id;

        const result = await getCustomerDB(id, tenantId);

        if(result) {
            return res.status(200).json(result);
        }
        return res.status(404).json({
            success: false,
            message: `No Customer found with id: ${id}`
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try later!"
        });
    }
};

exports.searchCustomer = async (req, res) => {
    try {
        const tenantId = req.user.tenant_id;

        const searchString = req.query.q;

        const result = await searchCustomerDB(searchString, tenantId);

        if(result.length > 0) {
            return res.status(200).json(result);
        }
        return res.status(404).json({
            success: false,
            message: `No Customers found!`
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try later!"
        });
    }
};
