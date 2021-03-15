var db=require('../config/connection')
var collection = require('../config/collections')
const collections = require('../config/collections')
var objectId = require('mongodb').ObjectID
const { response } = require('express')
const { reject } = require('bcrypt/promises')
module.exports={
    

    addProduct:(product,callback)=>{

        db.get().collection(collections.PRODUCT_COLLECTIONS).insertOne(product).then((data)=>{
            callback(data.ops[0]._id)
        })
    },
    getAllProducts:()=>{
        return new Promise( async( resolve,reject)=>{
            let products= await db.get().collection(collections.PRODUCT_COLLECTIONS).find().toArray()
            resolve(products)
        })
    }
    ,
    deleteProduct:(prodId)=>{
        return new Promise ((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTIONS).removeOne({_id:objectId(prodId)}).then((response)=>{
                resolve(response)
            })
        })
    },
    getProductDeatails:(prodId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTIONS).findOne({_id:objectId(prodId)}).then((product)=>{
                resolve(product)
            })
        })
         
    },
    updateProduct:(proId,ProDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTIONS)
            .updateOne({_id:objectId(proId)},{
                $set:{
                    Name:ProDetails.Name,
                    Description:ProDetails.Description,
                    price:ProDetails.price, 
                    category:ProDetails.category,

                }
            })
            .then((response)=>{
                resolve()
            })
        })
    }
}