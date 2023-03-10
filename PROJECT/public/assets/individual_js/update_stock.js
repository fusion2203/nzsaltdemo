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
let finalImages = [];
var products = [];
var oldTypesQty=[]

async function getProducts(event) {
  if (event) event.preventDefault();
  let main_cat = document.getElementById('main_category').value;
  let sub_cat = document.getElementById('sub_category').value;
  if (main_cat === 'Disposables') sub_cat = 'None';
  let data = await fetch(`/get_products/${main_cat}/${sub_cat}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  data = await data.json();
  if (data.message === 'Error') {
    alert("There is some error server side, Try Again !!");
    return;
  }
  else {
    products = data;
  }

  let product_images = groupBy(products['images'], 'product_id')
  let product_types = groupBy(products['types'], 'product_id')

  let updatedProducts = {}
  for (i in product_types) {
    updatedProducts[i] = { 'type': product_types[i], 'images': product_images[i] }
  }
  products = updatedProducts;
  renderProducts(products)
}


function renderProducts(products) {

  let container_fluid = document.getElementById('parent');
  let products_container = document.getElementById('products_container');
  if (products_container) products_container.remove();

  let row = document.createElement('div');
  row.classList.add('row')
  row.setAttribute('id', 'products_container')
  for (let i in products) {
    console.log(products[i])
    let product = products[i];
    let product_qty_value = 0;
    product['type'].forEach(element => {
      product_qty_value += element['product_qty']
    });
    let images = product['images']
    let col = document.createElement('div')
    col.classList.add('product');

    let product_grid = document.createElement('div');
    product_grid.classList.add('prduct-grid-item', 'mb-30')

    let prodcut_img = document.createElement('div')
    prodcut_img.classList.add('product-img', 'mb-3');

    let overlay = document.createElement('div')
    overlay.classList.add('overlay')

    let button = document.createElement('button')
    button.onclick = function (event) { editProductForm(event) }
    button.classList.add(i);
    button.innerHTML = "Update Stock";
    overlay.appendChild(button);



    let image = document.createElement('img')
    image.src = `${images[0]['img']}`

    prodcut_img.appendChild(image);
    prodcut_img.appendChild(overlay);

    let product_content = document.createElement('div')
    product_content.classList.add('product-content');

    let product_name = document.createElement('h4')
    product_name.classList.add('mb-10')
    product_name.innerHTML = product['type'][0]['product_name'];

    let product_qty = document.createElement('h4')
    product_qty.classList.add('mb-10')
    product_qty.innerHTML = "Qauntity : " + product_qty_value;

    product_content.appendChild(product_name);
    product_content.appendChild(product_qty);

    product_grid.appendChild(prodcut_img);
    product_grid.appendChild(product_content);
    col.appendChild(product_grid);
    row.appendChild(col);
  }
  container_fluid.appendChild(row)
}

function editProductForm(event) {
  let id = event.target.classList[0]
  localStorage.setItem('product_id',id);
  let product = products[id];
  let product_types = product['type']

  let oldDetails = {
    'product_name': product_types[0]['product_name'],
    'company_name': product_types[0]['company_name'],
    'product_total_type': product_types.length,
    'product_type': product_types[0]['product_type']
  }


  for (i in product_types) {
    if ('product_types' in oldDetails) {
      oldDetails['product_types'].push(product_types[i]['product_type_des'])
      oldDetails['product_types_qty'].push(product_types[i]['product_qty'])

    }
    else {
      oldDetails['product_types'] = [product_types[i]['product_type_des']]
      oldDetails['product_types_qty'] = [product_types[i]['product_qty']]
    }
  }
  let parent = document.getElementById('parent');
  for (child of parent.children) {
    child.classList.add('hide');
  }
  let edit_form_container = document.getElementById('edit-form_container');
  edit_form_container.classList.remove('hide');
  edit_form_container.classList.add('show');

  // SET FORM ELEMENTS
  console.log(oldDetails)
  let editForm = document.getElementById('edit_product_form');

  console.log(editForm.elements)

  editForm.elements['edit_product_name'].value = oldDetails['product_name'];
  editForm.elements['edit_company_name'].value = oldDetails['company_name'];
  editForm.elements['edit_product_type'].value = oldDetails['product_type'];
  if (oldDetails['product_type'] === 'None') {
    editForm.elements['edit_stock'].value = oldDetails['product_types_qty'][0];
  }
  else {
    editForm.elements['edit_stock'].disabled = true;
    editForm.elements['edit_product-total-type-value'].disabled = false;

    editForm.elements['edit_product-total-type-value'].value = oldDetails['product_total_type'];
    addTotalTypes([oldDetails['product_types'], oldDetails['product_types_qty']])
  }

}


function updateStock(event){
  event.preventDefault();

  let form = document.getElementById('edit_product_form')
  let data = new FormData(form);
  data.append('product_id',localStorage.getItem('product_id'))
  let need = ['product_id','product_type','product_types','product_types_qty'];
  body={}
  data.forEach((value,key)=>{
      if(need.includes(key))
      {
        if(key in body)
        {
          body[key].push(value);
        }
        else{
          body[key] = [value];
        }
      }
  })
  console.log(body)
  fetch('/admin/update_product_stock', {
    method: 'POST',headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body:JSON.stringify(body)
  })
  .then(response=>response.json())
  .then(data=>{
    if(data.message === "Success")
    {
      alert("Product Stock Updated Successfully");
      resetForm(form);
    }
    else if(data.message == "Error"){
     alert("There is some error server side, Try again letter !!")
   }
  })

}
function cancleChanges()
{
   if(confirm('Do you want close this')){
    resetForm(document.getElementById('edit_product_form'))
   }
   else{
   }
}

function  resetForm(form)
{

  form.reset();
  document.getElementById('edit_stock').disabled = false;
  document.getElementById("edit_product-total-type-value").disabled = true;    
  //CLEAR ALL TYPES BOXES 
  let previous = document.getElementsByClassName('edit_product-type-added');
  while(previous.length > 0)
  {
   previous[0].parentNode.removeChild(previous[0]);
  }

  let parent = document.getElementById('parent');
  for (child of parent.children) {
    child.classList.remove('hide');
  }
  let edit_form_container = document.getElementById('edit-form_container');
  edit_form_container.classList.remove('show');
  edit_form_container.classList.add('hide');

  document.getElementById('products_container').remove();
}




const groupBy = (array, key) => {
  return array.reduce((result, currentValue) => {
    (result[currentValue[key]] = result[currentValue[key]] || []).push(
      currentValue
    );
    return result;
  }, {});
};



function addTotalTypes(typesDetails) {
  let product_type_value = document.getElementById('edit_product_type').value;
  let add_product_form = document.getElementById('edit_product_form');
  let previous = document.getElementsByClassName('edit_product-type-added');
  //Clear ALl previous 
  while (previous.length > 0) {
    previous[0].parentNode.removeChild(previous[0]);
  }
  //End

  let product_total_type = document.getElementById('edit_product-total-type-value')
  let type_value = product_total_type.value;
  let ref_div = product_total_type.parentElement;

  if (type_value === "") return
  for (let i = 0; i < type_value; i++) {
    let form_grp = document.createElement('div');
    form_grp.classList.add('form-group')
    form_grp.classList.add('edit_product-type-added')

    let input_type = document.createElement('input')
    input_type.setAttribute('type', 'text');
    input_type.setAttribute("value", typesDetails[0][i]);
    input_type.classList.add('theme-input-style')
    input_type.style.width = "90px";
    input_type.setAttribute("name", "product_types")
    input_type.setAttribute("required", true)
    input_type.setAttribute('readonly',true);

    let input_counter = document.createElement('input');
    input_counter.setAttribute('type', 'number');
    input_counter.classList.add("Type_Counter")
    input_counter.setAttribute('placeholder', '0');
    input_counter.style.width = "70px";
    input_counter.setAttribute("name", "product_types_qty")
    input_counter.setAttribute("required", true)
    input_counter.setAttribute("value", typesDetails[1][i]);

    form_grp.appendChild(input_type);
    form_grp.innerHTML += "&nbsp&nbsp&nbsp";
    form_grp.appendChild(input_counter);
    add_product_form.insertBefore(form_grp, ref_div.nextSibling);
    ref_div = form_grp;
  }
}


function onCategoryChange() {

  let select_category = document.getElementById('main_category');
  let select_sub_category = document.getElementById('sub_category');
  let category_value = select_category.value;
  if (category_value === 'Disposables') select_sub_category.disabled = true;
  else {
    select_sub_category.disabled = false;
    let obj = ProductType.find(o => o.category === category_value)
    select_sub_category.innerHTML = "";
    for (const i of obj.sub_category) {
      let option = document.createElement('option');
      option.setAttribute('value', i)
      option.text = i;
      select_sub_category.appendChild(option);
    }
  }
}

