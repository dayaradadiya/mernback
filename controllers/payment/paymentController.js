const stripeModel = require('../../models/stripeModel')
const sellerModel = require('../../models/sellerModel')

const sellerWallet = require('../../models/sellerWallet')
const withdrowRequest = require('../../models/withdrowRequest')

const {v4 : uuidv4} = require('uuid')
const { responseReturn } = require('../../utiles/response')
const {mongo : {ObjectId}} = require('mongoose')

const stripe = require('stripe')(process.env.react_app_s_key)

class paymentController {

    create_stripe_connect_account = async(req,res) => {
        const {id} = req 
        const uid = uuidv4()

        try {
            const stripeInfo = await stripeModel.findOne({ sellerId : id })
            if (stripeInfo){
                await stripeModel.deleteOne({ sellerId : id })
                
                const account = await stripe.accounts.create({
                    type : 'express'
                }) 

                const refreshUrl = process.env.ALLOWED_ORIGINS_2;

                const accountLink = await stripe.accountLinks.create({
                    account : account.id,
                    refresh_url : `${refreshUrl}/refresh`,
                    return_url : `${refreshUrl}/success?activeCode=${uid}`,
                    type : 'account_onboarding'
                })
                await stripeModel.create({
                    sellerId : id,
                    stripeId : account.id,
                    code : uid
                })
                responseReturn(res, 201, {url : accountLink.url})

            }else{
                const account = await stripe.accounts.create({
                    type : 'express'
                }) 

                const refreshUrl = process.env.ALLOWED_ORIGINS_2;

                const accountLink = await stripe.accountLinks.create({
                    account : account.id,
                    refresh_url : `${refreshUrl}/refresh`,
                    return_url : `${refreshUrl}/success?activeCode${uid}`,
                    type : 'account_onboarding'
                })
                await stripeModel.create({
                    sellerId : id,
                    stripeId : account.id,
                    code : uid
                })
                responseReturn(res, 201, {url : accountLink.url})

            }
        } catch (error) {
            console.log('stripe connect account error' + error.message)
        }
    }

    active_stripe_connect_account = async(req,res) => {
        const {activeCode} = req.params
        
        const {id} = req

        try {
            const  userStripeInfo = await stripeModel.findOne({
                code: activeCode
            })

            if(userStripeInfo) {
                await sellerModel.findByIdAndUpdate(id,{
                    payment: 'active'
                })
                responseReturn(res, 200, {message : 'Payment Active'} )
            }else{
                responseReturn(res, 404, {message : 'Payment Active Failed'} )
            }
        } catch (error) {
            responseReturn(res, 500, {message : 'Internal server error'} )
        }

}

sumAmount = (data) => {
    let sum = 0;

    for (let i = 0; i < data.length; i++) {
        sum = sum + data[i].amount;
    }

    return sum
}

get_seller_payment_details = async(req, res) => {
    const {sellerId} = req.params

    try {
        
        const payments = await sellerWallet.find({sellerId})

        const pendingWithdrows = await withdrowRequest.find({
            $and : [
                {
                    sellerId : {
                        $eq : sellerId
                    }
                },
                {
                    status : {
                        $eq : 'pending'
                    }
                }
            ] 
        })

        const successWithdrows = await withdrowRequest.find({
            $and : [
                {
                    sellerId : {
                        $eq : sellerId
                    }
                },
                {
                    status : {
                        $eq : 'success'
                    }
                }
            ] 
        })

        const pendingAmount = this.sumAmount(pendingWithdrows)
        const withdrowAmount = this.sumAmount(successWithdrows)
        const totalAmount = this.sumAmount(payments)

        let availableAmount = 0;

        if(totalAmount > 0) {
            availableAmount = totalAmount - (pendingAmount + withdrowAmount)
        }

        responseReturn(res, 200, {
            totalAmount,
            pendingAmount,
            withdrowAmount,
            availableAmount,
            pendingWithdrows,
            successWithdrows
        })

    } catch (error) {
        console.log(error.message)
    }
}

withdrowal_request = async(req, res) => {
    const {amount, sellerId} = req.body

    try {
        const withdrowal = await withdrowRequest.create({
            sellerId,
            amount : parseInt(amount)
        })
        responseReturn(res,200,{ withdrowal, message : 'Withdrowal Request Send'})
    } catch (error) {
        responseReturn(res,500,{ message : 'Internal Server Error'})
    }
}

get_payment_request = async(req,res) => {
    try {
        const withdrowalRequest = await withdrowRequest.find({status : 'pending'})
        responseReturn(res, 200, {withdrowalRequest})
    } catch (error) {
        console.log(error)
        responseReturn(res,500,{ message : 'Internal Server Error'})
    }
}

payment_request_confirm = async(req,res) => {
    const {paymentId} = req.body
    try {
        const payment = await withdrowRequest.findById(paymentId)
        const {stripeId} = await stripeModel.findOne({
            sellerId : new ObjectId(payment.sellerId)
        })

        await stripe.transfers.create({
            amount : payment.amount * 100,
            currency : 'SGD',
            destination:stripeId
        })

        await withdrowRequest.findByIdAndUpdate(paymentId, {status : 'success'})

        responseReturn(res, 200, {payment, message : 'Request Confirm Success'})

    } catch (error) {
        console.log(error)
        responseReturn(res, 500, { message : 'Internal Server Error'})
    }
}

}
// 'https://connect.stripe.com/setup/e/acct_1QV60FBRiGE7IvlG/jB2AeUrmJYXZ'
module.exports = new paymentController()