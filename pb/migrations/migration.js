migrate(app => {
  let oldusers = app.findCollectionByNameOrId("users")
  app.delete(oldusers)
  let superusers = app.findCollectionByNameOrId("_superusers")

  let record = new Record(superusers)

  // This should be communicated to the user, or be set by the user.
  record.set("email", "test@example.com")
  record.set("password", "1234567890")

  app.save(record)
  const data = [
    {
      "id": "pbc_1170220047",
      "listRule": "",
      "viewRule": "",
      "createRule": "",
      "updateRule": null,
      "deleteRule": null,
      "name": "timeouts",
      "type": "base",
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "select1542800728",
          "maxSelect": 1,
          "name": "source",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "select",
          "values": [
            "silverbullet",
            "grenade",
            "blaster",
            "tnt",
            "watergun"
          ]
        },
        {
          "cascadeDelete": false,
          "collectionId": "pbc_3754236674",
          "hidden": false,
          "id": "relation2654300544",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "attacker",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "cascadeDelete": false,
          "collectionId": "pbc_3754236674",
          "hidden": false,
          "id": "relation1181691900",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "target",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text1106920551",
          "max": 0,
          "min": 0,
          "name": "attackername",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text3696772361",
          "max": 0,
          "min": 0,
          "name": "targetname",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": false,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": false,
          "type": "autodate"
        }
      ],
      "indexes": [],
      "system": false
    },
    {
      "id": "pbc_732127569",
      "listRule": "",
      "viewRule": "",
      "createRule": "",
      "updateRule": "",
      "deleteRule": null,
      "name": "ttvauth",
      "type": "base",
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "json4175343705",
          "maxSize": 0,
          "name": "auth",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "json"
        }
      ],
      "indexes": [],
      "system": false
    },
    {
      "id": "pbc_3754236674",
      "listRule": "",
      "viewRule": "",
      "createRule": "",
      "updateRule": "",
      "deleteRule": null,
      "name": "users",
      "type": "base",
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text3605594593",
          "max": 0,
          "min": 0,
          "name": "twitchid",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text2208304744",
          "max": 0,
          "min": 0,
          "name": "firstname",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "json2972535350",
          "maxSize": 0,
          "name": "inventory",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "json"
        },
        {
          "hidden": false,
          "id": "json1357546519",
          "maxSize": 0,
          "name": "itemuses",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "json"
        },
        {
          "hidden": false,
          "id": "number2901680126",
          "max": null,
          "min": null,
          "name": "balance",
          "onlyInt": true,
          "presentable": false,
          "required": false,
          "system": false,
          "type": "number"
        },
        {
          "hidden": false,
          "id": "date1396401990",
          "max": "",
          "min": "",
          "name": "lastlootbox",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "date"
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": false,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": false,
          "type": "autodate"
        }
      ],
      "indexes": [
        "CREATE UNIQUE INDEX `idx_MR0pV8SUAF` ON `users` (`twitchid`)"
      ],
      "system": false
    }
  ]
  return app.importCollections(data, false)
}, () => {
  return null
})
