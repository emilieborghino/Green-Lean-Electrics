function insertProsumer() {
    const email = 'myMail';
    const password = 'myPassword';
    require('../services').insertProsumer(email, password);
    require('../mongo.js').find(undefined, 'greenleanelectrics', 'prosumers')
        .then(result => {
            if (result[0].email !== email || result[0].password !== password) {
                throw {
                    expected: {
                        email,
                        password
                    },
                    found: result[0]
                }
            } else {
                console.log("Insert Prosumer: OK")
            }
        })
}

insertProsumer();