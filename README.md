# zhuangbility

transform string/code into "(([]+{})[+!![]+!![]+!![]])+(([]+![])[+!![]+!![]+!![]])".

## Usage

```shell
npm install -g zhuangbility
```

### To String

```js
zhuangbility "foo bar"
```

Output(may change between different version): 

```
(([]+![])[+[]])+(([]+{})[+!![]])+(([]+{})[+!![]])+(([]+{})[+!![]+!![]+!![]+!![]+!![]+!![]+!![]])+(([]+{})[+!![]+!![]])+(([]+![])[+!![]])+(([]+!![])[+!![]])
```

then, run the magic *(([]+![]...))* code in any JS engine, you will get the input string back:

![](https://raw.githubusercontent.com/walfud/zhuangbility/master/doc/string.png)

### To Code

Use *--runtime* if you want generate a runnable code:

```shell
# Generate magic code to a file
zhuangbility --runtime "console.log('foo bar')" > test.js

# Run the magic code directly
node test.js
```

## Under the Hood

### Hack 1: JS Implicit Conversion

Thanks(F*ck) to the JS Implict Conversion. There lots of magic, such as:

* `+[]` => 0 (Number)
* `[]+[]` => '' (String)
* `![]` => false (Boolean)

#### To String

`[]+...` means `''+...`. we can get a String value zero with `([]+[]) + (+[])`. In JS, String plus a Number, will get number in String version. Also, String plus Boolean will get 'true' or 'false'. 

#### To Number

Easy... `true + true` === `2`. It's says: `(!![] + !![]) === 2`. 

#### Get a character from string

Now, We can get 'f' by `([]+ ![]) [+[]]` (front part `[]+![]` is string 'false', second part `+[]` is number 0, the whole magic is get first char from a string --- `'false'[0]` => 'f')

Let's take full advantage of the above rule:

* `[]+{}`,            // '[object Object]'
* `[]+![]`,           // 'false'
* `[]+!![]`,          // 'true'
* `[]+[][[]]`,        // 'undefined'
* `[]+(+[]+[][[]])`,  // 'NaN'

Now we have many character: 'abcdefj...' and all number.

### Hack 2: Call unescape

You must know that we can't get 'h' with above method. It's lucky that `unescape` can do. But the problem is how can we call a function with '([...])...' ???

This is the second trick: 

1. '[]' is Array object, '[].sort' is a function, '[].sort.constructor' is built-in `Function` object
2. `Function('...')` can create a callable object

Keep in mind: `[].sort.constructor(...)` can create a callable object.

Then, we want have a callable 'unescape':

3. `[].sort.constructor('return unescape')` is equal to `Function('return unescape')`
4. `Function('return unescape')('%6a')` is equal to `unescape('%6a')`

The last trick is `[].sort === []['sort']`.

Let's combine all of above:

`[]['sort']['constructor']('return unescape')('%...')`

You can get all you want...

For more detail, please read the fucking source code.

## Liscence

MIT