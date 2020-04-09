import React, { useState } from "react";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";

import Ble from "./components/Ble";
import Ges from "./components/TTS";
import Spe from "./components/STT";

function App() {
  const [view, setView] = useState("ble");

  return (
    <Container fluid style={{ height: "90vh" }}>
      <Nav
        fill
        justify
        variant="tabs"
        defaultActiveKey="ble"
        onSelect={selectedKey => setView(selectedKey)}
      >
        <Nav.Item>
          <Nav.Link eventKey="ble">Bluetooth</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="ges">Gesture</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="spe">Speech</Nav.Link>
        </Nav.Item>
      </Nav>
      <Container
        fluid
        style={{
          position: "fixed",
          height: "100%",
          width: "95%",
          display: view === "ble" ? "block" : "none"
        }}
      >
        <Ble />
      </Container>
      <Container
        fluid
        style={{
          position: "fixed",
          height: "100%",
          width: "95%",
          display: view === "ges" ? "block" : "none"
        }}
      >
        <Ges />
      </Container>
      <Container
        fluid
        style={{
          position: "fixed",
          height: "100%",
          width: "95%",
          display: view === "spe" ? "block" : "none"
        }}
      >
        <Spe />
      </Container>
    </Container>
  );
}

export default App;
