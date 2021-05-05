export const getToken = async (email, password) => {
    const url = "https://portail-e-rh.niva.tm.fr/api/login_check";
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: email,
                password: password,
            }),
        });
        const statusCode = response.status;
        return await Promise.all([statusCode, response.json()]);
    } catch (error) {
        return await Promise.all([500, error]);
    }
};

export const postAction = async (token, indicateurTemps, email, date, heure, button, lat, lng, activite) => {
    const url = "https://portail-e-rh.niva.tm.fr/api/action";
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                indicateurTemps: indicateurTemps,
                email: email,
                date: date,
                heure: heure,
                button: button,
                lat: lat,
                lng: lng,
                activite: activite,
            }),
        });
        const statusCode = response.status;
        return await Promise.all([statusCode, response.json()]);
    } catch (error) {
        return await Promise.all([500, error]);
    }
};

export const getUser = async (token, email) => {
    const url = "https://portail-e-rh.niva.tm.fr/api/getUser";
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                email: email,
            }),
        });
        const statusCode = response.status;
        return Promise.all([statusCode, response.json()]);
    } catch (err) {
        return console.error(err);
    }
};

export const getIco = async (token, ico) => {
    const url = "https://portail-e-rh.niva.tm.fr/api/images/'+ico+'.png";
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        });
        const statusCode = response.status;
        return Promise.all([statusCode, response.json()]);
    } catch (err) {
        return console.error(err);
    }
};

export const postLostPassword = async (email) => {
    const url = "https://portail-e-rh.niva.tm.fr/api/lost/password";
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                code: "AlphasysAPIMobileLostPasswordApi@69",
            }),
        });
        const statusCode = response.status;
        return Promise.all([statusCode, response.json()]);
    } catch (err) {
        return console.error(err);
    }
};

export const postEditPassword = async (token, email, newPassword, oldPassword) => {
    const url = "https://portail-e-rh.niva.tm.fr/api/password/edit";
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                email: email,
                new: newPassword,
                old: oldPassword,
            }),
        });
        const statusCode = response.status;
        return Promise.all([statusCode, response.json()]);
    } catch (err) {
        return console.error(err);
    }
};
