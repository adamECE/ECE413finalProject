const mongoose = require('mongoose');

const heartRateSchema = new mongoose.Schema({
  username: String,
  deviceKey: String,
  heartRateData: [
        {
            dateTime: String, 
            heartRates: [String] // change from string later maybe? 
        }
    ]

})

const heartRates = mongoose.model("pulses", heartRateSchema);

module.exports = heartRates; 
