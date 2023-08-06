# demo

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out the [documentation](https://nuxtjs.org).

## Directories
### `layouts`
Layouts are a great help when you want to change the look and feel of your Nuxt app, whether you want to include a sidebar or have distinct layouts for mobile and desktop.

### `pages`
This directory contains your application views and routes. Nuxt will read all the `*.vue` files inside this directory and setup Vue Router automatically.


### `plugins`
The plugins directory contains JavaScript plugins that you want to run before instantiating the root Vue.js Application. This is the place to add Vue plugins and to inject functions or constants. Every time you need to use `Vue.use()`, you should create a file in `plugins/` and add its path to plugins in `nuxt.config.js`.

### `static`
This directory contains your static files. Each file inside this directory is mapped to `/`.
Example: `/static/robots.txt` is mapped as `/robots.txt`.

### `server`
This directory contains your backend Node.js

# Api

- Base Url: https://wallet-high-level-9cf821e9dba6.herokuapp.com
- Db Design: https://drive.google.com/file/d/1K6m35T0JxQBSk0jorh9TmaFf-XQQhOCp/view?usp=sharing
#### End points
- Setup the wallet
	- Url: /api/v1//wallet/setup: Setup and load wallet initially
		- Request 
			`{
				  name: string,
				  balance: number(optional)
			}`
		- Response 
			`{
				id: ObjectId,
				balance: number,
				transactionId: ObjectId,
				name: string,
				date: JS Date
			}`
	- Url: /api/v1/wallet/:id : Fetch wallet details
		- Response
			`{
				id:  ObjectId,
				balance: number,
				name: string,
				date:  Js Date
			}`
	- Url: /api/v1/transactions/:id : Fetch wallet details
		- Request 
			`{  
				 amount:  Number,  
				 Description: string  
			}`
		- Response
			`{
				  balance: number,  
				  transactionId:  ObjectId 
			}`
	- Url: /transactions?walletId={walletId}&skip={skip}&limit={limit}
		 - Request
			`{
				  walletId: ObjectId,  
				  skip: number,  
				  limit: number  
			 }`
		- Response
			`{
				  totalCount: number,
				  transactions: [{
						id: ObjectId
						walletId: ObjectId
						amount: number,
						balance: number,
						description:  string
						updatedAt: js date
						type: string
					}]
			}`

