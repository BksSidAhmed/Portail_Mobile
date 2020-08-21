export const postCheckToken = async (username,password) => {
    const url = 'https://test.portail-e-rh.niva.tm.fr/api/login_check'
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Accept : "application/json",
                'Content-Type' : "application/json",
            },
            body: JSON.stringify({
	            username: username,
                password: password
            })
        });
        const statusCode = response.status
        return await Promise.all([statusCode,response.json()])

    } catch(error) {
        return console.error("Ne peut pas fonctionner")
    }
}

export const postActionButton = async (token,email,date,heure,button,lat,lng) => {
    const url = 'https://test.portail-e-rh.niva.tm.fr/api/badger'
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Accept : "application/json",
                'Content-Type' : "application/json",
                'Authorization': 'bearer ' + token,
            },
            body: JSON.stringify({
                email : email,
	            date: date,
                heure: heure,
                button : button,
                lat : lat,
                lng : lng
            })
        });
        const statusCode = response.status
        return await Promise.all([statusCode,response.json()])

    } catch(err) {
        return console.error(err)
    }
}