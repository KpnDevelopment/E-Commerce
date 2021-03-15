const { compare } = require('bcrypt');
const { response } = require('express');
var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helpers')
var userHelpers =require('../helpers/user-helpers');
const { use, route } = require('./admin');
/* GET home page. */
router.get('/', async function(req, res, next) {

  let user=req.session.user
  console.log(user);
  let cartCount =null
 if(req.session.user){
  cartCount=await userHelpers.getCartCount(req.session.user._id)
}
  productHelper.getAllProducts().then((products)=>{
  
    res.render('user/view-products', {products,user,cartCount})

  })
});
const veryfyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }
  else{
    res.redirect('/login')
  }
}
router.get('/login',(req,res)=>{
  if(req.session.loggedIn){
    res.redirect('/')
  }
  else{
    res.render('user/login',{'loginErr':req.session.loginErr})
    req.session.loginErr=false
  }
  
})
router.get('/signup',(req,res)=>{
  res.render('user/signup')
})

router.post('/signup',(req,res)=>{
  userHelpers.doSignup(req.body).then((response)=>{
    console.log(response);
    req.session.loggedIn=true
    req.session.user=response
    res.redirect('/')
  })
})

router.post('/login',(req,res)=>{
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn=true
      req.session.user=response.user

      res.redirect('/')     //resder is used to call new hbs file redirect is used to call existing hbs file
    }
    else{
      req.session.loginErr="Invalid Username and Password "
      res.redirect('/login')
    }
  })
})
router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})
router.get('/cart',veryfyLogin, async(req,res)=>{

  let products = await userHelpers.getCartProducts(req.session.user._id)
  console.log(products);
  res.render('user/cart',{products,user:req.session.user})
})
router.get('/add-to-cart/:id',(req,res)=>{ 
  console.log("api called");
  userHelpers.addToCart(req.params.id,req.session.user._id).then(()=>{
    res.json({status:true}) 

  })
})
router.post('/change-product-quantity',(req,res,next)=>{
  // console.log("enthe thenga");
    console.log(req.body);
  userHelpers.changeProductQuantity(req.body).then((response)=>{  //(status)
    // console.log(" api call response",status);
    res.json(response)
  })
}
)
router.get('/place-order',veryfyLogin,async(req,res)=>{
  let total=await userHelpers.getTotalAmount(req.session.user._id)
  res.render('user/place-order')
}) 

module.exports = router;
