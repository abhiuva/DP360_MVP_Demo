const { getTodaysTopSellingItemsDB, getTodaysOrdersCountDB, getTodaysNewCustomerCountDB, getTodaysRepeatCustomerCountDB } = require("../services/dashboard.service");
const { getReservationsDB } = require("../services/reservation.service");
const { getCurrencyDB } = require("../services/settings.service");
const {
    getDashboardEngineDB,
    getDashboardWidgetsDB,
    saveDashboardPreferenceDB,
    getDashboardWidgetDataDB,
} = require("../services/dashboard_widget.service");

exports.getDashboardData = async (req, res) => {
    try {
        const tenantId = req.user.tenant_id;
        
        const [ reservations, topSellingItems, ordersCount, newCustomerCount, repeatedCustomerCount, currency ] = await Promise.all([
            getReservationsDB("today", null, null, tenantId),
            getTodaysTopSellingItemsDB(tenantId),
            getTodaysOrdersCountDB(tenantId),
            getTodaysNewCustomerCountDB(tenantId),
            getTodaysRepeatCustomerCountDB(tenantId),
            getCurrencyDB(tenantId)
        ]);

        return res.status(200).json({
            reservations, topSellingItems, ordersCount, newCustomerCount, repeatedCustomerCount, currency
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try later!"
        });
    }
};

exports.getDashboardEngine = async (req, res) => {
    try {
        const tenantId = req.user.tenant_id;
        const [data, currency] = await Promise.all([
            getDashboardEngineDB(tenantId, req.user),
            getCurrencyDB(tenantId),
        ]);
        return res.status(200).json({ ...data, currency });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try later!"
        });
    }
};

exports.getDashboardWidgets = async (req, res) => {
    try {
        const tenantId = req.user.tenant_id;
        const data = await getDashboardWidgetsDB(tenantId, req.user);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try later!"
        });
    }
};

exports.getDashboardWidgetData = async (req, res) => {
    try {
        const tenantId = req.user.tenant_id;
        const widgetKeys = new String(req.query.widgetKeys || "")
            .split(",")
            .map((key) => key.trim())
            .filter(Boolean);

        const data = await getDashboardWidgetDataDB(tenantId, req.user, widgetKeys);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try later!"
        });
    }
};

exports.saveDashboardPreferences = async (req, res) => {
    try {
        const tenantId = req.user.tenant_id;
        const username = req.user.username;
        const { selectedWidgetKeys, layout } = req.body;

        if (!Array.isArray(selectedWidgetKeys) || !layout || typeof layout !== "object") {
            return res.status(400).json({
                success: false,
                message: "Please provide selectedWidgetKeys and layout."
            });
        }

        await saveDashboardPreferenceDB(tenantId, username, selectedWidgetKeys, layout);
        return res.status(200).json({
            success: true,
            message: "Dashboard preferences saved."
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try later!"
        });
    }
};
