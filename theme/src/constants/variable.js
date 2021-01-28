//Api Url 
export const apiUrl = 'https://api.beldara.com/common/'

//Seller Url
export const sellerUrl = 'https://seller.beldara.com'

//Img url
export const imgUrl = 'https://img.beldara.com'


// Beta API

export const betaApi = 'https://img.beldara.com/beta_api/'


//Node Api
// export const localhost = 'http://localhost:5000'
var localhost1
if(process.env.NODE_ENV ==='production') {
    localhost1 = window.location.origin
}
else {
    localhost1 = 'http://localhost:5000'

}
export let localhost = localhost1