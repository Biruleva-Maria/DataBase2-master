require('dotenv').config()
const { Client } = require('pg')
const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATEBASE,
})

const name = '1 or 1 = 1'

client.connect()

async function addCar() {
    const car = {
        brandID: 1,
        model: '420i',
        cost: 2500000,
        year: 2019,
        isAvaible: true,
    }

    try {
        //start transaction
        await client.query('BIGIN')
        const resCarID = await client.query(
            `
        Insert INTO car (brand_id, model,cost,year_of_creation, is_avaible) VALUES
        ($1, $2,$3,$4,$5) RETURNING id`,
            [car.brandID, car.model, car.cost, car.year, car.isAvaible]
        )

        throw 'ERROR!!!!'
        const carID = res.row[0].id

        const resManagerID = await client.query(`
        SELECT *
        FROM manager
        Whare car_id IS NULL
        LIMIT 1`)

        const managerID = resManagerId.rows[0].id

        await client.query(
            `
        UPDATE manager
        SET car_id=$1
        WHERE id=$2`,
            [carID, managerID]
        )
        await client.query('COMMIT')
    } catch (err) {
        client.query('ROllBACK')
        throw err
    } finally {
        client.end()
    }
}

addCar()

/*client
    .query(
        `
SELECT *
FROM test
WHERE name= $1`,
        [name]
    )
    .then((result) => console.log(result))
    .catch((e) => console.log(e.stack))
    .then(() => client.end())*/

//1.По указанному id менять статус на false
//2. По указанному id снижать цену на 10%

//1. Получить все ID машинб старше 2018
//2. Снизить цену на полученные авто на 5%

//1. Дабавить новый автомобиль
//2. Получить данного свободного менеджера
//3. Назначить ему для продажи новый автомобиль

/*client.query(
    `
    SELECT * 
    FROM test 
    WHERE name=$1
    `,
    [name],
    function (err, res) {
        console.log(err, res)
        client.end()
    }
)*/

console.log(1)

/*query(query, cb){
    ...
    ...
    response=...
    er=...q
    cb(err, response)
}*/
