# ShoppyGlobe E-commerce web application backend
This is the backend of ShoppyGlobe E-coomerce application. This is built using Node.js, Express, MongoDB and JWT authorization.

# Setup
- Extract the folder and open the terminal in the folder
- Install node modules: `npm install`
- Start the server: `npm start`
- the server will be active in the address: http://localhost:3000
- Install ThunderClient in the VScode for testing purposes

# Tech Stack
* Node.js + Express.js
* MongoDB + Mongoose
* JWT Authentication
* ThunderClient (API Testing)


# Features
* User Authentication
  - POST api/auth/register : Register a new user
  - POST api/auth/login :  Login to get a new JWT token (This token should be pasted in the authorization header in the ThunderClient in the format `JWT TOKEN_PASTE_HERE`)
* Products API
  - GET api/products : Get all products
  - GET api/products/:id : Get a single product
  - POST api/cart : Add product to the cart (JWT Protected)
  - GET api/cart : Get cart product details
  - PUT api/cart/:itemId : Update product quantity
  - DELETE /cart/:itemIid → Remove product from cart
* Error Handling like
  - Authentication error
  - Stock quantity exceeding
  - username already exists
  
# Testing
* Testing done using ThunderCLient
* MongoDB Integration helps reflects CRUD operations in the cloud database(For testing purpose only)
* Test screenshots are provided for reference
