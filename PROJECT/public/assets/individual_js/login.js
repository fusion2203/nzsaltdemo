function adminSignin(event)
{
      event.preventDefault();
      let form = document.getElementById('signin_form');
      let data = new FormData(form)
      body ={}
      data.forEach((value,key) => body[key]=value)
      fetch('/admin/signin', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body:JSON.stringify(body),
      }).then(response=>response.json()).then(data=>{
        if(data.message === "Success")
        {
          location.href='/admin/add_company.html';
        }
        else if(data.message == "Error")
        {
          alert('There is some error server side,Try again !!');
          form.reset();
        }
        else if(data.message == "Wrong"){
          alert("Email or Password Is Wrong");
          form.reset();
        }
      }) 
}