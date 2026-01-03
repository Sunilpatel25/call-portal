
# MongoDB Schema Design for Dynamic Call Portal

To support the requirement of extensibility without code changes, the following schema structure is used.

### 1. Categories Collection
Stores the meta-definitions of call types.
```json
{
  "_id": "ObjectId",
  "name": "A.1 Research Grant",
  "type": "FACULTY", // FACULTY | STUDENT
  "description": "String",
  "fields": [
    {
      "id": "String", // Unique ID for referencing in the Calls collection
      "label": "String", // Display name
      "type": "String", // text | textarea | number | date | select
      "required": "Boolean",
      "options": ["Array of Strings for select types"]
    }
  ]
}
```

### 2. Calls Collection
Uses a flexible `data` object to store values mapped to the `id`s defined in the Category fields.
```json
{
  "_id": "ObjectId",
  "categoryId": "ObjectId(Categories)",
  "title": "String",
  "status": "String", // Draft | Published | Closed
  "createdAt": "Date",
  "data": {
    "pi_name": "Dr. Sarah Connor",
    "funding": 50000,
    "deadline": "2024-12-31"
    // Any other fields defined by the category
  }
}
```

### Scalability for Future Types:
To add "Event Grant" or "Training Opportunity":
1. The Admin simply adds a new document to the `Categories` collection.
2. They define the required fields in the `fields` array.
3. The frontend `App.tsx` automatically fetches all categories and lists them.
4. The `DynamicForm.tsx` iterates over the `fields` array to render inputs.
5. NO code changes are required on the server or client to support these new types.
