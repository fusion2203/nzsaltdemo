function addCompany(event)
{
  event.preventDefault();
  let form = document.getElementById('company_form')
  let data = new FormData(form);
  fetch('/admin/add_company', {
    method: 'POST',
    body:data
  })
  .then(response=>response.json())
  .then(data=>{
    if(data.message === "Success")
    {
      alert("Company Added Successfully");
    }
    else if(data.message == "Duplicate"){
      alert("Company with this name already present")
    }
    form.reset();
    document.getElementById("file_name").innerHTML=""
  })
}