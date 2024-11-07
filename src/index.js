import ReactDOM from "react-dom";
import React from 'react';
import "./styles.css";
import "./button.css";
import SideNav from "./SideNav";
import './sidenav.css';
import InstallPrompt from './InstallPrompt'

import kum from "./kum.png";
import ja from "./ja.png";
import coa from "./coa.png";
import darko from "./darko.png";
import jazic from "./jazic.png";
import sone from "./sone.png";
import dusan from "./dusan.png";
import doca from "./doca.jpg";
import mldj from './jovmldj.jpg';
import vinjak from "./vinjak.png";
import gajba from './gajba.png';

class App extends React.Component {
  state = {
    allImages: [
      { src: kum, label: "Vlast" },
      { src: ja, label: "Tica" },
      { src: doca, label: "Doca" },
      { src: dusan, label: "Borocki" },
      { src: coa, label: "Coa" },
      { src: jazic, label: "Jazic" },
      { src: sone, label: "Sone" },
      { src: darko, label: "Slovak" },
      { src: mldj, label: "Mladji Doca" },
    ],
    list: [kum, ja, doca, dusan, coa, jazic, sone, darko, mldj],
    radius: 75,
    rotate: 0,
    easeOut: 0,
    angle: 0,
    top: null,
    offset: null,
    net: null,
    result: null,
    spinning: false,
    images: [],
  };

  componentDidMount() {
    this.preloadImages();
  }
  
  preloadImages = () => {
    const imagePromises = this.state.allImages.map(({ src }) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
      });
    });
  
    Promise.all(imagePromises).then((images) => {
      this.setState({ images }, () => {
        this.renderWheel();
      });
    });
  };

  handleCheckboxChange = (image, checked) => {
    this.setState(
      (prevState) => ({
        list: checked
          ? [...prevState.list, image]
          : prevState.list.filter((img) => img !== image),
      }),
      () => this.renderWheel()
    );
  };

  renderWheel() {
    const { list, images } = this.state;
    if (list.length === 0 || images.length === 0) return;

    const numOptions = list.length;
    const arcSize = (2 * Math.PI) / numOptions;
    this.setState({ angle: arcSize });
    this.calculateTopPosition(numOptions, arcSize);

    const canvas = document.getElementById("wheel");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let angle = 0;
    for (let i = 0; i < numOptions; i++) {
      const imageIndex = this.state.allImages.findIndex(img => img.src === list[i]);
      const image = images[imageIndex];
      this.renderSector(i + 1, image, angle, arcSize, this.getColor());
      angle += arcSize;
    }
    this.drawCenterImage();
  }

  calculateTopPosition(num, angle) {
    let topSpot = null;
    let degreesOff = null;

    if (num === 9) {
      topSpot = 7;
      degreesOff = Math.PI / 2 - angle * 2;
    } else if (num === 8) {
      topSpot = 6;
      degreesOff = 0;
    } else if (num <= 7 && num > 4) {
      topSpot = num - 1;
      degreesOff = Math.PI / 2 - angle;
    } else if (num === 4) {
      topSpot = num - 1;
      degreesOff = 0;
    } else if (num <= 3) {
      topSpot = num;
      degreesOff = Math.PI / 2;
    }

    this.setState({
      top: topSpot - 1,
      offset: degreesOff,
    });
  }

  drawCenterImage() {
    const canvas = document.getElementById("wheel");
    const ctx = canvas.getContext("2d");
    const centerImageSize = 150;
    const x = canvas.width / 2 - centerImageSize / 2;
    const y = canvas.height / 2 - centerImageSize / 2;

    const img = new Image();
    img.src = gajba;
    img.onload = () => {
      ctx.drawImage(img, x, y, centerImageSize, centerImageSize);
    };
  }

  renderSector(index, image, start, arc, color) {
    const canvas = document.getElementById("wheel");
    const ctx = canvas.getContext("2d");
    const x = canvas.width / 2;
    const y = canvas.height / 2;
    const radius = this.state.radius;
    const startAngle = start;
    const endAngle = start + arc;
    const angle = index * arc;
    const baseSize = radius * 3.33;
    const imageRadius = baseSize - 150;
  
    // Draw sector with color
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle, false);
    ctx.lineWidth = radius * 2;
    ctx.strokeStyle = color;
    ctx.stroke();
  
    // Draw the image within the sector
    ctx.save();
    ctx.translate(
      baseSize + Math.cos(angle - arc / 2) * imageRadius,
      baseSize + Math.sin(angle - arc / 2) * imageRadius
    );
    ctx.rotate(angle - arc / 2 + Math.PI / 2);
  
    // Adjusted image dimensions for fitting
    const imageWidth = 45;  // Set to a smaller size
    const imageHeight = 60; // Set to a smaller size
    const imageOffsetX = -imageWidth / 2;
    const imageOffsetY = -imageHeight / 2;
  
    if (image instanceof HTMLImageElement) {
      ctx.drawImage(image, imageOffsetX, imageOffsetY, imageWidth, imageHeight);
    }
    ctx.restore();
  }
  

  getColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r},${g},${b},1)`;
  }

  spin = () => {
    if (this.state.spinning) return;

    const randomSpin = Math.floor(Math.random() * 900) + 3000;
    this.setState((prevState) => ({
      rotate: prevState.rotate + randomSpin,
      easeOut: 3,
      spinning: true,
    }));

    setTimeout(() => {
      this.getResult(randomSpin);
    }, 3000);
  };

  getResult(spin) {
    const { angle, top, offset, list } = this.state;
    const netRotation = ((spin % 360) * Math.PI) / 180;
    let travel = netRotation + offset;
    let count = top + 1;

    while (travel > 0) {
      travel -= angle;
      count--;
    }
    const result = count >= 0 ? count : list.length + count;

    this.setState({
      net: netRotation,
      result: result,
      spinning: false,
    });
  }

  reset = () => {
    this.setState({
      rotate: 0,
      easeOut: 0,
      spinning: false,
    });
  };

  render() {
    return (
      <div className="App">

<InstallPrompt />
        
        <h1>ALKOHOLISANJE        <SideNav
          allImages={this.state.allImages}
          list={this.state.list}
          handleCheckboxChange={this.handleCheckboxChange}
        /></h1>



        <button
          className="buttonB"
          onMouseEnter={this.reset}
          onTouchStart={this.reset}
          onClick={this.spin}
          disabled={this.state.spinning}
        >
          <div className="buttonB-top">Zavrti</div>
          <div className="buttonB-bottom"></div>
          <div className="buttonB-base"></div>
        </button>
        <span id="selector"><img style={{ width: '32vw' }} src={vinjak} alt="vinj" /></span>

        <canvas
          id="wheel"
          width="500"
          height="500"
          style={{
            transform: `rotate(${this.state.rotate}deg)`,
            transition: `transform ${this.state.easeOut}s ease-out`,
          }}
        />

<div>
  <span id="result">
    {this.state.result !== null && (
      <>
        <img
          style={{ width: "80px", height: '100px', border: '2px solid rgb(178, 189, 26)' }}
          src={this.state.list[this.state.result]}
          alt="prize"
        />

      </>
    )}
  </span>
        <div class="card">
  <div class="content">
    <div class="back">
      <div class="back-content">
      {" "}
      {this.state.allImages.find((image) => image.src === this.state.list[this.state.result])?.label}
    </div>
    </div>
  </div>
</div>
  <div style={{ marginTop: "30vw" }}>&nbsp;</div>
</div>

      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
