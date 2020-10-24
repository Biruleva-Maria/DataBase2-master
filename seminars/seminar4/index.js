const express = require('express')
const app =express()

app.route('/get').get((req,res)=>{
    res.send('Hello World!')
})

app.route('/group/:group').get((req,res)=>{
    const group =req.params.group
    res.send(`Hello ${group}`)
})

app.listen(8080,()=>{
    console.log('Server started on http://localhost:8080')
})