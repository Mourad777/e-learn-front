export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};

export const uniqueId = (prefix='id') => {
    let lastId = 0;
    lastId++;
    return `${prefix}${lastId}`;
}

export const debounce = (func,delay=1000) => {
    let timeoutID
    return (...args)=> {
        if(timeoutID) {
            clearTimeout(timeoutID)
        }
        timeoutID = setTimeout(()=>{
            func.apply(null,args);
        },delay)
    }
}

  export const throttle = (fn, wait) => {
    var time = Date.now();
    return function() {
      if ((time + wait - Date.now()) < 0) {
        fn();
        time = Date.now();
      }
    }
  }
  