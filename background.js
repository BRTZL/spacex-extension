chrome.runtime.onInstalled.addListener(async () => {
  await getTime();
  setInterval(async () => {
    await getTime();
  }, 18000);
});

async function getTime() {
  clearInterval(timer);

  const data = await fetch("https://api.spacexdata.com/v4/launches/next", {
    headers: { Accept: "application/json" },
  })
    .then((response) => response.json())
    .catch(() => "No Internet Connection");

  // var d = new Date();
  // d.setSeconds(d.getSeconds() + 5);
  // let next_launch = Math.abs(d - new Date());

  var date = new Date(data.date_utc);
  date.setMinutes(date.getMinutes() - 5);

  let next_launch = Math.abs(date - new Date());

  var timer = setTimeout(async () => {
    alert(alert("SpaceX Launch Time " + data.name));
  }, next_launch);
}
