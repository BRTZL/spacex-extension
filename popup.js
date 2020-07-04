var state = 0;
var loading = true;

const getData = async () => {
  // making api request
  const data = await fetch("https://api.spacexdata.com/v4/launches/next", {
    headers: { Accept: "application/json" },
  })
    .then((response) => response.json())
    .catch(() => "No Internet Connection");

  // creating new data from string
  let date = new Date(data.date_utc);
  let dateString =
    ("00" + (date.getMonth() + 1)).slice(-2) +
    "/" +
    ("00" + date.getDate()).slice(-2) +
    "/" +
    date.getFullYear() +
    " " +
    ("00" + date.getHours()).slice(-2) +
    ":" +
    ("00" + date.getMinutes()).slice(-2) +
    ":" +
    ("00" + date.getSeconds()).slice(-2);
  // passing datas to divs
  document
    .getElementById("spacex-name")
    .appendChild(document.createTextNode(data.name));

  document
    .getElementById("spacex-date")
    .appendChild(document.createTextNode(dateString));

  document
    .getElementById("spacex-details")
    .appendChild(document.createTextNode(data.details));

  document.getElementById("spacex-patch").src = data.links.patch.small;

  // <img src="..." alt="..." class="img-thumbnail"></img>

  //rocket data
  // -------------------------------------------------------------------- //
  const rocketData = await fetch(
    "https://api.spacexdata.com/v4/rockets/" + data.rocket,
    {
      headers: { Accept: "application/json" },
    }
  )
    .then((response) => response.json())
    .catch(() => "No Internet Connection");

  var toAdd = document.createDocumentFragment();

  var newDiv = document.createElement("li");
  newDiv.id = "rocket";
  newDiv.className = "list-group-item";
  var node = document.createTextNode(rocketData.description);
  newDiv.appendChild(node);

  var a = document.createElement("a");
  var link = document.createTextNode(" Wikipedia Link");
  a.appendChild(link);
  a.title = "Wikipedia Link";
  a.href = rocketData.wikipedia;
  a.target = "_blank";
  // a.className = "badge badge-warning";
  newDiv.appendChild(a);

  var centeredDiv = document.createElement("div");
  centeredDiv.className = "text-center";
  rocketData.flickr_images.forEach((item, index) => {
    var node = document.createElement("li");
    var img = document.createElement("img");
    img.id = "rocket_image_" + index;
    img.src = item;
    img.width = "400";

    node.appendChild(img);
    centeredDiv.appendChild(node);
    centeredDiv.appendChild(document.createElement("br"));
  });

  newDiv.appendChild(centeredDiv);
  document.getElementById("rockets").appendChild(newDiv);

  // payload data
  // -------------------------------------------------------------------- //
  var toAdd = document.createDocumentFragment();

  data.payloads.forEach(async (item, index) => {
    const payloadData = await fetch(
      "https://api.spacexdata.com/v4/payloads/" + item,
      {
        headers: { Accept: "application/json" },
      }
    )
      .then((response) => response.json())
      .catch(() => "No Internet Connection");

    var newDiv = document.createElement("li");
    newDiv.id = "payload_" + index;
    newDiv.className = "list-group-item";

    var node = document.createTextNode(payloadData.name);
    newDiv.appendChild(node);
    newDiv.appendChild(document.createElement("br"));

    var node = document.createElement("span");
    node.className = "badge badge-info";
    node.textContent = payloadData.orbit;
    newDiv.appendChild(node);

    var node = document.createElement("span");
    node.className = "badge badge-success";
    node.textContent = payloadData.type;
    newDiv.appendChild(node);

    payloadData.customers.forEach((item) => {
      var node = document.createElement("span");
      node.className = "badge badge-dark";
      node.textContent = item;
      newDiv.appendChild(node);
    });

    payloadData.nationalities.forEach((item) => {
      var node = document.createElement("span");
      node.className = "badge badge-danger";
      node.textContent = item;
      newDiv.appendChild(node);
    });

    toAdd.appendChild(newDiv);
    document.getElementById("payloads").appendChild(toAdd);
  });
  loading = false;
  change_page();
};

function change_page() {
  if (loading) {
    document.getElementById("loading").style.display = "block";
    document.getElementById("page_1").style.display = "none";
    document.getElementById("page_2").style.display = "none";
    document.getElementById("page_3").style.display = "none";
    return;
  } else {
    document.getElementById("loading").style.display = "none";
  }

  switch (state) {
    case 0:
      document.getElementById("page_1").style.display = "block";
      document.getElementById("page_2").style.display = "none";
      document.getElementById("page_3").style.display = "none";
      break;
    case 1:
      document.getElementById("page_1").style.display = "none";
      document.getElementById("page_2").style.display = "block";
      document.getElementById("page_3").style.display = "none";
      break;
    case 2:
      document.getElementById("page_1").style.display = "none";
      document.getElementById("page_2").style.display = "none";
      document.getElementById("page_3").style.display = "block";
      break;
    default:
      document.getElementById("page_1").style.display = "block";
      document.getElementById("page_2").style.display = "none";
      document.getElementById("page_3").style.display = "none";
      break;
  }
}

function home_page() {
  state = 0;
  change_page();
}

function rocket_page() {
  state = 1;
  change_page();
}

function payload_pages() {
  state = 2;
  change_page();
}

document.addEventListener("DOMContentLoaded", () => {
  // initial data
  getData();
  // reset page router
  change_page();

  // page routes
  document.getElementById("back_button1").addEventListener("click", home_page);
  document.getElementById("back_button2").addEventListener("click", home_page);

  document
    .getElementById("rocket_button")
    .addEventListener("click", rocket_page);

  document
    .getElementById("payload_button")
    .addEventListener("click", payload_pages);
});
