import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
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

  render() {
    return (
      <div className="App">

        <Particles className='particles'
          params={particlesOptions}
        />

        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm 
        onInputChange={this.onInputChange} 
        onBtnSubmit={this.onBtnSubmit}/>
        <FaceRecognition box={this.state.box} imageUrl = {this.state.imageUrl}/>
      </div>
    );
  }
}

export default App;
