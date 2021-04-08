import axios from 'axios'
 
 
 // Top Products 
 axios.get("https://api.beldara.com/common/home_products.php", {headers: {'Content-Type': 'multipart/form-data'}})
 .then(response => {
    //  this.setState(prevState => {
       console.log("uih")
         return  topProducts = response.data.result
        //  return topProducts ;
    //  });
 })
//  export default topProducts;