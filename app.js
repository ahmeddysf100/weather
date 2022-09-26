const express = require('express')
const https = require('https');
// const { pathToFileURL } = require('url');
const bodyparser = require('body-parser');
const app = express()
app.set('view engine', 'ejs')
app.use(bodyparser.urlencoded({
    extended: true
})) //
app.use("/public", express.static(__dirname + "/public"));
app.use('/images', express.static('images')) // سويناه حتى نكدر نستخدم الصور بالموقع مالنه مثل الخلفيه
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html")
});

app.post("/", function (req, res) {


    const lat = 33.34;
    const lon = 44.39;
    const city = req.body.cityName
    const units = "metric";
    const apiKay = "eeb5daf662a829d72bfaa493a3612af4";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=" + units + "&appid=" + apiKay;
    https.get(url, function (response) {
        console.log(response.statusCode);

        let stockData = ''; // Initialize an empty variable for the data

        response.on("data", function (data) {
            stockData += data; // this function gets called about 4 times.
        });

        response.on("end", function () {
            const weatherData = JSON.parse(stockData);
            if (response.statusCode == 200) {
                const tempp = weatherData.main.temp+" °c";
                const condion = weatherData.weather[0].description;
                const icon = weatherData.weather[0].icon;
                const imageUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
                const location = weatherData.name +" ,";
                const country = weatherData.sys.country;
                const now = new Date();
                const date = dateBuilder(now); //هذي فاكشن جاهزه للوقت

                function dateBuilder(d) {
                    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

                    let day = days[d.getDay()];
                    let date = d.getDate();
                    let month = months[d.getMonth()];
                    let year = d.getFullYear();

                    return `${day} ${date} ${month} ${year}`;
                }
                const temp_max = weatherData.main.temp_max+" °c / ";
                const temp_min = weatherData.main.temp_min+" °c";
                const state1 = "The Weather Is !";
                // res.write("<h1>the tempreture in "+location+" is " + tempp + "c</h1>");
                // res.write("<h2>weather condion is " + condion + "</h2>")
                // res.write("<img src=" + imageUrl + ">");
                // res.write();

                if (response.statusCode === 200) {
                    res.render("information", {
                        "state": state1,
                        "i": imageUrl,
                        "l": location,
                        "qr": country,
                        "d": date,
                        "t": tempp,
                        "c": condion,
                        "max": temp_max,
                        "min": temp_min,
                    });

                }
            } else if (response.statusCode === 404) {
                const state2 = "Please Try To Enter a Valid City Name ";
                const empty= "";
                res.render("information", {
                    "state": state2,
                    "i": empty,
                    "l": empty,
                    "qr": empty,
                    "d": empty,
                    "t": empty,
                    "c": empty,
                    "max": empty,
                    "min": empty,
                });
            }


        });
    });
})




app.listen(process.env.PORT || 4000, (err) => {
    if (err) {
        console.log("there is a eror", err);
        return;
    }
    console.log(` app listening on port 4000`)
});