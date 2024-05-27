const express = require("express")
const uuid = require("uuid")

const port = 3000
const app = express()
app.use(express.json())

const orders = []

const methodAndRequest = (request, response, next) => {
    console.log(`Método: ${request.method} || url:${request.url}`)
    next()
}

const checkOrderId = (request, response, next) => {

    const {id} = request.params

    const index = orders.findIndex(user => user.id === id)

    if (index < 0){
        return response.status(404).json({ error: "Order not found"})
    }

    request.orderIndex = index
    request.orderId = id

    next()
}

app.get("/order", methodAndRequest, (request, response) => {
    
    return response.json(orders)
})

app.post("/order", methodAndRequest, (request, response) => {
    const {order, customerName, price, status} = request.body
    const newOrder = {id: uuid.v4(), order, customerName, price, status}

    orders.push(newOrder)
    return response.status(201).json(newOrder)
})

app.put("/order/:id", checkOrderId, methodAndRequest, (request, response) => {

    const id = request.orderId
    const index = request.orderIndex

    const { order, customerName, price, status} = request.body
    const updatedOrder = { id, order, customerName, price, status}

    orders[index] = updatedOrder
    return response.status(201).json(updatedOrder)
})

app.delete("/order/:id", checkOrderId, methodAndRequest, (request, response) => {

    const index = request.orderIndex

    orders.splice(index,1)
    return response.status(200).json()
})

app.get("/order/:id", checkOrderId, methodAndRequest, (request, response) => {

    const id = request.orderId
    const index = request.orderIndex
    return response.json(orders[index])
})

app.patch("/order/:id", checkOrderId, methodAndRequest, (request, response) => {

    const id = request.orderId
    const index = request.orderIndex

    orders[index].status = "Pronto"

    return response.status(201).json(orders[index])
})

app.listen(port, () => {
    console.log(`🚀Started server on port ${port}👍`)
})