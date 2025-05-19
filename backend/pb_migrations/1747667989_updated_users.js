/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "authRule": "verified = true && isSuspended = false",
    "listRule": "@request.auth.isAdmin = true"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "authRule": "",
    "listRule": "id = @request.auth.id || @request.auth.isAdmin = true"
  }, collection)

  return app.save(collection)
})
