ProductType = [
   {
     category : 'Device',
     sub_category:['Tool Kits','Pod Kits']
   },
   {
      category : 'Liquides',
      sub_category:['Free Base','Salt Base']
   },
   {
      category : 'Accessories',
      sub_category:['Coils','Pods','Batteries','Tanks | Mods']
   },
   {
      category : 'Disposables',
      sub_category:[]
   },
]

console.log()
document.addEventListener("DOMContentLoaded",async function(){
   document.getElementById("product_form").reset();
   let select = document.getElementById("select_company");
    console.log("vnjnvjnvrk v");

    data = await fetch('/company');
    companies = await data.json();
    console.log(companies);
    for(let i=0;i<companies.length;i++)
    {
      let option = document.createElement('option');
      option.setAttribute('value',companies[i].company_name)
      option.text = companies[i].company_name;
      select.appendChild(option);
    }  

})

function onCategoryChange()
{
   
   let select_category = document.getElementById('Product_Category');
   let select_sub_category = document.getElementById('Product_SubCategory');
   let category_value = select_category.value;
   if(category_value === 'Disposables')  select_sub_category.disabled = true;
   else{
     select_sub_category.disabled = false;
     let obj = ProductType.find(o => o.category === category_value)
     select_sub_category.innerHTML="";
     for (const i of obj.sub_category){
         let option = document.createElement('option');
         option.setAttribute('value',i)
         option.text = i;
         select_sub_category.appendChild(option);
     } 
   }
}
 
function onTypeChange()
{
   let product_type = document.getElementById('product-type')
   let product_type_value = product_type.value;
   if(product_type_value === "None")
   {
      document.getElementById("product-total-type-value").disabled = true;    
      document.getElementById("stock").disabled = false;    
      //CLEAR ALL TYPES BOXES 
      let previous = document.getElementsByClassName('product-type-added');
      while(previous.length > 0)
      {
         previous[0].parentNode.removeChild(previous[0]);
      }
   }
   else
   {
      document.getElementById("stock").disabled = true;
      document.getElementById("product-total-type-value").disabled = false;    
   }
}

/*TO ADD PRODUCT TYPES ON CHANGE OF NUMBER OF TYPES NUMBER*/

function addTotalTypes()
{
   let product_type_value = document.getElementById('product-type').value;
   let add_product_form =document.getElementById('product_form');
   let previous = document.getElementsByClassName('product-type-added');

   //Clear ALl previous 
   while(previous.length > 0)
   {
    previous[0].parentNode.removeChild(previous[0]);
   }
   //End
  
   let product_total_type = document.getElementById('product-total-type-value')
   let type_value = product_total_type.value;
   let ref_div = product_total_type.parentElement;

   if(type_value ==="")return 
   for(let i=0;i<type_value;i++)
   {
      let form_grp = document.createElement('div');
      form_grp.classList.add('form-group')
      form_grp.classList.add('product-type-added')

      let input_type = document.createElement('input')
      input_type.setAttribute('type','text');
      input_type.setAttribute('placeholder',product_type_value);
      input_type.classList.add('theme-input-style')
      input_type.style.width="90px";
      input_type.setAttribute("name","product_types")
      input_type.setAttribute("required",true)



      let input_counter = document.createElement('input');
      input_counter.setAttribute('type','number');
      input_counter.classList.add("Type_Counter")
      input_counter.setAttribute('placeholder','0');
      input_counter.style.width="70px";
      input_counter.setAttribute("name","product_types_qty")
      input_type.setAttribute("required",true)
      input_counter.setAttribute('required',true);

      form_grp.appendChild(input_type);
      form_grp.innerHTML+="&nbsp&nbsp&nbsp";
      form_grp.appendChild(input_counter);
      add_product_form.insertBefore(form_grp, ref_div.nextSibling);
      ref_div = form_grp;
   }
}


function addProduct(event){
   event.preventDefault();
   let form = document.getElementById('product_form')
   let data = new FormData(form);
   body={}
   data.forEach((value,key)=>{
      if(key in body)
      {
         if(Array.isArray(body[key]))body[key].push(value)
         else body[key] = [body[key],value];
      }
      else{
         body[key] = value
      }
   })
   fetch('/admin/add_product', {
     method: 'POST',
     body:data
   })
   .then(response=>response.json())
   .then(data=>{
     if(data.message === "Success")
     {
       alert("Product Added Successfully");
     }
     else if(data.message == "Duplicate"){
       alert("Product with this name from this company already exist")
     }
     else if(data.message == "Error"){
      alert("There is some error server side, Try again letter !!")
    }
    resetForm(form)
   })

}

function  resetForm(form)
{
     form.reset();
     document.getElementById('stock').disabled = false;
     document.getElementById("product-total-type-value").disabled = true;    
     document.getElementById("file_name").innerHTML="" ; 
     //CLEAR ALL TYPES BOXES 
     let previous = document.getElementsByClassName('product-type-added');
     while(previous.length > 0)
     {
      previous[0].parentNode.removeChild(previous[0]);
     }
     onCategoryChange();

}