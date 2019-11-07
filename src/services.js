exports.getWindSpeed = function (date) {
    return {
        "windSpeed": 42
    };
};


exports.getElectricityConsumption = function (date) {
    return {
        "electricityConsumption": 42
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