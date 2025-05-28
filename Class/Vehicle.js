class Vehicle {
    constructor(name, fuelType, motTest, tax, taxExpiry, motExpiry, registration, recall,last_mileage) {
        this.name = name;
        this.fuelType = fuelType;
        this.motTest = motTest;
        this.tax = tax;
        this.taxExpiry = taxExpiry;
        this.motExpiry = motExpiry;
        this.registration = registration;
        this.recall = recall;
        this.last_mileage = last_mileage
    }
}

module.exports = { Vehicle };
