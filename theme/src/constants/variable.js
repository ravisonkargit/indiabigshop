//Api Url 
export const apiUrl = 'https://api.indiabigshop.com/common/'

//Seller Url
export const sellerUrl = 'https://seller.indiabigshop.com'

//Img url
export const imgUrl = 'https://img.indiabigshop.com'


// Beta API

export const betaApi = 'https://img.indiabigshop.com/beta_api/'


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