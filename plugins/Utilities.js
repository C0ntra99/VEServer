const logger = require('./logger')
const _ = require('lodash')

class Utilities {

    //Will parse get parameters abnd compare to an invalid list and return all invalid search keys
    validate_get_query(query, invalid_vals){
        let invalid_list = []; //only to hoist
        Object.keys(query).map(val => {
            if(invalid_vals.includes(val)){
                invalid_list.push(val);
            }
        })
        if(invalid_list.length > 0){
            return invalid_list
        } else {
            return
        }
    }
}

module.exports = Utilities;