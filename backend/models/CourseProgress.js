import mongoose from 'mongoose';
const courseProgressSchema =new mongoose.Schema({
    userId:{type:String,required:true},
    courseId:{type:String,required:true},
    campleted:{type:Boolean,default:false},
    lectureCompleted:[]
},{minimize:false});

export default mongoose.model("CourseProgress",courseProgressSchema);