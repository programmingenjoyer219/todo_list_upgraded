# todo_list_upgraded
I have added the following features to the TODO list:

  -> You can add family members
  
  -> You can use different types of TODO lists like daily, weekly, monthly and yearly.

The Database schema looks something like this:

Name of the database: permalist

There are two tables in this database, namely "users" and "list_items".

"users" table has two columns :- id, name

"list_items" has four columns :- id, title, user_id (foriegn key), item_type

In "list_items", the column "item_type" can take any one of the following values: "daily", "weekly", "monthly" and "yearly"

Here is the SQL for those tables ::

CREATE TABLE users (

  id SERIAL PRIMARY KEY,
  
  name VARCHAR(50)
  
);

CREATE TABLE list_items (

  id SERIAL PRIMARY KEY,
  
  title TEXT,
  
  user_id INTEGER REFERENCES users(id),
  
  item_type TEXT

);
