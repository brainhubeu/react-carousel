API Documentation
===
* [**Builder**](#builder)
* [**Expression Strings**](#module-tree-expressions)

Builder
---
* [**new Builder()**](#new-builderconfig)
* [**config()**](#builderconfigconfig-saveforreset-ignorebaseurl)
* [**loadConfig()**](#builderloadconfigconfigfile-saveforreset-ignorebaseurl)
* [**loadConfigSync()**](#builderloadconfigsyncconfigfilepath)
* [**reset()**](#builderreset)
* [**invalidate()**](#builderinvalidatemodulename)
* [**bundle()**](#builderbundletree-outfile-options)
* [**buildStatic()**](#builderbuildstatictree-outfile-options)
* [**trace()**](#buildertraceexpression)
* [**addTrees()**](#builderaddtreesfirsttree-secondtree)
* [**subtractTrees()**](#buildersubtracttreesfirsttree-secondtree)
* [**intersectTrees()**](#builderintersecttreesfirsttree-secondtree)

### new Builder(baseURL[, configFilePath])
`baseURL`: Sets the root for the loader  
`configFilePath`: A systemjs config file conforming to the [systemjs config api] (https://github.com/systemjs/systemjs/blob/master/docs/config-api.md)  
#### Example
```javascript
new Builder('/scripts', 'config.js');
```

### builder.config(config)
`config`: An object conforming to the [config api] (https://github.com/systemjs/systemjs/blob/master/docs/config-api.md)  
#### Example
```javascript
builder.config({
  map: {
    'a': 'b.js'
  }
});
```

### builder.loadConfig(configFilePath)
`configFilePath`: A systemjs config file conforming to the [systemjs config api] (https://github.com/systemjs/systemjs/blob/master/docs/config-api.md)  

Returns a promise which resolves when config has been loaded  
#### Example
```javascript
builder.loadConfig('config.js').then(() => {
});
```
### builder.loadConfigSync(configFilePath)
Synchronous version of `builder.loadConfig()`  

`configFilePath`: A systemjs config file conforming to the [systemjs config api] (https://github.com/systemjs/systemjs/blob/master/docs/config-api.md)  
#### Example
```javascript
builder.loadConfigSync('config.js');
```

### builder.reset()
Reset the builder config to its initial state and clear loader registry. This will remove any registered modules, but will maintain the builder's compiled module cache. For efficiency, use [builder.invalidate()](#builderinvalidatemodulename) to clear individual modules from the cache.
#### Example
```javascript
builder.reset();
```

### builder.invalidate(moduleName)
Removes a module from the loader cache

`moduleName`: The name of the module to invalidate, this can include wildcards  

Returns the list of invalidated modules
#### Example
```javascript
builder.invalidate("/jquery.js");
builder.invalidate("someLib/*");
```

### builder.bundle(tree[, outfile][, options])
### builder.bundle(expression[, outfile][, options])
### builder.bundle(moduleNames[, outfile][, options])
Concatenate all modules in the tree or module tree expression and optionally write them out to a file  

`tree`: A tree object as returned from builder.trace(), or one of the arithmetic functions  
`expression`: A [module tree expression](#module-tree-expressions)  
`moduleNames`: An array of exact, unnormalized module names \
**Important**: The module names in `expression` or `moduleNames` should only be `/` separated (On Windows, do NOT use `\` as your path separator for this argument). The module names are specified in URL space; in particular, they are not file-paths. \
`outfile`: The file to write out the bundle to  
`options`: Additional bundle options as outlined below  

Returns a promise which resolves with the bundle content
#### Bundle options
`minify`: Minify source in bundle output _(Default:true)_  
`uglify`: Options to pass to uglifyjs
`mangle`: Allow the minifier to shorten non-public variable names _(Default:false)_  
`sourceMaps`: Generate source maps for minified code _(Default:false)_  
`sourceMapContents`: Include original source in the generated sourceMaps, this will generate a self-contained sourceMap which will not require the browser to load the original source file during debugging   _(Default:false)_  
`lowResSourceMaps`:  When true, use line-number level source maps, when false, use character level source maps _(Default:false)_  
`globalName`: When building a self-executing bundle, assign the bundle output to a global variable _(Default:null)_   
`globalDeps`: When building a self-executing bundle, indicates external dependendencies available in the global context _(Default:{})_  
`fetch`: Override the fetch function to retrieve module source manually _(Default:undefined)_  
`normalize`: Rewrite required module names to their normalized names  _(Default:false)_  
`anonymous`: Compile modules as anonymous modules _(Default:false)_  
`systemGlobal`: The global used to register compiled modules with systemjs _(Default:'System')_  
`format`: Module format to compile modules to _(Default:'umd')_  

#### Example
```javascript
builder.bundle('moduleA.js', { minify:true }).then((bundle) => {
    //bundle contains source to moduleA.js + dependencies
});
```
### builder.buildStatic(tree[, outfile][, options])
### builder.buildStatic(expression[, outfile][, options])
Similar to builder.bundle() but builds a self-executing bundle  

`tree`: A tree object as returned from builder.trace(), or one of the arithmetic functions  
`expression`: A [module tree expression](#module-tree-expressions) \
**Important**: The module names in `expression` or `moduleNames` should only be `/` separated (On Windows, do NOT use `\` as your path separator for this argument). The module names are specified in URL space; in particular, they are not file-paths. \
`outfile`: The file to write out the bundle to  
`options`: Additional bundle options as outlined in `builder.bundle()`  

Returns a promise which resolves with the bundle content
#### Example
```javascript
builder.buildStatic('moduleA.js').then((sfxBundle) => {
    //sfxBundle contains source to moduleA.js + dependencies + self-executing intialization code
});
```

### builder.trace(expression)
Creates the module tree object represented by `expression`  

`expression`: A [module tree expression](#module-tree-expressions) \
**Important**: The module names in `expression` should only be `/` separated (On Windows, do NOT use `\` as your path separator for this argument). The module names are specified in URL space; in particular, they are not file-paths. 

Returns a promise which resolves with the module tree 

#### Example
```javascript
builder.trace('moduleA.js').then((moduleTree) => {
});
```

### builder.addTrees(firstTree, secondTree)
```javascript
let moduleTree = builder.addTrees('moduleA.js', 'moduleB.js')
```

### builder.subtractTrees(firstTree, secondTree)
```javascript
let moduleTree = builder.subtractTrees('moduleA.js', 'moduleB.js');
```

### builder.intersectTrees(firstTree, secondTree)
```javascript
let moduleTree = builder.intersectTrees('moduleA.js', 'moduleB.js');
```

## Module Tree Expressions
`builder.buildStatic`, `builder.bundle` and `builder.trace` accept module tree expressions

### Module Tree
Represents moduleA and all of its dependencies
```javascript
'moduleA.js'
```

### Single Module
Represents moduleA only
```javascript
'[moduleA.js]'
```

### Addition
Represents a tree that combines moduleA, moduleB and their dependencies
```javascript
'moduleA.js + moduleB.js'
```

### Subtraction
Represents a tree that includes moduleA and its dependencies, excluding moduleB and its dependencies
```javascript
'moduleA.js - moduleB.js'
```

### Intersection
Represents the dependencies shared between moduleA and moduleB
```javascript
'moduleA.js & moduleB.js'
```

### Module Glob
Represents the combination of all modules in dirA and their dependencies
```javascript
'dirA/*'
```

### Parenthesis
Use parenthesis to group module tree operations
```javascript
'(moduleA.js & moduleB.js) + moduleC.js'
```
