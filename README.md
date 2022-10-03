# Работа с бд

Взята база данных SQLite

Для общения с фронтом используются следующие **url** запросы

1. `/fetch/createDeal` - для создании сделки
2. `/fetch/deleteDeal` - для удаления сделки из бд
3. `/fetch/getDeals` - для получения списка всех сделок
4. `/fetch/updateDealStatus` - обновление статуса сделок

---

## Пример общения с фронтом

Код, который будет размещаться на фронте лежит в  `js/SQLRequests.js`

В общих чертах конструкция следующая:

```js
fetch('/fetch/createDeal', { method: 'post', body, headers })
.then(resp => {
    if(resp.status < 200 || resp.status >= 300) // если возникла ошибка, то срабатывает исключение и кадет в catch
        throw new Error("connect error");
    return resp.json();
})
.then(json => { 
    ... // выполняется, если не было ошибок
})
.catch(err => {
    ... // выполняется при вылетании ошибки
});
```

В параметр **body** требуется отправить JSON

В **headers** передается ``` const headers = { 'Content-Type': 'application/json' }; ```

---

## Структура ответа

На каждый fetch запрос приходит JSON ответ следующего вида:

```js
JSON.stringify({
    code: statusCode,  // код ответа (если ответ не ноль, то ошибка. Список ошибок ниже)
    msg: msg,
    list: list,
});
```

Параметр **list** поумолчанию пустой (`list = []`). Он не пустой только при запросе `getDeals`.

---

## createDeal

Вызывается, для создания сделки. Необходимый список параметров в JSON:

```js
const body = JSON.stringify({
    buyer: "0x001",
    seller: "0x002",
    value: 50,
});
```
---

## deleteDeal

Вызывается, для удаления сделки по **id**. Этот параметр фронт будет иметь в любом случае, тк он будет передаться при вызове **getDeals** Необходимый список параметров в JSON:

```js
const body = JSON.stringify({
    id: 5,
});
```
---

## getDeals

Вызывается, для получения списка всех сделок в котом задействован аккаунт(там где он покупатель и там где он продавец). Необходимый список параметров в JSON:

```js
const body = JSON.stringify({
    account: "0x001",
});
```
---

## updateDealStatus

Вызывается, для обновления статуса сделки. 

Список статусов сделки:
1. не прочитана (для новых сделок) `status = 0`
2. ждёт подтверждения `status = 1`
3. в процессе  `status = 2`
4. выполнена `status = 3`
5. отменена `status = 4`

Необходимый список параметров в JSON:

```js
const body = JSON.stringify({
    id: 1,
    status: 3,
});
```
---

## Возможные ошибки БД

1. **600** - connection error
2. **610** - create deal error 
   1. **611** - address invalid
   2. **612** - value error
3. **620** - delete deal error
4. **630** - get deals by account error
5. **640** - status update error


