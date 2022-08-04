var data = {
  cr: 128,
  cg: 0,
  cb: 0,
  isshow: true,
  color: "RGB(128,0,0)"
};

function changer() {
  data.cr = Math.floor(Math.random() * 255);
  data.color = `RGB(${data.cr},${data.cg},${data.cb})`;
}

function changeg() {
  data.cg = Math.floor(Math.random() * 255);
  data.color = `RGB(${data.cr},${data.cg},${data.cb})`;
}

function changeb() {
  data.cb = Math.floor(Math.random() * 255);
  data.color = `RGB(${data.cr},${data.cg},${data.cb})`;
}

function hidden() {
  data.isshow = false;
}

function open() {
  data.isshow = true;
}this.addEventListener('message', (event) => {
    e = event.data
    if (e.opt != 'init') 
    eval(e.worker)
  let src = ''
  for (var key in data) {
    let value = data[key]
    if(typeof value == 'string')
      src += `${key} = '${value}';`
    else 
      src += `${key} = ${value};`
  }
  this.postMessage(src); 
})