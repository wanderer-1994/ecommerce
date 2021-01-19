import $ from "jquery";

function makeNestedMenu(arr, parent_path){
    let result = [];
    arr.forEach((item, index) => {
      if((item.category_path.split("/").length -1 == parent_path.split("/").length) && item.category_path.indexOf(parent_path) == 0){
        let item_copy = {...item};
        item_copy.children = makeNestedMenu(arr, item.category_path);
        result.push(item_copy);
      }
    })
    result.sort((a, b) => {
      return a.priority > b.priority;
    })
    return result;
}

function expanseNestedMenu(result, arr){
  arr.sort((a, b) => {return a.priority - b.priority});
  arr.forEach(item => {
    let item_copy = {...item};
    delete item_copy.children;
    result.push(item_copy);
    if(item.children && item.children.length > 0){
      item.children.sort((a, b) => {return a.priority - b.priority});
      expanseNestedMenu(result, item.children);
    }
  })
}

function getMenuInOrder(result, arr){
    expanseNestedMenu(result, makeNestedMenu(arr, ""));
};

function removeVnCharacter(str){
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  return str;
}

function resolvePaginationUrl(curLocation, newPageNumber){
  let newUrl = "";
  if(curLocation.search.indexOf("page=") > -1){
    newUrl = curLocation.search.replace(/page=\d*/, `page=${newPageNumber}`);
  }else if(curLocation.search.length > 0){
    newUrl = curLocation.search + `&page=${newPageNumber}`;
  }else{
    newUrl = `?page=${newPageNumber}`;
  }
  newUrl = curLocation.pathname + newUrl;
  return newUrl;
}

function convertTimeStamp(timeStamp, option){
  let date = new Date(timeStamp);
  let min = date.getMinutes();
  let hr = date.getHours();
  let d = date.getDate();
  let m = date.getMonth() + 1;
  let y = date.getFullYear();
  if(min < 10) min = "0" + min;
  if(hr < 10) hr = "0" + hr;
  if(d < 10) d = "0" + d;
  if(m < 10) m = "0" + m;
  if(!option) option = "dd-mm-yyyy";
  return option.replace(/MM/, `${min}`).replace(/HH/, `${hr}`).replace(/dd/, `${d}`).replace(/mm/, `${m}`).replace(/yyyy/, `${y}`);
}

function convertWarrantyPeriod(timestamp_string){
  try{
    let warranty_timestamp = parseInt(timestamp_string);
    if(warranty_timestamp <= 0) return "Test";
    let number_of_date = parseInt(warranty_timestamp/(24*60*60*1000));
    if(number_of_date <= 90){
      return `${number_of_date} ngày`;
    }else{
      let number_of_month = parseInt(number_of_date/30);
      return `${number_of_month} tháng`;
    }
  }catch(err){
    return "";
  }
}

function convertWarrantyExpire(buy_timestamp, warranty_timestamp){
  try{
    let expired_timestamp = parseInt(buy_timestamp) + parseInt(warranty_timestamp);
    return convertTimeStamp(expired_timestamp);
  }catch(err){
    return "";
  }
}

function checkWarranty(buy_timestamp, warranty_timestamp){
  let expired_timestamp = parseInt(buy_timestamp) + parseInt(warranty_timestamp);
  let cur_timestamp = Date.now();
  if(expired_timestamp > cur_timestamp) return true;
  return false;
}

function resolveProduct(ori_product){
  let product = {...ori_product};
  for(let i in product){
    if(product[i] != null && typeof(product[i]) != "number"){
      product[i] = unescape(product[i]);
    }
  }
  return product;
}

function unescapeSelectedData(ori_data_array){
  let data_array = [];
  ori_data_array.forEach((data_item, index) => {
      let new_data_item = {};
      for(let i in data_item){
        new_data_item[i] = unescape(data_item[i]);
        new_data_item.status = unescape(data_item.status)
      }
      data_array.push(new_data_item);
  })
  return data_array;
}

function sortOrderByTimestampId(ori_orders){
  try{
      if(!ori_orders) return [];
      let orders = JSON.parse(JSON.stringify(ori_orders));
      let sorted_orders = [];
      orders.forEach(order_item => {
          let match_bill = sorted_orders.find(item => {return item.timestamp_id == order_item.timestamp_id});
          if(!match_bill){
              sorted_orders.push({
                  timestamp_id: order_item.timestamp_id,
                  products: [{...order_item}]
              });
          }else{
              match_bill.products.push({...order_item});
          }
      })
      return sorted_orders;
  }catch(err){
      console.log(err);
      return [];
  }
}

function sortOrderByProduct_n_Status(ori_orders){
  try{
    if(!ori_orders) return [];
    let orders = JSON.parse(JSON.stringify(ori_orders));
    let sorted_orders = [];
    orders.forEach(order_item => {
        let match_group = sorted_orders.find(item => {return (item.prod_id == order_item.prod_id)});
        if(!match_group){
            sorted_orders.push({...order_item, order_qty: [order_item.order_qty], note: [order_item.note], status: [order_item.status], ship_qty: [order_item.ship_qty]});
        }else{
            match_group.order_qty.push(order_item.order_qty);
            match_group.note.push(order_item.note);
            match_group.status.push(order_item.status);
            match_group.ship_qty.push(order_item.ship_qty);
        }
    })
    return sorted_orders;
}catch(err){
    console.log(err);
    return [];
}
}

function calculateSalePrice(rootPrice, saleoff_percent){
  saleoff_percent = parseFloat(saleoff_percent);
  if(saleoff_percent < 0) saleoff_percent = 0;
  let sale_price = rootPrice*(100 - saleoff_percent)/100;
  if(sale_price > 1000) sale_price = Math.round(sale_price/1000)*1000;
  return sale_price;
}

function toggleSidebar(){
  let cur_display_state = $(".UserSidebar").css("display");
  if(cur_display_state == "none"){
    $(".UserSidebar").fadeIn(100);
    $("body").css("overflow", "hidden");
  }else{
    $(".UserSidebar").fadeOut(100);
    $("body").css("overflow", "auto");
  }
}

function toggleAdminSidebar(){
  let cur_display_state = $(".AdminSidebar").css("display");
  if(cur_display_state == "none"){
    $(".AdminSidebar").fadeIn(100);
    $("body").css("overflow", "hidden");
  }else{
    $(".AdminSidebar").fadeOut(100);
    $("body").css("overflow", "auto");
  }
}

export {
    makeNestedMenu,
    expanseNestedMenu,
    getMenuInOrder,
    removeVnCharacter,
    resolvePaginationUrl,
    convertTimeStamp,
    convertWarrantyPeriod,
    convertWarrantyExpire,
    checkWarranty,
    resolveProduct,
    sortOrderByTimestampId,
    sortOrderByProduct_n_Status,
    unescapeSelectedData,
    calculateSalePrice,
    toggleSidebar,
    toggleAdminSidebar
}