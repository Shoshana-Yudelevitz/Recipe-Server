# Server Recipe

## Installation

### Before starting the server, make sure to install the necessary Node.js modules:

### npm install


## Environment Variables

Create a `.env` file in the root directory of your project and add the following environment variables:

| dotenv
| Variable     | Description                                                |
| ------------ | ---------------------------------------------------------- |
| DB_URL       | MongoDB connection URL for your database.                  |
| PORT         | Port number on which the server will run.                  |
| BCRYPT_SALT  | Number of salt rounds for bcrypt hashing.                  |
| JWT_SECRET   | Secret key used for signing JWT tokens.                    |



## Endpoints

### Users Resource

| URL                                      | Method | Description                    | Permissions     | Parameters          | Optional Parameters | Body                | Headers         | Returns | Status Codes |
| ---------------------------------------- | ------ | ------------------------------ | --------------- | ------------------- | ------------------- | ------------------- | --------------- | ------- | ------------ |
| [http://localhost:5000/users/signIn](http://localhost:5000/user/signIn) | POST   | User sign in|-|-|-|{email,password}|user+token|-| 204|
| [http://localhost:5000/users/signUp](http://localhost:5000/user/signUp) | POST   | User sign up|-|-|-|{userName,email,password,address}| User+token|-|204|
| [http://localhost:5000/users](http://localhost:5000/user)| GET    | Get all users| admin|-|-|-||all user      | 200           |
|

### Recipes Resource

| URL| Method | Description                      | Permissions     | Parameters          | Optional Parameters | Body               | Headers         | Returns | Status Codes |
| ------------------------------------------------------------- | ------ | -------------------------------- | --------------- | ------------------- | ------------------- | ------------------ | --------------- | ------- | ------------ |
| [http://localhost:5000/recipes/](http://localhost:5000/recipe/) | GET    | Get all recipes|-| -|serach value ,start page ,per page | -| -| all recipes | 200|
| [http://localhost:5000/recipes/:id](http://localhost:5000/recipe/:id) | GET    | Get recipe by ID                 | - |{id}|-|-|-|recipe by *id*|200|
| [http://localhost:5000/recipes/getDetailsByUser/:id](http://localhost:5000/recipe/getDetailsByUser/:id) | GET    | Get recipes by user ID           | - |administrator /current user|{userId}|-|token|recipes by user ID  |200|
| [http://localhost:5000/recipes/getDetailsByTime/:time](http://localhost:5000/recipe/getDetailsByTime/:time) | GET    | Get recipes until this time | - |{time}|-|-|-|recipe by *time*|200|
| [http://localhost:5000/recipes/addRecipe](http://localhost:5000/recipe/addRecipe) | POST   | add recipe  |administrator /current user|-|-|{recipe}|token|new recipe added|204|
| [http://localhost:5000/recipes/:id](http://localhost:5000/recipe/:id) | PUT    |   update existing reipe  (by *recipe id*) | administrator/curren user |{id}|-|{new recipe}|token|return  updated recipe|204|
| [http://localhost:5000/recipes/:id](http://localhost:5000/recipe/:id) | DELETE |   delete existing reipe  (by *recipe id*) | administrator/curren user |{id}|-|-|token|-|204|
| [http://localhost:5000/recipes/](http://localhost:5000/recipe/) | POST   |  check if the token and the id its the same user  |-|-|-|-|token|new recipe added|200|
### Categories Resource

| URL                                                              | Method | Description                      | Permissions     | Parameters          | Optional Parameters | Body               | Headers         | Returns | Status Codes |
| ---------------------------------------------------------------- | ------ | -------------------------------- | --------------- | ------------------- | ------------------- | ------------------ | --------------- | ------- | ------------ |
| [http://localhost:5000/categories](http://localhost:5000/categories) | GET    | Get all categories             | everyone|-|-|-|all |all category|200|        
| [http://localhost:5000/categories/getAllCategoryByRecipes/:name](http://localhost:5000/categories/getAllCategoryByRecipes/:name) | GET    | get all category with recipe|-everyone|{name}|-|-|-|all category with recipe |200|
| [http://localhost:5000/categories/getCategoryById/:id'](http://localhost:5000/categories/getCategoryById/:id') | GET    | get category by id with recipe| everyone |{id}|-|-|-|category by id with recipes |200|

```







