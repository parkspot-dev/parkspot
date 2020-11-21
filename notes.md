# MPA setup

In `vue.config.js`

```js
module.exports = {
	pages: {
		'index': {
			entry: "<entry_path>",
			chunks: [...chunkNames] optional,
			template: <template html fpath> optional,
			title: <name of the page> optional,
			filename: <entry_path_fname> optional
		}
	}
}
```

now how do we arrange the components and what happens to routes in vue-router?
