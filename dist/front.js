var cr = 128,
    cg = 0,
    cb = 0,
    isshow = true,
    color = "RGB(128,0,0)";let worker = new Worker("./dist/back.js");
worker.onmessage = (event) => {flush(event.data)}
worker.postMessage({opt:"init"})
function flush(src) {
  eval(src)
  const vdom = createElement("div", null, createElement("h1", {
  style: {
    "margin": "auto",
    "text-align": "center"
  }
}, "\u4E00\u4E2A\u67AF\u71E5\u7684RGB\u5BF9\u7167"), createElement("div", {
  style: {
    "height": "100px"
  }
}), createElement("div", {
  style: {
    "height": "200px",
    "width": "200px",
    "margin": "auto",
    background: color
  }
}), createElement("h4", {
  _tt_if: isshow,
  style: {
    "text-align": "center"
  },
  className: "list"
}, " R:", cr, " G:", cg, " B:", cb, " "), createElement("div", {
  style: {
    "height": "200px",
    "width": "400px",
    "margin": "auto"
  }
}, createElement("button", {
  type: "button",
  style: {
    "height": "50px",
    "width": "100px"
  },
  onclick: "changer()"
}, "R"), createElement("button", {
  type: "button",
  style: {
    "height": "50px",
    "width": "100px"
  },
  onclick: "changeg()"
}, "G"), createElement("button", {
  type: "button",
  style: {
    "height": "50px",
    "width": "100px"
  },
  onclick: "changeb()"
}, "B"), createElement("button", {
  type: "button",
  _tt_if: isshow,
  style: {
    "height": "50px",
    "width": "100px"
  },
  onclick: "hidden()"
}, "\u9690\u85CF"), createElement("button", {
  type: "button",
  _tt_else: isshow,
  style: {
    "height": "50px",
    "width": "100px"
  },
  onclick: "open()"
}, "\u663E\u793A")));let r = document.getElementById('root')
  r.innerHTML = ""
  render(vdom,r)
}//-----------------------------------

function isTextVdom(vdom) {
    return typeof vdom == 'string' || typeof vdom == 'number';
}

function isElementVdom(vdom) {
    return typeof vdom == 'object' && typeof vdom.type == 'string';
}

export const render = (vdom, parent = null) => {
    const mount = parent ? (el => parent.appendChild(el)) : (el => el);
    
    if (isTextVdom(vdom)) {
        return mount(document.createTextNode(vdom));
    } else if (isElementVdom(vdom)) {
        const dom = mount(document.createElement(vdom.type));
        //过滤掉_tt_for _tt_if
        let ifstate = false
        for (const child of [].concat(...vdom.children)) {// children 元素也是 数组，要拍平
            
            if (typeof child == "object" &&
                (   child.props.hasOwnProperty("_tt_if")
                || child.props.hasOwnProperty("_tt_elif")
                || child.props.hasOwnProperty("_tt_else"))) {
                if (ifstate == false &&
                    (   child.props["_tt_if"]
                        || child.props["_tt_elif"]
                        || child.props.hasOwnProperty("_tt_else"))) {
                    render(child, dom);
                    ifstate = true;
                }
            }
            else {
                ifstate = false;
                render(child, dom);
            }
        }
        for (const prop in vdom.props) {
            setAttribute(dom, prop, vdom.props[prop]);
        }
        return dom;
    } else {
        throw new Error(`Invalid VDOM: ${vdom}.`);
    }
};

function isEventListenerAttr(key, value) {
    return typeof value == 'string' && key.startsWith('on');
}

function isStyleAttr(key, value) {
    return key == 'style' && typeof value == 'object';
}

function isPlainAttr(key, value) {
    return typeof value != 'object' && typeof value != 'function';
}

const setAttribute = (dom, key, value) => {
    if (isEventListenerAttr(key, value)) {
        //这里的listener要转化为一个worker里面的东西 只传递函数名
        const eventType = key.slice(2).toLowerCase();
        let func = () => {
            worker.postMessage({opt:"event",worker:`${value}`})
        }
        dom.addEventListener(eventType, func);
        console.log("listen",func)
    } else if (isStyleAttr(key, value)) {
        Object.assign(dom.style, value);
    } else if (isPlainAttr(key, value)) {
        dom.setAttribute(key, value);
    }
}

export const createElement = (type, props, ...children) => {
    if (props === null)  props = {};
    return {type, props, children};
};

