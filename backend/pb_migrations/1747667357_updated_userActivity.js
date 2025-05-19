/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_786419837")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != \"\"",
    "listRule": "user.id = @request.auth.id || @request.auth.isAdmin = true",
    "viewRule": "user.id = @request.auth.id || @request.auth.isAdmin = true"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_786419837")

  // update collection data
  unmarshal({
    "createRule": null,
    "listRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
