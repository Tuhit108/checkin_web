
const moment = require('moment')
export const formatDate = (str)=>{
   let date = moment(str).format('DD/MM/YYYY')
    return date
}
