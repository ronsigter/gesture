import React, { useState, useRef, useContext, useEffect } from "react";
import { StateContext } from "../../Context";

import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";

let deviceCache = null;
let characteristicCache = null;

const Service = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const Characteristic = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

const options = {
  filters: [{ services: [Service] }]
  // acceptAllDevices: true,
  // optionalServices: []
};

export default () => {
  const [logText, setLogText] = useState("");
  const logRef = useRef(null);
  const { dispatch } = useContext(StateContext);

  // Launch Bluetooth device chooser and connect to the selected
  const connect = () => {
    return (deviceCache
      ? Promise.resolve(deviceCache)
      : requestBluetoothDevice()
    )
      .then(device => connectDeviceAndCacheCharacteristic(device))
      .then(characteristic => startNotifications(characteristic))
      .catch(error => log(error));
  };

  // Disconnect from the connected device
  const disconnect = () => {
    if (deviceCache) {
      log('Disconnecting from "' + deviceCache.name + '" bluetooth device...');
      deviceCache.removeEventListener(
        "gattserverdisconnected",
        handleDisconnection
      );

      if (deviceCache.gatt.connected) {
        deviceCache.gatt.disconnect();
        log('"' + deviceCache.name + '" bluetooth device disconnected');
      } else {
        log(
          '"' + deviceCache.name + '" bluetooth device is already disconnected'
        );
      }
    }

    if (characteristicCache) {
      characteristicCache.removeEventListener(
        "characteristicvaluechanged",
        handleCharacteristicValueChanged
      );
      characteristicCache = null;
    }

    deviceCache = null;
  };

  // Send data to the connected device
  // const send = data => {
  //   data = String(data);

  //   if (!data || !characteristicCache) {
  //     return;
  //   }

  //   writeToCharacteristic(characteristicCache, data);
  //   log(data, "out");
  // };

  const requestBluetoothDevice = () => {
    log("Requesting bluetooth device...");

    return navigator.bluetooth.requestDevice(options).then(device => {
      log('"' + device.name + '" bluetooth device selected');
      deviceCache = device;

      deviceCache.addEventListener(
        "gattserverdisconnected",
        handleDisconnection
      );

      return deviceCache;
    });
  };

  const handleDisconnection = event => {
    let device = event.target;

    log(
      '"' +
        device.name +
        '" bluetooth device disconnected, trying to reconnect...'
    );

    connectDeviceAndCacheCharacteristic(device)
      .then(characteristic => startNotifications(characteristic))
      .catch(error => log(error));
  };

  // Connect to the device specified, get service and characteristic
  const connectDeviceAndCacheCharacteristic = device => {
    if (device.gatt.connected && characteristicCache) {
      return Promise.resolve(characteristicCache);
    }

    log("Connecting to GATT server...");

    return device.gatt
      .connect()
      .then(server => {
        log("GATT server connected, getting service...");

        return server.getPrimaryService(Service);
      })
      .then(service => {
        log("Service found, getting characteristic...");

        return service.getCharacteristic(Characteristic);
      })
      .then(characteristic => {
        log("Characteristic found");
        characteristicCache = characteristic;
        return characteristicCache;
      });
  };

  // Enable the characteristic changes notification
  const startNotifications = characteristic => {
    log("Starting notifications...");

    return characteristic.startNotifications().then(() => {
      log("Notifications started");

      characteristic.addEventListener(
        "characteristicvaluechanged",
        handleCharacteristicValueChanged
      );
    });
  };

  const handleCharacteristicValueChanged = event => {
    const value = new TextDecoder()
      .decode(event.target.value)
      .replace(/'/g, "");
    console.log("rx: ", value);
    dispatch({
      type: "updateData",
      payload: JSON.parse(value)
    });
  };

  // const writeToCharacteristic = (characteristic, data) => {
  //   characteristic.writeValue(new TextEncoder().encode(data));
  // };

  // Output to terminal
  const log = (data, type = "") => {
    const log = `${logRef.current.value}\nData: ${data}`;
    console.log(log);
    setLogText(log);
  };

  useEffect(() => {
    console.log("Disconnecting any devices...");
    disconnect();
  }, []);

  return (
    <>
      <Row>Logs about bluetooth connection:</Row>
      <Row style={{ height: "70%" }}>
        <textarea
          style={{ width: "100%", height: "100%" }}
          value={logText.replace(/\\n/g, String.fromCharCode(13, 10))}
          ref={logRef}
          readOnly
        />
      </Row>
      <Row>
        <Button onClick={connect} block>
          Connect
        </Button>
      </Row>
      <Row>
        <Button variant="danger" onClick={disconnect} block>
          disconnect
        </Button>
      </Row>
    </>
  );
};
