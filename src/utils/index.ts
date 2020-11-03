/**
 *  函数防抖
 *  @param {Function} func  包装的函数
 *  @param {num} delay      延迟时间
 *  @param {boolean} immediate 第一次滚动会执行两次  开始滚动和结束滚动的时候
 *  @return {*}
 */

export const debounce=(func, wait, immediate = false)=>{
  let timeout
  return function(){
    const callnow = immediate && !timeout
    timeout && clearTimeout(timeout)
    timeout = setTimeout(() => {
      timeout = null
      if(!immediate) func.apply(this, arguments);
    }, wait);
    if(callnow) func.apply(this, arguments)
  };
}


export const setStorage = (key:string, value:any) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const getStorage = (key:string) => {
  return JSON.parse(localStorage.getItem(key))
}

export const removeStorage = (key:string) => {
  return localStorage.removeItem(key)
}


export const genPath = (tree, path)=> {
  let arr = [];
  function func(tree, path = null) {
    tree.forEach((item) => {
      if (path) {
        if (item.path == path) {
          arr.push(path);
        } else {
          return;
        }
      } else {
        arr.push(item.path);
      }
      if (item.children) {
        func(item.children);
      }
    });
  }
  func(tree, path);
  return arr;
}