import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';



const app = new Clarifai.App({
  apiKey: 'd3c9315c8e5442e78e6c6b12c9def3a2'
});

const particlesOptions = {
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

class App extends Component {

  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

  calculateFaceLocation = (data) => {
    const claraiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol : claraiFace.left_col * width,
      topRow : claraiFace.top_row * height,
      rightCol : width - (claraiFace.right_col * width),
      bottomRow: height - (claraiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box})
  }

  onInputChange = (event) => {
    // console.log(event.target.value);
    this.setState({input: event.target.value});
    console.log(this.state.input);
  }

  onBtnSubmit = () => {
    console.log('clicked');
    this.setState({imageUrl : this.state.input});

    app.models.predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input)
      .then( response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err)) 
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if(route==='home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route : route});
  }

  render() {

    const {isSignedIn, imageUrl, route, box} = this.state;

    return (
      <div className="App">

        <Particles className='particles'
          params={particlesOptions}
        />

        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home' ? 
          <div>
            <Logo />
            <Rank />
            <ImageLinkForm 
            onInputChange={this.onInputChange} 
            onBtnSubmit={this.onBtnSubmit}/>
            <FaceRecognition box={box} imageUrl = {imageUrl}/>
          </div> :
          (
            route === 'signin' ? 
              <Signin onRouteChange={this.onRouteChange}/> :
              <Register onRouteChange={this.onRouteChange}/> 
          )
      
        }
        
      </div>
    );
  }
}

export default App;
