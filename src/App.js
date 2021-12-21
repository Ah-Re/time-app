import { useState, useEffect } from 'react';
import NightMobile from "./assets/mobile/bg-image-nighttime.jpg";
import NightTablet from "./assets/tablet/bg-image-nighttime.jpg";
import NightDesktop from "./assets/desktop/bg-image-nighttime.jpg";
import DayMobile from "./assets/mobile/bg-image-daytime.jpg";
import DayTablet from "./assets/tablet/bg-image-daytime.jpg";
import DayDesktop from "./assets/desktop/bg-image-daytime.jpg";
import MoonIcon from "./assets/desktop/icon-moon.svg";
import SunIcon from "./assets/desktop/icon-sun.svg";
import RefreshIcon from "./assets/desktop/icon-refresh.svg";
import ArrowUp from "./assets/desktop/icon-arrow-up.svg";
import ArrowDown from "./assets/desktop/icon-arrow-down.svg";

import './App.css';
import axios from 'axios';

function App() {

  
  const useWindowWidth = () => {
    const [windowWidth, setWindowWidth ] = useState(window.innerWidth);

    useEffect(() => {
        const handleWindowResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleWindowResize);
        return () => window.removeEventListener('resize', handleWindowResize);
    },[]);

    return windowWidth;
};


let imageUrl;
let windowSize = useWindowWidth();


  const [more, setMore] = useState(false);

  const [locationData, setLocationData] = useState({
    ip: '',
    city: '',
    country_code: ''
  });
  


  const [timeData, setTimeData] = useState({
    abbreviation: '',
    timezone: '',
    time: '',
    dayOfYear: '',
    dayOfWeek: '',
    week: ''
  })

  const [quoteData, setQuoteData] = useState({
    author: '',
    quote: ''
  })

  const apiKey = process.env.REACT_APP_IP_API_KEY;

  const getQuoteData = async () => {
    const res3 = await axios.get('https://programming-quotes-api.herokuapp.com/Quotes/random');
  
      setQuoteData({
        author: res3.data.author,
        quote: res3.data.en
      })
  }
    
  

  useEffect(() => {
    const getData = async () => {
      const res = await axios.get('https://geolocation-db.com/json/' + apiKey);
      
      
      setLocationData({
        ip: res.data.IPv4,
        city: res.data.city,
        country_code: res.data.country_code
      })
  
      const res2 = await axios.get('http://worldtimeapi.org/api/ip/' + locationData.ip);
      console.log(res2.data);
      let dateTime = res2.data.datetime;
      let part = dateTime.substring(dateTime.indexOf('T') + 1, dateTime.indexOf('T') + 6);
      
      setTimeData({
        abbreviation: res2.data.abbreviation,
        timezone: res2.data.timezone,
        time: part,
        dayOfYear: res2.data.day_of_year,
        dayOfWeek: res2.data.day_of_week,
        week: res2.data.week_number
      })
  
      
      getQuoteData();
  
    }
    getData();
  }, []);

  
  let greeting = '';
  let hour = parseInt(timeData.time.substring(0,2));
  let icon;

  if (windowSize > 1000) {
    if (hour > 5 && hour <= 18) {
      imageUrl = DayDesktop
      icon = SunIcon;
    } else {
      imageUrl = NightDesktop;
      icon = MoonIcon;
    }
    
  }
  else if (windowSize > 750 && windowSize < 1000) {
    if (hour > 5 && hour <= 18) {
      imageUrl = DayTablet;
      icon = SunIcon;
    } else {
      imageUrl = NightTablet;
      icon = MoonIcon;
    }
    
    
  } else {
    if (hour > 5 && hour <= 18) {
      imageUrl = DayDesktop;
      icon = SunIcon;
    } else {
      imageUrl = NightMobile;
      icon = MoonIcon;
    }
  }
  
  const backgroundStyle = {
    backgroundImage: ` linear-gradient(rgba(0, 0, 0, 0.6),
    rgba(0, 0, 0, 0.6)), url(${imageUrl})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      
  }


  

  if (hour >= 5 && hour < 12) {
    greeting = 'Good morning';
  } else if (hour >= 12 && hour < 18) {
    greeting = 'Good afternoon';
  } else {
    greeting = 'Good evening';
  }

  const middlePaddingWithMoreInfo = {
    paddingTop: "8rem",
    paddingBottom: windowSize > 750 ? "20rem" : "10rem"
  };

  const middlePaddingWithoutMoreInfo = {
    paddingTop: "3rem",
    paddingBottom: "10rem"
  };

  
  return (
    <div className="App" style={backgroundStyle}>
    
{ !more &&
    <div className="quote">
    <p className="quote-text">"{quoteData.quote}"</p>
    <p style={{fontWeight: 'bold'}}>{quoteData.author}</p>
    <img onClick={() => {
      getQuoteData();
    }} className="refresh-icon" src={RefreshIcon} alt="refresh" />
    </div>
}

<div className="middle" style={!more ? middlePaddingWithMoreInfo : middlePaddingWithoutMoreInfo}>
  <div>
    <img style={{marginRight: "1rem"}} src={icon} alt="icon"/> 
    <h4>{greeting}{windowSize > 750 ? ", it's currently" : null}</h4>
    </div>
      <h1>{timeData.time}</h1>
      <h4>{timeData.abbreviation}</h4>
      

  <h3>in {locationData.city}, {locationData.country_code}</h3>

<div style={{position: "relative"}}>
  <button style={{backgroundColor: "white", borderRadius: "24px", borderStyle: "none", position: "relative", padding: "16px 3rem 16px 1rem"}}onClick={() => {
    setMore(!more);
  }}>
  <span style={{color: "#303030", fontFamily: 'Inter, sans-serif', fontWeight: "700", textTransform: "uppercase", letterSpacing: "3px"}}>{more ? "Less" : "More"}</span>
    <span><img style={{position:"absolute", top: "5px", right: "5px", bottom: "0", transform: more ? "rotate(180deg)" : null}} src={ArrowUp} alt="arrow"/></span>


  </button>
  </div>

</div>
  

  




 {more && <div className="more-info">
    
  <div className="info-piece">
  <h6>Current timezone</h6>
  <h2>{timeData.timezone}</h2>
  </div>

<div className="info-piece">
  <h6>Day of the year</h6>
  <h2>{timeData.dayOfYear}</h2>
  </div>

<div className="info-piece">
  <h6>Day of the week</h6>
  <h2>{timeData.dayOfWeek}</h2>
  </div>

<div className="info-piece">
  <h6>Week number</h6>
  <h2>{timeData.week}</h2>
  </div>


  
    
  
  </div>
 }

 
    </div>
  );
}

export default App;
