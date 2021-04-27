import { PermissionsAndroid } from "react-native";

export const requestACCESSFINELOCATIONPermission = async () => {
    try {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    } catch (err) {
        console.warn(err);
    }
};
