document.addEventListener("DOMContentLoaded",renderUsers)

async function renderUsers()
{
  data = await fetch('/admin/get_users/all',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  users = await data.json()
  const users_container = Array.from(document.getElementsByClassName('user_container'));
  users_container.forEach(element=> {
    element.remove();
  });
  let parent = document.getElementById("users")
  for (let i = 0; i < users.length; i++) {
    let user_container = document.createElement("div");
    user_container.classList.add("user_container", "mb-30");
    user_container.setAttribute("id",users[i].User_Id)
    
    let element = document.createElement("span");
    element.classList.add("mb-2");
    element.innerHTML = "Login ";
    user_container.appendChild(element);

    element = document.createElement("b")
    element.innerHTML = "#" + users[i].User_Id;
    user_container.appendChild(element);

    let request_information = document.createElement("div");
    request_information.classList.add("request_information", "mb-2")
    element = document.createElement("span");
    element.classList.add("mb-2");
    element.innerHTML = users[i]["time_stamp"];
    request_information.appendChild(element);

    let approval_status = document.createElement("div")
    approval_status.classList.add("approval_status");
    element = document.createElement("label");
    element.innerHTML = "Approval Status :";
    approval_status.appendChild(element);
    element = document.createElement("span");
    if (users[i].Status === "APPROVED") {
      element.classList.add("green");
      element.innerHTML = " Approved";
    }
    else if (users[i].Status === "PENDING") {
      element.classList.add("red");
      element.innerHTML = " Pending";
    }
    else if (users[i].Status === "REJECTED") {
      element.classList.add("red");
      element.innerHTML = " Rejected";
    }
    approval_status.appendChild(element);
    request_information.appendChild(approval_status);    
    user_container.appendChild(request_information);
    let user_details = document.createElement("div");
    user_details.classList.add("user_details", "mb-2");
    let need = ["Name", "Email Id", "Address", "City", "State", "Pin Code", "Contact Number"]
    let details = Object.keys(users[i]).filter(key => need.includes(key))
    details = details.reduce((obj,key)=>{
      obj[key]  = users[i][key];
      return obj;
    },{})
    for(let key in details)
    {
      let information = document.createElement("div");
      information.classList.add("information");
      element = document.createElement("span");
      element.classList.add("title");
      element.innerHTML=key;
      information.appendChild(element);

      element = document.createElement("span");
      element.classList.add("detail")
      element.innerHTML= " : " + details[key];
      information.appendChild(element);
      user_details.appendChild(information);
    } 
    user_container.appendChild(user_details);
    element = document.createElement("button");
    element.onclick=function(event){changeUserRequest(event)}
    if (users[i].Status === "APPROVED") {
      element.innerHTML = "Reject";
      element.classList.add('Reject')
    }
    else if (users[i].Status === "REJECTED") {
      element.innerHTML = "Approve";
      element.classList.add('Approve')
    }
    else if (users[i].Status === "PENDING") {
      element.innerHTML = "Approve";
      element.classList.add('Approve')
    }
    user_container.appendChild(element);

    parent.appendChild(user_container)
  }
}

function changeUserRequest(event)
{   
  if(confirm('Are you sure?') === false)return;
    let new_status="";
    if(event.target.classList.contains("Reject"))
    {
      new_status = 'REJECTED'
    }
    else if(event.target.classList.contains("Approve"))
    {
      new_status = 'APPROVED'
    }
    let User_Id = event.target.parentElement.id;

    fetch(`/admin/change_user_request/${User_Id}/${new_status}`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response=>response.json())
    .then(data => {
      if(data.message === "Success")
      {
        alert("User Status Changed")
      }
      else if(data.message === 'Error')
      {
        alert('Theresome error,Try again!!')
      }
      renderUsers();
    });
}