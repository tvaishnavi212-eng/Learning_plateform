import User from "../models/User.js";
import Stripe from "stripe";
import Course from "../models/Course.js";
import Purchase from "../models/Purchase.js";

import { populate } from "dotenv";
import CourseProgress from "../models/CourseProgress.js";

export const getUserData=async(req,res)=>{
    try {
        const userId = req.auth.userId;
        const user = await User.findById(userId);
        if(!user){
            return res.json({success:false,message:"User not found"})
        }
        res.json({
            success: true,
            user
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
}
///user enrolled courses with lecture links
export const userEnrolledCourses=async(req,res)=>{
    try {
        const userId = req.auth.userId;
        const userData = await User.findById(userId).populate('enrolledCourses');
        if(!user){
            return res.json({success:false,message:"User not found"})
        }
        res.json({
            success: true,
            enrolledCourses:userData.enrolledCourses
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
}

//PURCHASE COURSE
export const purchaseCourse=async(req,res)=>{
    try {
        const userId = req.auth.userId;
        const {courseId} = req.body;
        const {origin}=req.headers;
        const userData = await User.findById(userId);
        const courseData = await Course.findById(courseId);
      
        if(!userData|| !courseData){
            return res.json({success:false,message:"User or course not found"});
        }
        const purchaseData = {
            courseId:courseData._id,
            userId,
            amount:(courseData.coursePrice - courseData.discount* courseData.coursePrice/100).toFixed(2),
        }
          const newPurchase =await Purchase.create(purchaseData);  
            
          //stripe gateway
          const stripeInstance=new Stripe(process.env.STRIPE_SECRET_KEY);
          const currency =process.env.CURRENCY.toLowerCase();

          //Creating line item to for stripe
          const line_Item=[{
            price_data:{
              currency:currency,
              product_data:{
                name:courseData.courseTitle,
                description:courseData.courseDescription,
              },
              unit_amount:Math.floor((newPurchase.amount)*100),
            },
            quantity:1,
          }]

          const session = await stripeInstance.checkout.sessions.create({
            success_url:`${origin}/loading/my-enrollments`,
            cancel_url:`${origin}/`,
            line_items:line_Item,
            mode:'payment',
            metadata:{
                purchaseId:newPurchase._id.toString()
            }
            
        
    }) 
    res.json({
        success:true, session_url:session.url })
    }
    
    catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
}
//update user course progress
export const updateUserCourseProgress=async(req,res)=>{
    try{
        const userId=req.auth.userId
        const{courseId,lectureId}=req.body
        const progressData =await CourseProgress.findOne({userId,courseId})
        if(!progressData){
            if(progressData.lectureCompleted.includes(lectureId)){
                return res.json({success:false,message:"Lecture already completed"});
            }
            progressData.lectureCompleted.push(lectureId)
            await progressData.save()
            return res.json({success:true,message:"Lecture completed"});
        }
        else{
            await CourseProgress.create({
                userId,
                courseId,
                lectureCompleted:[lectureId]
            })
        }
        res.json({success:true,message:'progress updated'})
    }catch(error){
   res.json({success:false,message:error.message})
    }
}

//get user course progress
export const getUserCourseProgress =async(req,res)=>{
    try{
        const userId=req.auth.userId
        const{courseId,lectureId}=req.body
        const progressData =await CourseProgress.findOne({userId,courseId})
        if(!progressData){
            return res.json({success:false,message:"No progress found"});
        }
        res.json({success:true,data:progressData})
    }catch(error){
        res.json({success:false,message:error.message})
    }
}

//add user rating for course
export const addUserRating = async(req,res)=>{
    try{
        const userId=req.auth.userId
        const{courseId,rating}=req.body

        if(!courseId || !rating || rating < 1 || rating > 5){
            return res.json({success:false,message:"Invalid data. Rating must be between 1 and 5"});
        }
        
        const course=await Course.findById(courseId)
        if(!course){
            return res.json({success:false,message:"Course not found"});
        }
        
        const user = await User.findById(userId)
        if(!user || !user.enrolledCourses.includes(courseId)){
            return res.json({success:false,message:'User has not enrolled in this course'})
        }
        
        const existingRatingIndex = course.ratings.findIndex(r => r.userId.toString() === userId.toString());
        if(existingRatingIndex !== -1){
            course.ratings[existingRatingIndex].rating = rating;
        }
        else{
            course.ratings.push({userId,rating});
        }
        
        await course.save();
        res.json({success:true,message:'Rating added successfully'});
    }
    catch(error){
        res.json({success:false,message:error.message})
    }
}