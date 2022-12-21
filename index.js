const express = require('express')
const path = require('path')
const fs = require('fs/promises')
const { fdatasync } = require('fs');

const app = express()

app.use(express.json())

const jsonPath = path.resolve('./files/tasks.json')

app.get('/tasks', async (req, res) => {
    const jsonFile = await fs.readFile(jsonPath, 'utf8')
    res.send(jsonFile)
})


app.post('/tasks', async (req, res) => {
    const task = req.body
    const tasksArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'))
    //generando id
    const lastIndex = tasksArray.length -1
    const newId = tasksArray[lastIndex].id+1
    //agregando la tarea en el arreglo
    tasksArray.push({...task, id: newId})
    //escribiendo la nueva info en el json
    await fs.writeFile(jsonPath, JSON.stringify(tasksArray))
    res.end()
})


app.put('/tasks', async (req, res) => {
    const tasksArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'))
    const {title, description, status, id} = req.body
    //buscamos el id dentro del arreglo
    const tasksIndex = tasksArray.findIndex(task => task.id === id)
    if(tasksIndex >=0){
        tasksArray[tasksIndex].title = title
        tasksArray[tasksIndex].description = description
        tasksArray[tasksIndex].status = status
    }
    //escribir el arreglo en el archivo
    await fs.writeFile(jsonPath, JSON.stringify(tasksArray))
    res.send('tarea actualizada')
})


app.delete('/tasks', async (req, res) => {
    const tasksArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'))
    const {id} = req.body
    const tasksIndex = tasksArray.findIndex(task => task.id === id)
    //eliminamos el arreglo
    tasksArray.splice(tasksIndex, 1)
    //escribimos el json nuevamente
    await fs.writeFile(jsonPath, JSON.stringify(tasksArray))
    res.end()
})



const PORT = 8000

app.listen(PORT, () => {
    console.log(`servidor escuchando en el puerto ${PORT}`)
})