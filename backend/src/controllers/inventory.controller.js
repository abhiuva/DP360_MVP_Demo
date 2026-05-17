const { addInventoryItemDB, updateInventoryItemDB, deleteInventoryItemDB, getAllInventoryItemsDB, getInventoryItemDB, updateInventoryItemImageDB } = require("../services/inventory.service");
const {
    getInventoryUnitsDB,
    getRecipeByMenuItemDB,
    saveRecipeDB,
    deleteRecipeDB,
    adjustInventoryStockDB,
    receivePurchaseDB,
} = require("../services/inventory_management.service");

const path = require("path")
const fs = require("fs");

exports.addInventoryItem = async (req, res) => {
    try {
        const tenantId = req.user.tenant_id;
        const { title, categoryId, quantity, supplier_name, stock_alert_quantity } = req.body;

        if (!(title && categoryId && quantity)) {
            return res.status(400).json({
                success: false,
                message: "Please provide required details: title, categoryId, quantity, stock_alert_quantity"
            });
        }

        const InventoryItemId = await addInventoryItemDB(title, categoryId, quantity, supplier_name, stock_alert_quantity, tenantId);

        return res.status(200).json({
            success: true,
            message: "Inventory Item Added.",
            InventoryItemId
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try later!"
        });
    }
};

exports.updateInventoryItem = async (req, res) => {
    try {
        const tenantId = req.user.tenant_id;
        const id = req.params.id;
        const { title, categoryId, quantity, supplier_name, stock_alert_quantity } = req.body;

        if (!(title && categoryId && quantity && stock_alert_quantity)) {
            return res.status(400).json({
                success: false,
                message: "Please provide required details: title, categoryId, quantity, StockAlertQuantity"
            });
        }

        await updateInventoryItemDB(id, title, quantity, categoryId, tenantId, supplier_name, stock_alert_quantity);

        return res.status(200).json({
            success: true,
            message: "Inventory Item Updated."
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try later!"
        });
    }
};

exports.uploadInventoryItemPhoto = async (req, res) => {
    try {
        const tenantId = req.user.tenant_id;
        const id = req.params.id;

        const file = req.files.image;

        const imagePath = path.join(__dirname, `../../inventory/${tenantId}/`) + id;

        if (!fs.existsSync(path.join(__dirname, `../../inventory/${tenantId}/`))) {
            fs.mkdirSync(path.join(__dirname, `../../inventory/${tenantId}/`));
        }

        const imageURL = `/inventory/${tenantId}/${id}`;

        await file.mv(imagePath);
        await updateInventoryItemImageDB(id, imageURL, tenantId);

        return res.status(200).json({
            success: true,
            message: "Inventory Item Image Uploaded.",
            imageURL: imageURL
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try later!"
        });
    }
};

exports.removeInventoryItemPhoto = async (req, res) => {
    try {
        const tenantId = req.user.tenant_id;
        const id = req.params.id;
        const imagePath = path.join(__dirname, `../../inventory/${tenantId}/`) + id;

        fs.unlinkSync(imagePath)

        await updateInventoryItemImageDB(id, null, tenantId);

        return res.status(200).json({
            success: true,
            message: "Inventory Item Image Removed.",
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try later!"
        });
    }
};

exports.deleteInventoryItem = async (req, res) => {
    try {
        const tenantId = req.user.tenant_id;
        const id = req.params.id;

        await deleteInventoryItemDB(id, tenantId);

        return res.status(200).json({
            success: true,
            message: "Inventory Item Deleted."
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try later!"
        });
    }
};

exports.getAllInventoryItems = async (req, res) => {
    try {
        const tenantId = req.user.tenant_id;
        const InventoryItems = await getAllInventoryItemsDB(tenantId);

        return res.status(200).json(InventoryItems);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try later!"
        });
    }
};

exports.getInventoryItem = async (req, res) => {
    try {
        const tenantId = req.user.tenant_id;
        const id = req.params.id;

        const InventoryItem = await getInventoryItemDB(id, tenantId);
        return res.status(200).json(InventoryItem);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try later!"
        });
    }
};

exports.getInventoryUnits = async (req, res) => {
    try {
        const units = await getInventoryUnitsDB();
        return res.status(200).json(units);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try later!"
        });
    }
};

exports.getRecipeByMenuItem = async (req, res) => {
    try {
        const tenantId = req.user.tenant_id;
        const menuItemId = req.params.menuItemId;
        const recipe = await getRecipeByMenuItemDB(menuItemId, tenantId);
        return res.status(200).json(recipe);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try later!"
        });
    }
};

exports.saveRecipe = async (req, res) => {
    try {
        const tenantId = req.user.tenant_id;
        const {
            menuItemId,
            name,
            yieldQuantity,
            yieldUnitId,
            prepWastagePercent,
            ingredients,
        } = req.body;

        if (!menuItemId || !Array.isArray(ingredients) || ingredients.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide menuItemId and at least one recipe ingredient."
            });
        }

        for (const ingredient of ingredients) {
            if (!ingredient.inventoryItemId || Number(ingredient.quantityPerYield) <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Each ingredient needs inventoryItemId and quantityPerYield greater than 0."
                });
            }
        }

        const recipeId = await saveRecipeDB({
            menuItemId,
            name,
            yieldQuantity,
            yieldUnitId,
            prepWastagePercent,
            ingredients,
            tenantId,
        });

        return res.status(200).json({
            success: true,
            message: "Recipe saved.",
            recipeId,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try later!"
        });
    }
};

exports.deleteRecipe = async (req, res) => {
    try {
        const tenantId = req.user.tenant_id;
        const recipeId = req.params.id;
        await deleteRecipeDB(recipeId, tenantId);

        return res.status(200).json({
            success: true,
            message: "Recipe disabled."
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try later!"
        });
    }
};

exports.adjustInventoryStock = async (req, res) => {
    try {
        const tenantId = req.user.tenant_id;
        const createdBy = req.user.username;
        const { inventoryItemId, quantityDelta, movementType, reason, unitId } = req.body;
        const allowedMovementTypes = [
            "manual_adjustment",
            "wastage",
            "spoilage",
            "return_in",
            "return_out",
            "stock_count",
        ];

        if (!inventoryItemId || Number(quantityDelta) === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide inventoryItemId and non-zero quantityDelta."
            });
        }

        if (movementType && !allowedMovementTypes.includes(movementType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid inventory movement type."
            });
        }

        await adjustInventoryStockDB({
            inventoryItemId,
            quantityDelta,
            movementType,
            reason,
            unitId,
            tenantId,
            createdBy,
        });

        return res.status(200).json({
            success: true,
            message: "Inventory adjusted."
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try later!"
        });
    }
};

exports.receivePurchase = async (req, res) => {
    try {
        const tenantId = req.user.tenant_id;
        const createdBy = req.user.username;
        const {
            supplierId,
            supplierOrderId,
            receiptNo,
            invoiceNo,
            notes,
            items,
        } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide at least one received inventory item."
            });
        }

        for (const item of items) {
            if (!item.inventoryItemId || Number(item.quantityReceived) <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Each receipt item needs inventoryItemId and quantityReceived greater than 0."
                });
            }
        }

        const receiptId = await receivePurchaseDB({
            supplierId,
            supplierOrderId,
            receiptNo,
            invoiceNo,
            notes,
            items,
            tenantId,
            createdBy,
        });

        return res.status(200).json({
            success: true,
            message: "Purchase received.",
            receiptId,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try later!"
        });
    }
};
