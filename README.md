# Kiku's handicrafts store

A marketplace for selling and buying anything to do with handicrafts. User can search for something to buy, put products on sale, make bids on items and stay in queue for an item in case the previous buyer changes their mind. Users can send messages to the seller to ask questions about their wares. 

This project is a training exercize in Buutti's Trainee Academy (January 2022).

## Endpoints

|Root endpoint| Method | Description |
|-------|-------|------|
|/ |                                          GET |            Front page of the shop|


|Auth endpoints| Method | Description |
|-------|-------|------|
|/auth/register                   |          POST   |         Registeration|
|/auth/login         |                       POST    |        Login|
|/auth/logout | GET | Logout |


|Users endpoints| Method | Description |
|-------|-------|------|
|/users/myPage        |                       GET     |        User's front page|
|/users/updateYourInfo      |                 PUT       |      Update your user information|
|/users/changeUserRole    |                   PUT      |       Update another user's role to admin or regular user as admin|
|/users/deleteUser        |                   DELETE   |       Delete your own user account|
|/users/deleteAnyUser         |               DELETE      |    Delete another user as admin|


|Products endpoints| Method | Description |
|-------|-------|------|
|/products/allWares     |                        GET     |        All wares on sale|
|/products/myWares      |                        GET      |       User's own wares|
|/products/waresByUser/:id   |                       GET     |        Another user's wares|
|/products/newProduct     |                      POST     |       Put a new product on sale|
|/products/updateYourProductInfo   |             PUT      |       Update your product information|
|/products/updateUserProductInfo    |            PUT       |      Update another user's product info as admin|
|/products/deleteProduct      |                  DELETE   |       Delete your own product|
|/users/deleteAnyProduct/:id    |                 DELETE     |     Delete another user's product as admin|


|Bids endpoints| Method | Description |
|-------|-------|------|
|/bids/ownBids       |                       GET     |        User's own bids|
|/bids/bidsByUser/:id     |                      GET     |        Another user's bids|
|/bids/newBid          |                     POST     |       Bid on a product|
|/users/deleteAnyBid/:id                 |        DELETE    |      Delete another user's bid as admin|


|Messages endpoints| Method | Description |
|-------|-------|------|
|/messages/readAllYourSentMessages | GET | Read all messages you've sent |
|/messages/readAllYourReceivedMessages | GET | Read all the messages you've received |
|/messages//readMessagesFromUser/:id | GET | Read messages sent by user with id |
|/messages/sendMessage | POST | Send a message to another user |
|/messages/deleteyourMessage/:id | DELETE | Delete a message you've sent or received |
|/messages/deleteAnyMessage/:id | DELETE | Delete any message as admin |


## Dependencies and versions used
bcrypt 5.0.1,
dotenv 10.0.0,
ejs 3.1.6,
express 4.17.2,
express-flash 0.0.2,
express-session 1.17.2,
passport 0.5.2,
passport-local 1.0.0,
pg 8.7.1


## Authors and acknowledgment
Thank you to my instructors Heli Isohätälä and Anna-Liisa Mattila from Buutti.


