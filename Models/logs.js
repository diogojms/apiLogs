'logs strict';
//esquema da DB
const mongoose=require('mongoose')
const Schema = mongoose.Schema;

const LogerSchema = new Schema(
    {
        Level:{type:String, require: true},
        Action:{type:String, require:true},
        Description:{type:Object,require:true},
        User:{type:String, require:true},
        LogMoment:{type:Date, require:true}
    },
    {collection:'Logs'}
)

const Log = mongoose.model('Log', LogerSchema)

module.exports=Log