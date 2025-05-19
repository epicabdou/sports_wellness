/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "deleteRule": "id = @request.auth.id || @request.auth.isAdmin = true",
    "listRule": "id = @request.auth.id || @request.auth.isAdmin = true",
    "updateRule": "id = @request.auth.id || @request.auth.isAdmin = true",
    "viewRule": "id = @request.auth.id || @request.auth.isAdmin = true"
  }, collection)

  // add field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "bool2165931080",
    "name": "isAdmin",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "bool3003982760",
    "name": "isSuspended",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "date3471284968",
    "max": "",
    "min": "",
    "name": "lastConnected",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "deleteRule": "id = @request.auth.id",
    "listRule": "id = @request.auth.id",
    "updateRule": "id = @request.auth.id",
    "viewRule": "id = @request.auth.id"
  }, collection)

  // remove field
  collection.fields.removeById("bool2165931080")

  // remove field
  collection.fields.removeById("bool3003982760")

  // remove field
  collection.fields.removeById("date3471284968")

  return app.save(collection)
})
