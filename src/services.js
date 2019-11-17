const gaussianFunction = (expectedValue, standardValue, x) => (
    1.0 / (standardValue * Math.sqrt(2 * Math.PI))
    * Math.exp(
        -Math.pow(x - expectedValue, 2)
        / (2 * Math.pow(standardValue, 2))
    )
);

exports.getWindSpeed = function (date) {
    function floor(x) {
        const maxDecimals = 0;
        const coefficient = Math.pow(10, maxDecimals);
        return Math.floor(x * coefficient) / coefficient;
    }


    const windPointsNumber = 1000;
    const maxWindSpeed = 2000;

    const yearStart = new Date(date.getFullYear(), 0).getTime();
    const yearEnd = new Date(date.getFullYear(), 11, 31).getTime();
    const hoursInYear = (yearEnd - yearStart) / 1000 / 60 / 60;

    const dateSinceStartOfYear = (date.getTime() - yearStart) / 1000 / 60 / 60;

    const step = hoursInYear / 8;
    let windSpeed = [...Array(windPointsNumber).keys()]
        .map(point => point * step)
        .map(point => maxWindSpeed
            * (1 + Math.cos(dateSinceStartOfYear))
            * gaussianFunction(0, 8000, dateSinceStartOfYear - point * Math.cos(dateSinceStartOfYear)))
        .reduce((accumulator, currentValue) => accumulator + currentValue);

    return {
        "windSpeed": floor(windSpeed)
    };
};

exports.getElectricityConsumption = function (date) {
    const people = 10;
    const dailyConsumptionPerPerson = 27;

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const currentTimestamp = hours * 3600 + minutes * 60 + seconds;

    const morningTopTimestamp = 11 * 3600;
    const afternoonTopHourTimestamp = 19 * 3600 + 30 * 60;

    const morningConsumption = 21;
    const afternoonConsumption = dailyConsumptionPerPerson - morningConsumption;

    return {
        "electricityConsumption":
            (
                gaussianFunction(
                    morningTopTimestamp,
                    21600,
                    currentTimestamp
                ) * morningConsumption
                + gaussianFunction(
                    afternoonTopHourTimestamp,
                    5400,
                    currentTimestamp
                ) * afternoonConsumption
            ) * people
    };
};


exports.getCurrentElectricityPrice = function (windSpeed, electricityConsumption) {
    const windSpeedCoeff = -1;
    const consumptionCoeff = 500;

    const maxPrice = 2;
    const minPrice = 1;

    const price = Math.max(
        Math.min(
            consumptionCoeff * electricityConsumption + windSpeedCoeff * Math.log(windSpeed),
            maxPrice
        ),
        minPrice
    );

    console.log(consumptionCoeff * electricityConsumption + windSpeedCoeff * Math.log(windSpeed));

    return {
        "currentElectricityPrice": price
    };
};

// DataBase
const mongo = require('mongodb');
const mongourl = "mongodb://localhost:27017";

exports.insertProsumer = function (email, pwd){
    /*console.log("email : " + email);
    console.log("pwd : " + pwd);*/

    mongo.connect(mongourl, {useNewUrlParser: true}, (err, db) => {
        if(err) {
           console.log(err);
           process.exit(0);
        }

        var dbo = db.db('greenleanelectrics');
        var collection = dbo.collection('prosumers');

        var prosumer = {
            "email": email,
            "pwd": pwd
        };

        collection.find({"email": email}).toArray((err, results) => {
            if(err) {
                console.log(err);
                process.exit(0);
            }

            if(results.length == 0)
                collection.insertOne(prosumer);
            else
                console.log("Email already used");

            db.close();
        });

            /*return {
                "status": true,
                "message": "inserted record"+response.ops[0]
            }; 
            return {
                "status": false,
                "message": "Error occurred while inserting"
            }; */
    });
}

exports.prosumerLogin = function (email, pwd){
    /*console.log("email : " + email);
    console.log("pwd : " + pwd);*/

    mongo.connect(mongourl, {useNewUrlParser: true}, (err, db) => {
        if(err) {
           console.log(err);
           process.exit(0);
        }
        
        var dbo = db.db('greenleanelectrics');
        var collection = dbo.collection('prosumers');

        var prosumer = {
            "email": email,
            "pwd": pwd
        };

        var userToken = generateToken();
        collection.updateOne(prosumer, {$set: {token:userToken}});
        console.log("User connected with token : " + userToken);
        db.close();

    });
}

exports.prosumerLogout = function (token){
    /*console.log("email : " + email);
    console.log("pwd : " + pwd);*/

    mongo.connect(mongourl, {useNewUrlParser: true}, (err, db) => {
        if(err) {
           console.log(err);
           process.exit(0);
        }
        
        var dbo = db.db('greenleanelectrics');
        var collection = dbo.collection('prosumers');

        var prosumer = {
            "token": token
        };

        collection.updateOne(prosumer, {$set: {token:null}});
        console.log("User disconnected");
        db.close();
    });
}
var rand = function() {
    return Math.random().toString(36).substr(2);
};

var generateToken = function() {
    return rand() + rand();
};