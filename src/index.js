import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import './button.css';

// Import your images
import kum from './kum.png';
import ja from './ja.png';
import coa from './coa.png';
import darko from './darko.png';
import jazic from './jazic.png';
import sone from './sone.png';
import dusan from './dusan.png';
import deja from './deja.png';
import ci from './centerImage.png';

class App extends React.Component {
  state = {
    list: [kum, ja, deja, dusan, coa, jazic, sone, darko],
    radius: 75, // PIXELS
    rotate: 0, // DEGREES
    easeOut: 0, // SECONDS
    angle: 0, // RADIANS
    top: null, // INDEX
    offset: null, // RADIANS
    net: null, // RADIANS
    result: null, // INDEX
    spinning: false,
  };

  componentDidMount() {
    // Generate canvas wheel on load
    this.renderWheel();
  }

  renderWheel() {
    let numOptions = this.state.list.length;
    let arcSize = (2 * Math.PI) / numOptions;
    this.setState({ angle: arcSize });
    this.topPosition(numOptions, arcSize);

    let angle = 0;
    for (let i = 0; i < numOptions; i++) {
      let imageUrl = this.state.list[i];
      this.renderSector(i + 1, imageUrl, angle, arcSize, this.getColor());
      angle += arcSize;
    }

    // Draw the center image
    this.drawCenterImage();
  }

  drawCenterImage() {
    let canvas = document.getElementById("wheel");
    let ctx = canvas.getContext("2d");
    const centerImageSize = 80; // Adjust the size of the center image
    const x = canvas.width / 2 - centerImageSize / 2; // Centering the image horizontally
    const y = canvas.height / 2 - centerImageSize / 2; // Centering the image vertically

    const img = new Image();
    img.src = ci;
    img.onload = () => {
      ctx.drawImage(img, x, y, centerImageSize, centerImageSize);
    };
  }

  topPosition = (num, angle) => {
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
  };

  renderSector(index, imageUrl, start, arc, color) {
    let canvas = document.getElementById("wheel");
    let ctx = canvas.getContext("2d");
    let x = canvas.width / 2;
    let y = canvas.height / 2;
    let radius = this.state.radius;
    let startAngle = start;
    let endAngle = start + arc;
    let angle = index * arc;
    let baseSize = radius * 3.33;
    let imageRadius = baseSize - 150;

    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle, false);
    ctx.lineWidth = radius * 2;
    ctx.strokeStyle = color;
    ctx.stroke();

    // Load and draw image in each sector
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      ctx.save();
      ctx.translate(
        baseSize + Math.cos(angle - arc / 2) * imageRadius,
        baseSize + Math.sin(angle - arc / 2) * imageRadius
      );
      ctx.rotate(angle - arc / 2 + Math.PI / 2);
      ctx.drawImage(img, -30, -30, 50, 66);
      ctx.restore();
    };
  }

  getColor() {
    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);
    return `rgba(${r},${g},${b},0.4)`;
  }

  spin = () => {
    // Disable spinning if it's already in progress
    if (this.state.spinning) return;

    // Add a substantial random spin to ensure it appears to spin fully each time
    let randomSpin = Math.floor(Math.random() * 900) + 3000; // Minimum of 3000 ms
    this.setState((prevState) => ({
      rotate: prevState.rotate + randomSpin, // Add to previous rotation
      easeOut: 3, // Duration for easing out should match the spin duration
      spinning: true,
    }));

    setTimeout(() => {
      this.getResult(randomSpin);
    }, 3000); // Set the timeout to the same duration as the spin
  };

  getResult = (spin) => {
    const { angle, top, offset, list } = this.state;
    let netRotation = ((spin % 360) * Math.PI) / 180;
    let travel = netRotation + offset;
    let count = top + 1;

    while (travel > 0) {
      travel = travel - angle;
      count--;
    }
    let result = count >= 0 ? count : list.length + count;

    // Set state variable to display result and reset spinning
    this.setState({
      net: netRotation,
      result: result,
      spinning: false, // Reset spinning to false here
    });
  };

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
        <h1>ALKOHOLISANJE</h1>
        <button type="button" className="buttonB">
          <div
            className="buttonB-top"
            onMouseEnter={this.reset}
            onTouchStart={this.reset}
            onClick={this.spin}
            disabled={this.state.spinning}
          >
            Zavrti
          </div>
          <div className="buttonB-bottom"></div>
          <div className="buttonB-base"></div>
        </button>
        <span id="selector">&#9660;</span>
        <canvas
          id="wheel"
          width="500" // Keep these dimensions fixed
          height="500"
          style={{
            WebkitTransform: `rotate(${this.state.rotate}deg)`,
            WebkitTransition: `-webkit-transform ${this.state.easeOut}s ease-out`,
          }}
        />
        <div>
          <span id="readout">
            {"  "}
            <span id="result">
              {this.state.result !== null && (
                <img style={{ maxWidth: '100px' }} src={this.state.list[this.state.result]} alt="prize" />
              )}
            </span>
          </span>
        </div>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
