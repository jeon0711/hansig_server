import { review, PrismaClient } from "@prisma/client";
import { Review } from "../interface/review/review";
import { success } from "../interface/success";
import { UserService } from "./user.service";
import { user } from "../interface/user/user";
const prisma = new PrismaClient();
class reviewService
{//리뷰 아이디로 리뷰조회
    async getReview(id:number):Promise<any|false>
    {try{
        const [review,reviewComment,reviewImg]=await Promise.all([prisma.review.findUnique({select:{review:true,star:true,user:{select:{id:true,userNickName:true}}},where:{id:id}}),prisma.reviewComment.findMany({where:{reviewId:id}}),prisma.reviewImg.findMany({select:{imgUrl:true},where:{reviewId:id}})]);
        console.log(review,reviewComment,reviewImg);
        if(review)
        {
            return {review:review.review,star:review.star,user:review.user,reviewComment:reviewComment,imgUrl:reviewImg};
        }
        else
        {
            return false;
        }
    }
        catch(err)
        {
            console.log("err");
        }
    }//식당 id로 리뷰조회
    async getReviewList(restaurantId:number):Promise<any[]|any>
    {
        try{
        const review=await prisma.$queryRaw<any[]>`SELECT 
        rv.id,
        rv.star,
        rv.review,
         STRING_AGG(rc.comment, ', ') AS comment,
         STRING_AGG(ri."imgUrl", ', ') AS "imgUrl"
        FROM hansic.review as rv
        LEFT JOIN hansic."reviewComment" as rc ON  rv.id=rc."reviewId"
        LEFT JOIN hansic."reviewImg"as ri ON rv.id=ri."reviewId"
        WHERE rv."hansicsId"=${restaurantId}
        GROUP BY rv.id`;
        if(review)
        {
            console.log(review);
            return review;
        }
        else
        {
            return false;
        }
    }
    catch(err)
    {

    }
    }
    //리뷰작성
    async writeReview(inputReview:Review,userInfo:Number,restaurantInfo:Number)
    {
        try{
        console.log(inputReview,userInfo,restaurantInfo);
        const success=await prisma.review.create({data:{review:inputReview.review,star:Number(inputReview.star),hansicsId:Number(restaurantInfo),userId:Number(userInfo),useFlag:true}});
        console.log(success);
        if(!success)
        {
            return {success:false};
        }
        if(inputReview.img){
            for(let i in inputReview.img)
            {
                const img=await prisma.reviewImg.create({data:{imgUrl:i,reviewId:success.id}});
                if(!img)
                {
                    return {success:false};
                }
            }
        }
        return {success:true};
    }
    catch(err)
    {
        console.error(err);
    }
    }
    async updateReview(review:any):Promise<any>
    {

        return true;
    }
    async deleteReview(deleteReviewId:number,userInfo:number):Promise<any>
    {
        try{
            const success=await prisma.review.delete({where:{id:Number(deleteReviewId),userId:Number(userInfo)}});
            console.log(success);
            if(!success)
            {
                return {success:false};
            }
            return {success:true};
        }
        catch(err)
        {
            console.error(err);
        }
    }
}
module.exports=reviewService