#include <MCP3008.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>


#define CS_PIN    D5
#define CLOCK_PIN D8
#define MOSI_PIN  D6
#define MISO_PIN  D7

#define PINKY     0
#define RING      1
#define MIDDLE    2
#define INDEX     3
#define THUMB     4

//#define X_AXIS
//#define Y_AXIS
//#define Z_AXIS

const char* ssid        = "IT_HURTS_WHEN_IP";
const char* password    = "PLDTWIFICE8F8";
const char* mqtt_server = "raspberrypi.local";

unsigned long lastMsg   = 0;
char data[80];
int hand_sensor[5];


WiFiClient espClient;
PubSubClient client(espClient);
MCP3008 adc(CLOCK_PIN, MOSI_PIN, MISO_PIN, CS_PIN);

void setup() {
  Serial.begin(115200);
  
  setup_wifi();
  client.setServer(mqtt_server, 1883);
}


void loop() {
  readFlex(hand_sensor);
  
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  
  unsigned long now = millis();
  if (now - lastMsg > 2000) {
    serial_sensor(hand_sensor);
    lastMsg = now;

    String pinky = "\"pinky\": " + String(hand_sensor[0]) ;
    String ring = ", \"ring\": " + String(hand_sensor[1]) ;
    String middle = ", \"middle\": " + String(hand_sensor[2]) ;
    String index = ", \"index\": " + String(hand_sensor[3]) ;
    String thumb = ", \"thumb\": " + String(hand_sensor[4]) ;

    String payload = pinky + ring + middle + index + thumb;
    String message = "{ \"devices\": \"*\",\"payload\": {" + payload + "}}";
 
    Serial.print("Publish message: ");
    Serial.println(message);

    payload.toCharArray(data, (message.length() + 1));
    client.publish("gesture_controller", data);
  }
}

void readFlex(int *hand_sensor) {
  hand_sensor[0] = adc.readADC(PINKY);
  hand_sensor[1] = adc.readADC(RING);
  hand_sensor[2] = adc.readADC(MIDDLE);
  hand_sensor[3] = adc.readADC(INDEX);
  hand_sensor[4] = adc.readADC(THUMB);
}

void serial_sensor(int *hand_sensor) {
  Serial.print("Pinky: ");
  Serial.println(hand_sensor[0]);
  Serial.print("Ring: ");
  Serial.println(hand_sensor[1]);
  Serial.print("Middle: ");
  Serial.println(hand_sensor[2]);
  Serial.print("Index: ");
  Serial.println(hand_sensor[3]);
  Serial.print("Thumb: ");
  Serial.println(hand_sensor[4]);
}

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  randomSeed(micros());

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    // Attempt to connect
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      // Once connected, publish an announcement...
      client.publish("gesture_controller", "hello world");
      // ... and resubscribe
      client.subscribe("inTopic");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}
