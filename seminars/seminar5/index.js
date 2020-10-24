require('dotenv').config()
const express = require('express')
const pool=require('./config/db')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

app.route('/now').get(async(req,res)=>{
    const pgclient= await pool.connect()
    const { rows } = await pgclient.query('SELECT now() as now')
    await pgclient.release()
    res.send(rows[0].now)
})

app.route('/user_order/:id').get(async (req, res) => {
    let pgclient = await pool.connect()
    try {
      const { id } = req.params
      const { rows } = await pgclient.query(`
        SELECT id, client_id, created_at
        FROM order___
        WHERE client_id = $1
        ORDER BY created_at DESC
      `, [id])
      res.send(rows)
    } catch (err) {
      res.status(500).send({
        error: err.message
      })
      console.error(err)
    } finally {
      await pgclient.release()
      //console.log('close db connection')
    }
  })

  app.route('/make_order/:id').post(async (req, res) => {
    // TODO: получать id не из параметра, а из токена
    let pgclient = await pool.connect()
    try {
      const { id } = req.params
      
      await pgclient.query('BEGIN')

      const { rows } = await pgclient.query(`
      INSERT INTO order_ (client_id) VALUES ($1) RETURNING id
      `, [id])
      const orderID = rows[0].id

      let params=[]
      let values=[]
      for(const item of body){
        params.push(`$${i+1}`)
        values.push(item.menu_id)
      }

      const {rows:costQuery}=await pgclient.query(`
      SELECT id.price::number
      FROM menu
      WHERE id IN(${params.join(',')})
      `, values)

      let orderWithCost=[]
      for(const item of body){
        let cost =null
        for(const costItem of costQuery){
          if(costItem===item.menu_id){
            cost=costItem.price
          }
        }
      }

      if(!cost){
        throw new Error(`Not found in menu: ${item.menu_id}`)
      }

      orderWithCost.push({
        ...item,
        cost:cost*item.count
      })

      let promises = []
    for (const item of orderWithCost) {
      promises.push(pgclient.query(
        `INSERT INTO order_menu (order_id, menu_id, count, price) 
          VALUES ($1, $2, $3, $4);`,
        [orderID, item.menu_id, item.count, item.price]
      ))
    }

      await Promise.all(promises)

      await pgclient.query('COMMIT')

      res.send({
        order_id: orderID
      })
  
      // TODO: 
      // 1. Определиться со структурой, которую будем передавать
      // Возможно такая структура:
      // [
      //   {
      //     menu_id: 1,
      //     count: 2
      //   }
      // ]
      // 2. Всё выполнять в тразакции
      // 3. Определиться как считать стоимость заказа
      // 4. Добавить все продукты из заказа в order_menu
  
    } catch (err) {
      await pgclient.query('POLLBACK')
      res.status(500).send({
        error: err.message
      })
      console.error(err)
    } finally {
      await pgclient.release()
    } 
  })

  // Зарегистрироваться
app.route('/sign_up').post(async (req, res) => {
  // Если какой-то из параметров не будет передан, то
  // будет SQL ошибка (NOT NULL contraint)
  // По хорошему, нам надо тут проверить, что 
  // параметры, которые не могут быть NULL переданы
  const { 
    name,
    address,
    phone,
    username, 
    password 
  } = req.body

  let pgclient = await pool.connect()
  try {
    const { rows } = await pgclient.query(`
    INSERT INTO client (name, address, phone, username, password)
    VALUES ($1,$2,$3,$4,$5) RETURNING id;
    `, [name, address, phone, username, password])

    res.send({
      id: rows[0].id
    })
  } catch (err) {
    res.status(500).send({
      error: err.message
    })
    console.error(err)
  } finally {
    // освобождаем соединение с postgresql
    await pgclient.release()
  }
})
  
  app.listen(8080, () => {
    console.log('Server started on http://localhost:8080')
  })