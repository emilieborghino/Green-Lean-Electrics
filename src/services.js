exports.getWindSpeed = function (date) {
    return {
        "windSpeed": 42
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

    const gaussianFunction = (expectedValue, standardValue, x) => (
        1.0 / (standardValue * Math.sqrt(2 * Math.PI))
        * Math.exp(
            -Math.pow(x - expectedValue, 2)
            / (2 * Math.pow(standardValue, 2))
        )
    );

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
    const consumptionCaff = 1 / 10;

    const maxPrice = 2;
    const minPrice = 1;

    const price = Math.min(
        Math.max(
            consumptionCaff * electricityConsumption + windSpeedCoeff * Math.log(windSpeed),
            maxPrice
        ),
        minPrice
    );

    return {
        "currentElectricityPrice": price
    };
};