/* eslint-disable */

const express = require("express");
const functions = require("firebase-functions");
const cors = require("cors");
const stripe = require("stripe")("sk_test_51NxLzzDf2z7GOgEoL1ILydmDrk7IlJwAPC00IbMgB9sO6IDHQUpQfbwtHKHxsutHFLeJpQXScjhpbKiVStfbBiym00BktEEXnc");

//app-config
const app = express();

//middleware
app.use(cors({ origin: true }));
app.use(express.json())

//routes
app.get('/', (request, response) => response.status(200).send('Hello world'))

app.post('/payment/create', async (request, response) => {
    const total = request.query.total;
    console.log('payment requested for $', total)
    const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "usd"
    })
    response.status(201).send({
        clientSecret: paymentIntent.client_secret,
    })
})

//listen
exports.api = functions.https.onRequest(app);
