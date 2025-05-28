class Vehicle {
    constructor(name, fuelType, motTest, tax, taxExpiry, motExpiry, registration, recall) {
        this.name = name;
        this.fuelType = fuelType;
        this.motTest = motTest;
        this.tax = tax;
        this.taxExpiry = taxExpiry;
        this.motExpiry = motExpiry;
        this.registration = registration;
        this.recall = recall;
    }
}

module.exports = { Vehicle };
