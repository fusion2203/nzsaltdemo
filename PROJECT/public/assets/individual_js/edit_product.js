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
    button.innerHTML = "Edit Details";
    overlay.appendChild(button);

    button = document.createElement('button');
    button.classList.add(i);
    button.onclick = function (event) { removeProduct(event) }
    button.innerHTML = "Remove Product";
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


async function removeProduct(event) {
  let id = event.target.classList[0];
  console.log(id, products)
  let product_name = encodeURIComponent(products[id]['type'][0]['product_name']);
  let company_name = products[id]['type'][0]['company_name'];
  console.log(product_name, company_name);
  if (confirm('Do You Want To Delete This Product !!')) {
    console.log("JNRGJJGR")
    await fetch(`/admin/remove_product/${id}/${product_name}/${company_name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Error') {
          alert('There is some error server side , Try again!!')
        }
        else if (data.message === 'Success') {
          alert('Product removed ');
          getProducts()
        }
      })
  }
}


async function getCompanies() {
  let select = document.getElementById("edit_select_company");
  let data = await fetch('/company');
  let companies = await data.json();
  for (let i = 0; i < companies.length; i++) {
    let option = document.createElement('option');
    option.setAttribute('value', companies[i].company_name)
    option.text = companies[i].company_name;
    select.appendChild(option);
  }
}


async function editProductForm(event) {
  await getCompanies();
  let id = event.target.classList[0]
  localStorage.setItem('product_id',id);
  let product = products[id];
  let product_img = product['images']
  let product_types = product['type']

  let oldDetails = {
    'product_name': product_types[0]['product_name'],
    'company_name': product_types[0]['company_name'],
    'product_description': product_types[0]['product_description'],
    'product_main_cat': product_types[0]['product_main_cat'],
    'product_price': product_types[0]['product_price'],
    'product_sub_cat': product_types[0]['product_sub_cat'],
    'product_total_type': product_types.length,
    'product_type': product_types[0]['product_type']
  }

  for (i in product_img) {
    if ('product_images' in oldDetails) {
      oldDetails['product_images'].push({ 'name': product_img[i]['img'] })
    }
    else {
      oldDetails['product_images'] = [{ 'name': product_img[i]['img'] }];
    }
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
  editForm.elements['edit_product_price'].value = oldDetails['product_price'];
  editForm.elements['edit_Product_Category'].value = oldDetails['product_main_cat'];
  onEditCategoryChange();
  editForm.elements['edit_Product_SubCategory'].value = oldDetails['product_sub_cat'];
  editForm.elements['edit_select_company'].value = oldDetails['company_name'];
  editForm.elements['edit_product-type'].value = oldDetails['product_type'];
  onTypeChange();
  if (oldDetails['product_type'] === 'None') {
    console.log(oldDetails['product_types_qty'])
    editForm.elements['edit_stock'].value = oldDetails['product_types_qty'][0];
  }
  else {
    editForm.elements['edit_product-total-type-value'].value = oldDetails['product_total_type'];
    addTotalTypes([oldDetails['product_types'], oldDetails['product_types_qty']])
  }
  editForm.elements['edit_des'].value = oldDetails['product_description'];

  for (let i = 0; i < oldDetails['product_images'].length; i++) {
    finalImages.push(['old',oldDetails['product_images'][i]['name']]);
  }
  displayImages();
}



function displayImages() {

  let imgsContainer = document.getElementById('file_container');
  let previous = document.getElementsByClassName('uploaded_product_img');
  //Clear ALl previous 
  while (previous.length > 0) {
    previous[0].parentNode.removeChild(previous[0]);
  }
  for (let i = 0; i < finalImages.length; i++) {
    let product_img = document.createElement('div')
    product_img.classList.add('uploaded_product_img');

    let overlay = document.createElement('div');
    overlay.classList.add('overlay');


    let remove = document.createElement('button');
    remove.innerHTML = "X"
    remove.onclick = function (event) { removeImage(event) }
    overlay.appendChild(remove);


    let img = document.createElement('img');
    img.src = finalImages[i][1];
    img.alt = finalImages[i][1]
    product_img.appendChild(img);
    product_img.appendChild(overlay);
    imgsContainer.appendChild(product_img);
  }
}



function removeImage(event) {
  let name = event.target.parentElement.previousSibling.alt;
  let remove =null;
  console.log(name);
  for(file of finalImages)
  {
    if( (file[0] === 'new' && file[1] === name))
    {
        remove = file;
        break;
    }
    else if(file[0] ==='old')
    {
      let splits = name.split('/');
      let last = splits[splits.length-1];
      if(file[1] === last){
        remove = file ;
        break;
      }
    }
  } 
  finalImages.splice(finalImages.indexOf(remove),1);
  displayImages()
}



function onImageUpload(event) {
  var files = event.target.files;
  for (let i = 0; i < files.length; i++) {
    if(files[i] in finalImages === false)
    {
      finalImages.push(['new',URL.createObjectURL(files[i])]);
    }
  }
  displayImages();
}




function updateProduct(event){

  event.preventDefault();
  let form = document.getElementById('edit_product_form')
  let data = new FormData(form);
  for(file of finalImages)
  {
    if(file[0] === 'old'){
      data.append('old_images',file[1])
    }
  }
  data.append('product_id',localStorage.getItem('product_id'))
  console.log([...data])
  fetch('/admin/update_product', {
    method: 'POST',
    body:data
  })
  .then(response=>response.json())
  .then(data=>{
    if(data.message === "Success")
    {
      alert("Product Updated Successfully");
      resetForm(form);
    }
    else if(data.message == "Duplicate"){
      alert("Product with this name from this company already exist")
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
  finalImages = [];

  form.reset();
  document.getElementById('edit_stock').disabled = false;
  document.getElementById("edit_product-total-type-value").disabled = true;    
  document.getElementById("file_container").innerHTML="" ; 
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





function onEditCategoryChange() {
  let select_category = document.getElementById('edit_Product_Category');
  let select_sub_category = document.getElementById('edit_Product_SubCategory');
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

function onTypeChange() {
  let product_type = document.getElementById('edit_product-type')
  let product_type_value = product_type.value;
  if (product_type_value === "None") {
    document.getElementById("edit_product-total-type-value").disabled = true;
    document.getElementById("edit_stock").disabled = false;
    //CLEAR ALL TYPES BOXES 
    let previous = document.getElementsByClassName('product-type-added');
    while (previous.length > 0) {
      previous[0].parentNode.removeChild(previous[0]);
    }
  }
  else {
    document.getElementById("edit_stock").disabled = true;
    document.getElementById("edit_product-total-type-value").disabled = false;
  }
}

function addTotalTypes(typesDetails) {
  let product_type_value = document.getElementById('edit_product-type').value;
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
    input_type.setAttribute('placeholder', product_type_value);
    input_type.classList.add('theme-input-style')
    input_type.style.width = "90px";
    input_type.setAttribute("name", "product_types")
    input_type.setAttribute("required", true)

    let input_counter = document.createElement('input');
    input_counter.setAttribute('type', 'number');
    input_counter.classList.add("Type_Counter")
    input_counter.setAttribute('placeholder', '0');
    input_counter.style.width = "70px";
    input_counter.setAttribute("name", "product_types_qty")
    input_counter.setAttribute("required", true)

    if (typesDetails) {
      console.log(typesDetails[0][i])
      input_type.setAttribute("value", typesDetails[0][i]);
      input_counter.value = typesDetails[1][i];
    }
    form_grp.appendChild(input_type);
    form_grp.innerHTML += "&nbsp&nbsp&nbsp";
    form_grp.appendChild(input_counter);
    add_product_form.insertBefore(form_grp, ref_div.nextSibling);
    ref_div = form_grp;
  }
}


