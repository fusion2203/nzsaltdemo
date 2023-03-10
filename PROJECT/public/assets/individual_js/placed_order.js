document.addEventListener("DOMContentLoaded",renderOrders)

async function renderOrders()
{
  data = await fetch('/admin/get_orders/placed',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })  
  orders  = await data.json();
  console.log(orders)
  orders = groupBy(orders, 'Order_id');
  orders = Object.entries(orders);
  const order_container = Array.from(document.getElementsByClassName('order_container'));
  order_container.forEach(element=> {
    element.remove();
  });
  console.log(orders)
  let parent = document.getElementById("orders")
  for (let i = 0; i < orders.length; i++) {
    let order_container = document.createElement("div");
    order_container.classList.add("order_container", "mb-30");
    order_container.setAttribute("id",orders[i][0])
    
    let element = document.createElement("span");
    element.classList.add("mb-2");
    element.innerHTML = "Order ";
    order_container.appendChild(element);

    element = document.createElement("b")
    element.innerHTML = "#" + orders[i][0];
    order_container.appendChild(element);

    let request_information = document.createElement("div");
    
    request_information.classList.add("request_information", "mb-2")
    element = document.createElement("span");
    element.classList.add("mb-2");
    element.innerHTML = "Order Received On : " + orders[i][1][0]['date'];
    request_information.appendChild(element);
    order_container.appendChild(request_information);

    let order_details = document.createElement("div");
    order_details.classList.add("order_details", "mb-2");

    let user_details = document.createElement("div");
    user_details.classList.add("user_details", "mb-2");

    let heading  = document.createElement('span');
    heading.classList.add('heading','mb-2');
    heading.innerHTML ="User Information";
    user_details.appendChild(heading);

    let need = ["Name", "Email Id", "Address", "City", "State", "Pin Code", "Contact Number"]
    let userDetails = Object.keys(orders[i][1][0]).filter(key => need.includes(key))
    console.log(userDetails)
    userDetails = userDetails.reduce((obj,key)=>{
      obj[key]  = orders[i][1][0][key];
      return obj;
    },{})
    console.log(userDetails)
    for(let key in userDetails)
    {
      let information = document.createElement("div");
      information.classList.add("information");
      element = document.createElement("span");
      element.classList.add("title");
      element.innerHTML=key;
      information.appendChild(element);

      element = document.createElement("span");
      element.classList.add("detail")
      element.innerHTML= " : " + userDetails[key];
      information.appendChild(element);
      user_details.appendChild(information);
    } 
    order_details.appendChild(user_details);


    let order_information = document.createElement('div');
    order_information.classList.add('order_information')
    heading  = document.createElement('span');
    heading.classList.add('heading','mb-2');
    heading.innerHTML ="Order Information";
    order_information.appendChild(heading);
    let orderDetails = orders[i][1];
    for(let n=0;n<orderDetails.length;n++)
    {
        let details = orderDetails[n];
        let detail_row = document.createElement('div');
        detail_row.classList.add('detail_row');
        
        
        element = document.createElement("span");
        element.classList.add("product");
        element.innerHTML= (n+1)+")  " + details['product_name'] + " | " + details['product_type'] + " | " + details['product_type_des'] + " | " + details['ordered_product_qty'];
        detail_row.appendChild(element);
  
        element = document.createElement("span");
        element.classList.add("product_price")
        element.innerHTML= "<i class='fa fa-inr'></i> "+details['ordered_product_total_price']; 
        detail_row.appendChild(element);

        order_information.appendChild(detail_row);
    }  
    let last = document.createElement('div');
    last.classList.add('detail_row','last');

    let place = document.createElement('div')
    last.appendChild(place)

    let total = document.createElement('span');
    total.innerHTML = "Total Amount : <i class='fa fa-inr'></i> "+orders[i][1][0]['total_price']; 
    last.appendChild(total)

    order_information.appendChild(last);
  
    order_details.appendChild(order_information);
    order_container.appendChild(order_details);
    parent.appendChild(order_container)
  }
}



const groupBy = (array, key) => {
  return array.reduce((result, currentValue) => {
    (result[currentValue[key]] = result[currentValue[key]] || []).push(
      currentValue
    );
    return result;
  }, {});
};
