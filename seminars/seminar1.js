const t=1
console.log(t)

/*
Основные типы данных в нетипизированном JavaScript
var  
const не изменяемый тип данных
let  изменяемый тип данных
*/

const g=[1,2]
console.log(g)
g.push(3)
console.log(g)
// t=[3,4] так нельзя

const obj={
    a:1,
    b:3
}
/* так нельзя
const obj={
    c:1, 
} 
*/
console.log(obj)
obj.c=2
console.log(obj)
console.log(obj.a)

const studebt ={
    name:'Ivan',
    surname: 'Ivanov'
}

//возможный вариант
let formattedStr = "Имя "+ studebt.name+" Фамилия "+ studebt.surname
console.log(formattedStr)

//наилучший вариант
formattedStr=`Name ${studebt.name}, Surname ${studebt.surnamename}`
console.log(formattedStr)

//Автоматическое приведение типов
 
let one =1
let two =2
console.log(one+two)

one =true
console.log(one+two)

console.log(true+true)

one ='1'
console.log(one+two)

console.log(true+one)

console.log('1' + '1')

// == с приведение типов
one =1
two=1
if (one==two){
    console.log('its equal')
}

//=== без приведения типов
one ='1'
if (one===two){
    console.log('its equal')
}

let fl=undefined
if(!fl){
    console.log('its falsy')
}