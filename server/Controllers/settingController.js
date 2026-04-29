import SystemSetting from "../Models/SystemSetting.js";
import asyncErrorWrapper from "express-async-handler";
import CustomError from "../Helpers/error/CustomError.js";

const getSettings = asyncErrorWrapper(async (req, res, next) => {
    console.log("[SettingController] Fetching all settings...");
    const settings = await SystemSetting.find();
    console.log(`[SettingController] Found ${settings.length} settings`);
    res.status(200).json({
        success: true,
        data: settings
    });
});

const getSettingByKey = asyncErrorWrapper(async (req, res, next) => {
    const { key } = req.params;
    console.log(`[SettingController] Fetching setting by key: ${key}`);
    const setting = await SystemSetting.findOne({ key });
    
    res.status(200).json({
        success: true,
        data: setting
    });
});

const updateSetting = asyncErrorWrapper(async (req, res, next) => {
    console.log("[SettingController] Request Body:", req.body);
    const { key, value } = req.body;
    console.log(`[SettingController] Updating setting: ${key} to`, value);

    let setting = await SystemSetting.findOne({ key });

    if (setting) {
        console.log(`[SettingController] Found existing setting for ${key}, updating value.`);
        setting.value = value;
        await setting.save();
    } else {
        console.log(`[SettingController] No existing setting for ${key}, creating new.`);
        setting = await SystemSetting.create({ key, value });
    }

    console.log(`[SettingController] Successfully ${setting.isNew ? 'created' : 'updated'} setting: ${key}`);
    res.status(200).json({
        success: true,
        message: `Setting ${key} updated successfully`,
        data: setting
    });
});

export { getSettings, getSettingByKey, updateSetting };
