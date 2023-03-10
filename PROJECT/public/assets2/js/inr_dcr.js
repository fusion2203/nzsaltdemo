var stock = 0;
function typeChanged(event, str, d) {
  var type = event.target.value;
  console.log(type, str);
  var t = d["type"].split(",");
  var q = d["qty"].split(",");
  var index = t.indexOf(type);
  var cur_qty = q[index];
  stock = cur_qty;
  console.log(cur_qty);
  if (cur_qty == 0) {
    document.getElementById("add").style.visibility = "hidden";
  } else {
    document.getElementById("add").style.visibility = "visible";
  }
}
function deccrease() {
  const qty = document.getElementById("pro-qunt").value;
  if (qty > 1) {
    document.getElementById("pro-qunt").defaultValue = (qty - 1).toString();
  }
}
function increase(total) {
  const qty = document.getElementById("pro-qunt").value;
  console.log(stock);
  var q = parseInt(qty);
  var t = parseInt(total);
  if (stock == 0 && q < t) {
    document.getElementById("pro-qunt").defaultValue = (q + 1).toString();
  } else if (q < stock) {
    document.getElementById("pro-qunt").defaultValue = (q + 1).toString();
  }
}
