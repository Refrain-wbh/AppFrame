const { DEFAULT_EXTENSIONS } = require('@babel/core');
var babel = require('babel-core');
var t = require('babel-types')
var fs = require("fs")



var back_jsx = fs.readFileSync("./src/back.js").toString()
const back_ast = require("@babel/core").parseSync(back_jsx, {
    presets: [
        [
            '@babel/preset-react',
            {
                pragma: 'createElement'
            }
        ]
    ]
})
var dataset = null

const dataVisitor = {
    FunctionDeclaration(path) {
        if (path.node.id.name == "data")
        {
            let body = path.node.body.body
            for (let i = 0; i < body.length; ++i){
                var state = body[i]
                if (t.isReturnStatement(state))
                {
                    dataset = state.argument;
                    let detor = t.variableDeclarator(t.identifier("data"),dataset)
                    path.replaceWith(t.variableDeclaration("var",[detor]))
                    break;
                }
            }
            if (dataset != null)
            {
                var  varlist = []
                for (let i = 0; i < dataset.properties.length; ++i){
                    let pp = dataset.properties[i]
                    varlist.push(t.variableDeclarator(pp.key,pp.value))
                }
                dataset = t.variableDeclaration("var", varlist)    
                dataset = t.program([dataset])
            }

            path.stop()
        }
    }
}
back_jsx = require("@babel/core").transformFromAst(back_ast, back_jsx, {
    plugins: [{
        //前面的Visitor
        visitor: dataVisitor
    }]
}).code;


var dataDeclar = require("@babel/core").transformFromAst(dataset);
dataDeclar = dataDeclar.code


const back_code = back_jsx+"this.addEventListener('message', (event) => {\n\
    e = event.data\n\
    if (e.opt != 'init') \n\
    eval(e.worker)\n\
  let src = ''\n\
  for (var key in data) {\n\
    let value = data[key]\n\
    if(typeof value == 'string')\n\
      src += `${key} = '${value}';`\n\
    else \n\
      src += `${key} = ${value};`\n\
  }\n\
  this.postMessage(src); \n\
})"
fs.writeFileSync("./dist/back.js",back_code)


/*
const backVisitor = {
    ReturnStatement(path) {
        if (path.parent.type == "Program")
        {
            if (t.isObjectExpression(path.node.argument)) {
                var varlist = path.node.argument.properties
                
            }
            
        }
        
    }
}

*/


// 生成前端代码
const jsx =  fs.readFileSync("./src/front.html").toString()

//const result = require("@babel/core").transformFileSync("./src/main.html")
//console.log(result.code)
const ast = require("@babel/core").parseSync(jsx, {
    presets: [
        [
            '@babel/preset-react',
            {
                pragma: 'createElement'
            }
        ]
    ]
})
const frontVistor = {
    // 将 if for 去除命名空间
    JSXAttribute(path) {
        if (t.isJSXNamespacedName(path.node.name)
            && path.node.name.namespace.name == "tt"){
            //name sapce 替换
            path.node.name  = t.jSXIdentifier("_tt_" + path.node.name.name.name)  
        }
    },
}
const result = require("@babel/core").transformFromAst(ast, jsx, {
    plugins: [{
        //前面的Visitor
        visitor: frontVistor
    }]
});

const result1 = require("@babel/core").transformSync(result.code, {
    presets: [
        [
            '@babel/preset-react',
            {
                pragma: 'createElement'
            }
        ]
    ]
});


var fcode = result1.code 
fcode = dataDeclar + `let worker = new Worker("./dist/back.js");
worker.onmessage = (event) => {flush(event.data)}
worker.postMessage({opt:"init"})
function flush(src) {
  eval(src)
  const vdom = ` + fcode +
  `let r = document.getElementById('root')
  r.innerHTML = ""
  render(vdom,r)
}`

dong = fs.readFileSync("./helper.js")
fcode += "//-----------------------------------\n"+dong
fs.writeFileSync("./dist/front.js", fcode)







/*
const Visitor = {
    JSXAttribute(path) {
        if (t.isJSXNamespacedName(path.node.name)
            && path.node.name.namespace.name == "tt"){
            //name sapce 替换
            path.node.name  = t.jSXIdentifier("_tt_" + path.node.name.name.name)  
        }
        if (t.isJSXExpressionContainer(path.node.value)) {
            path.node.value = path.node.value.expression
        }
        let newattr = t.objectProperty(t.identifier(path.node.name.name),
            path.node.value)
        console.log("asdasd", newattr)
        path.node.value = newattr
        //t.jSXAttribute(path.node.name,":",)
        //path.node = newattr
    },
    JSXElement: {
        exit(path) {
            const attrs = path.node.openingElement.attributes
            let propslist = []
            for (const attr of attrs)
                propslist.push(attr.value)
            let props = t.objectExpression(propslist)
            console.log(propslist)
            let func = t.callExpression(t.identifier("createElement"),[props])
            path.replaceWith(func)
        } 
    }
};
 
const result = require("@babel/core").transformFromAst(ast, jsx, {
    plugins: [{
        //前面的Visitor
        visitor: Visitor
    }]
});
console.log(result.code)
/*
const result1 = require("@babel/core").transformSync(jsx, {
    presets: [
        [
            '@babel/preset-react',
            {
                pragma: 'createElement'
            }
        ]
    ]
});
  
console.log(result1.code)
/*
var result = babel.transform(code, {
    plugins: [{
        //前面的Visitor
        visitor: Visitor
    }]
})



console.log(result, 1)




/*
const result1 = require("@babel/core").transformSync(jsx, {
    presets: [
        [
            '@babel/preset-react',
            {
                pragma: 'createElement'
            }
        ]
    ]
});
  
console.log(result1.code)
/**
  var _this = this
*func = function () {

console.log(_this.b, 3);

}; 

*/
